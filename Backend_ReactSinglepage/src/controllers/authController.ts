import { Request, Response } from 'express';
import { MulterRequest } from '../types/multer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/schema.js';
import { config } from '../config/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OTPService } from '../services/otpService.js';
import { FirebasePhoneService, FirebaseGoogleService, initializeFirebase } from '../services/firebaseService.js';

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expiresAt: Date; phone: string }>();

export class AuthController {
  // Register new user with OTP verification
  static async register(req: Request, res: Response) {
    try {
      console.log('Register request body:', req.body);
      const { phone, otp, password, email } = req.body;

      if (!phone || !otp || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone, OTP, and password are required',
        });
      }

      // Verify OTP first
      console.log('Looking for OTP for phone:', phone);
      console.log('Current OTP storage:', Array.from(otpStorage.keys()));
      const storedOTP = otpStorage.get(phone);

      if (!storedOTP) {
        console.log('OTP not found for phone:', phone);
        return res.status(400).json({
          success: false,
          message: 'OTP not found or expired. Please request a new OTP.',
        });
      }

      // Check if OTP is expired
      if (new Date() > storedOTP.expiresAt) {
        otpStorage.delete(phone);
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
        });
      }

      // Verify OTP
      if (storedOTP.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP',
        });
      }

      // Check if user already exists (only check phone, email is not unique)
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this phone number already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed successfully');

      // Create temporary user (profile incomplete)
      console.log('Creating temporary user with data:', {
        email,
        phone,
        firstName: 'Khách',
        lastName: 'Hàng',
        role: 'customer',
        isActive: true,
        isVerified: true, // Mark as verified after OTP
      });
      
      const createdUser = await User.create({
        email: email || undefined, // Email có thể là undefined
        phone,
        password: hashedPassword,
        firstName: 'Khách',
        lastName: 'Hàng',
        role: 'customer',
        isActive: true,
        isVerified: true, // User is verified after OTP
      });

      // Remove OTP from storage after successful registration
      otpStorage.delete(phone);

      // Generate JWT token
      const token = jwt.sign(
        { userId: String(createdUser._id) },
        config.jwtSecret as string,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công! Vui lòng hoàn thiện thông tin cá nhân.',
        data: {
          user: {
            id: String(createdUser._id),
            email: createdUser.email,
            phone: createdUser.phone,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            role: createdUser.role,
            isVerified: createdUser.isVerified,
            createdAt: createdUser.createdAt,
          },
          token,
          requiresProfileCompletion: true,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error stack:', (error as Error).stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        });
      }

      // Find user by email or phone
      const user = await User.findOne({ 
        $or: [
          { email: username },
          { phone: username }
        ]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: String(user._id) },
        config.jwtSecret as string,
        { expiresIn: '7d' }
      );

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user.toObject();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get current user profile
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user!.id).select('-password').lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { firstName, lastName, dateOfBirth, gender, address } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.user!.id,
        {
          firstName,
          lastName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
          address,
        },
        { new: true, select: '-password' }
      ).lean();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Change password
  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get current user
      const user = await User.findById(req.user!.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Generate random OTP
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Debug endpoint to generate test OTP
  static async generateDebugOTP(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required',
        });
      }

      // Generate test OTP
      const otp = AuthController.generateOTP();
      
      // Store OTP for verification (5 minutes expiry)
      otpStorage.set(phone, {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        phone: phone
      });

      console.log(`🔐 [DEBUG OTP] Generated test OTP for ${phone}: ${otp}`);
      console.log(`🔐 [DEBUG OTP] Use this OTP for testing: ${otp}`);
      console.log(`🔐 [DEBUG OTP] Phone: ${phone}`);
      console.log(`🔐 [DEBUG OTP] Time: ${new Date().toLocaleString()}`);
      console.log(`🔐 [DEBUG OTP] Expires at: ${new Date(Date.now() + 5 * 60 * 1000).toLocaleString()}`);

      res.status(200).json({
        success: true,
        message: 'Debug OTP generated successfully',
        data: {
          phone,
          otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          note: 'This is a test OTP for development purposes only'
        }
      });
    } catch (error) {
      console.error('Error generating debug OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Send OTP via Firebase
  static async sendOTP(req: Request, res: Response) {
    try {
      const { phone, method } = req.body;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required',
        });
      }

      if (!method || !['sms', 'zalo', 'firebase'].includes(method)) {
        return res.status(400).json({
          success: false,
          message: 'Method must be "sms", "zalo", or "firebase"',
        });
      }

      // Validate phone number format (Vietnamese)
      const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format. Please use Vietnamese phone number format.',
        });
      }

      // Initialize Firebase if not already done
      try {
        initializeFirebase();
      } catch (error) {
        console.error('Firebase initialization failed:', error);
      }

      if (method === 'firebase') {
        // Firebase Phone Authentication is handled on the client side
        // Backend only verifies the Firebase ID token
        res.status(200).json({
          success: true,
          message: 'Firebase Phone Auth ready - use client-side Firebase SDK',
          data: {
            method: 'firebase',
            phone,
            instructions: 'Use Firebase SDK on client to send OTP via SMS',
            recaptchaSiteKey: '6LcSxs4rAAAAAGuE5RfSkMqGdVmZigi--nN-axVy',
            expiresIn: 300, // 5 minutes in seconds
          },
        });
      } else {
        // Use legacy OTP service for SMS/Zalo
        const existingOTP = otpStorage.get(phone);
        if (existingOTP && new Date() < existingOTP.expiresAt) {
          const remainingTime = Math.ceil((existingOTP.expiresAt.getTime() - Date.now()) / 1000);
          return res.status(429).json({
            success: false,
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          });
        }

        // Generate OTP
        const otp = AuthController.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Store OTP
        otpStorage.set(phone, { otp, expiresAt, phone });
        console.log('OTP stored for phone:', phone, 'OTP:', otp);

        // Send OTP via the specified method
        const sent = await OTPService.sendOTP(phone, otp, method);

        if (!sent) {
          // Remove stored OTP if sending failed
          otpStorage.delete(phone);
          return res.status(500).json({
            success: false,
            message: `Failed to send OTP via ${method}. Please try again.`,
          });
        }

        // For development/testing, also log the OTP
        console.log(`\n🔐 ===== BACKEND OTP LOG =====`);
        console.log(`📱 Phone: ${phone}`);
        console.log(`🔢 OTP Code: ${otp}`);
        console.log(`📡 Method: ${method.toUpperCase()}`);
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`⏳ Expires in: 5 minutes`);
        console.log(`🔐 ============================\n`);

        res.status(200).json({
          success: true,
          message: `OTP sent successfully via ${method}`,
          data: {
            method,
            phone,
            expiresIn: 300, // 5 minutes in seconds
            // Only include OTP in development
            ...(process.env.NODE_ENV === 'development' && { otp }),
          },
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Verify OTP
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { phone, otp, method } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and OTP are required',
        });
      }

      // Initialize Firebase if not already done
      try {
        initializeFirebase();
      } catch (error) {
        console.error('Firebase initialization failed:', error);
      }

      if (method === 'firebase') {
        // Use Firebase verification
        const result = await FirebasePhoneService.verifyOTP(phone, otp);
        
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: result.error || 'OTP verification failed',
          });
        }

        // Generate JWT token for the user
        const token = jwt.sign(
          { userId: result.user.id },
          config.jwtSecret as string,
          { expiresIn: '7d' }
        );

        res.status(200).json({
          success: true,
          message: 'OTP verified successfully via Firebase',
          data: {
            user: {
              ...result.user,
              token,
            },
          },
        });
      } else {
        // Use legacy OTP verification
        const storedOTP = otpStorage.get(phone);

        if (!storedOTP) {
          return res.status(400).json({
            success: false,
            message: 'OTP not found or expired',
          });
        }

        // Check if OTP is expired
        if (new Date() > storedOTP.expiresAt) {
          otpStorage.delete(phone);
          return res.status(400).json({
            success: false,
            message: 'OTP has expired',
          });
        }

        // Verify OTP
        if (storedOTP.otp !== otp) {
          return res.status(400).json({
            success: false,
            message: 'Invalid OTP',
          });
        }

        // OTP is valid, but don't remove it yet - keep for registration
        // otpStorage.delete(phone); // Don't delete here, delete after successful registration

        // Check if user exists
        let user = await User.findOne({ phone });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            email: `${phone}@pharmacy.com`,
            phone,
            password: await bcrypt.hash('123456', 12), // Default password
            firstName: 'Khách',
            lastName: 'Hàng',
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: String(user._id) },
          config.jwtSecret as string,
          { expiresIn: '7d' }
        );

        res.status(200).json({
          success: true,
          message: 'OTP verified successfully',
          data: {
            user: {
              id: String(user._id),
              email: user.email,
              phone: user.phone,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
            token,
          },
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Firebase Phone Authentication - Verify ID Token
  static async verifyFirebaseToken(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Firebase ID token is required',
        });
      }

      // Initialize Firebase if not already done
      try {
        initializeFirebase();
      } catch (error) {
        console.error('Firebase initialization failed:', error);
        return res.status(500).json({
          success: false,
          message: 'Firebase initialization failed',
        });
      }

      // Verify Firebase token
      const result = await FirebasePhoneService.verifyFirebaseToken(idToken);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || 'Firebase authentication failed',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Firebase authentication successful',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      console.error('Firebase token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Google Sign-in
  static async googleSignIn(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Google ID token is required',
        });
      }

      // Initialize Firebase if not already done
      try {
        initializeFirebase();
      } catch (error) {
        console.error('Firebase initialization failed:', error);
        return res.status(500).json({
          success: false,
          message: 'Firebase initialization failed',
        });
      }

      // Verify Google token
      const result = await FirebaseGoogleService.verifyGoogleToken(idToken);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || 'Google authentication failed',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: result.user.id },
        config.jwtSecret as string,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Google sign-in successful',
        data: {
          user: {
            ...result.user,
            token,
          },
        },
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Complete Profile - Called after initial registration
  static async completeProfile(req: MulterRequest, res: Response) {
    try {
      console.log('Complete profile request body:', req.body);
      console.log('User from auth middleware:', req.user);
      
      const { firstName, lastName, dateOfBirth, gender, address } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      if (!firstName || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Họ tên và giới tính là bắt buộc',
        });
      }

      // Split full name into first and last name
      const nameParts = firstName.trim().split(' ');
      const firstNamePart = nameParts[0] || '';
      const lastNamePart = nameParts.slice(1).join(' ') || lastName || '';

      // Handle avatar upload if provided
      let avatarUrl = undefined;
      if (req.file) {
        // For now, we'll just store the file info
        // In production, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
        avatarUrl = `uploads/avatars/${req.file.originalname}`;
        console.log('Avatar file received:', req.file.originalname, req.file.size);
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstName: firstNamePart,
          lastName: lastNamePart,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
          address,
          ...(avatarUrl && { avatar: avatarUrl }),
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Handle avatar upload if provided
      if (req.file) {
        // Here you would upload to Cloudinary or your preferred storage
        // For now, we'll just store the filename
        (updatedUser as any).avatar = req.file.filename;
        await updatedUser.save();
      }

      res.status(200).json({
        success: true,
        message: 'Hoàn thiện thông tin cá nhân thành công!',
        data: {
          user: {
            id: String(updatedUser._id),
            email: updatedUser.email,
            phone: updatedUser.phone,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            dateOfBirth: updatedUser.dateOfBirth,
            gender: updatedUser.gender,
            address: updatedUser.address,
            avatar: (updatedUser as any).avatar,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
          },
        },
      });
    } catch (error) {
      console.error('Complete profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

