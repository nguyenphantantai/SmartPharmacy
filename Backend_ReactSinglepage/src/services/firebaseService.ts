import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../config/index.js';

// Initialize Firebase Admin SDK
let firebaseAdminInitialized = false;

function initializeFirebaseAdmin() {
  if (firebaseAdminInitialized) {
    return;
  }

  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length > 0) {
      console.log('🔥 Firebase Admin already initialized');
      firebaseAdminInitialized = true;
      return;
    }

    // Initialize with environment variables or service account
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.FIREBASE_PROJECT_ID || 'quanlinhathuocai';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (serviceAccountPath) {
      // Initialize with service account file
      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: projectId,
        });
        console.log('🔥 Firebase Admin initialized with service account file');
      } catch (fileError: any) {
        console.error('❌ Error reading service account file:', fileError.message);
        throw fileError;
      }
    } else if (clientEmail && privateKey) {
      // Initialize with environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
        projectId: projectId,
      });
      console.log('🔥 Firebase Admin initialized with environment variables');
    } else {
      // Try to initialize with default credentials (for Google Cloud environments)
      try {
        admin.initializeApp({
          projectId: projectId,
        });
        console.log('🔥 Firebase Admin initialized with default credentials');
      } catch (error) {
        console.warn('⚠️ Firebase Admin SDK not fully configured. Phone token verification may not work.');
        console.warn('⚠️ Please set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY');
        // Don't throw error, allow app to continue (client-side verification will still work)
      }
    }

    firebaseAdminInitialized = true;
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization error:', error);
    console.warn('⚠️ Continuing without Firebase Admin SDK. Client-side verification will still work.');
    // Don't throw error, allow app to continue
  }
}

export class FirebasePhoneService {
  static async sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔥 [Firebase] Sending OTP to ${phone}`);
      
      // Note: Firebase Phone Authentication is handled on the client side
      // Backend only verifies the ID token after client sends OTP
      // This method is kept for compatibility but doesn't actually send OTP
      
      return { success: true };
    } catch (error) {
      console.error('Firebase OTP send error:', error);
      return { success: false, error: 'Failed to send OTP via Firebase' };
    }
  }

  static async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔥 [Firebase] Verifying OTP for ${phone}: ${otp}`);
      
      // Note: OTP verification is handled on the client side with Firebase SDK
      // This method is kept for compatibility
      
      return { success: true };
    } catch (error) {
      console.error('Firebase OTP verify error:', error);
      return { success: false, error: 'Failed to verify OTP via Firebase' };
    }
  }

  /**
   * Verify Firebase ID token from client-side Phone Authentication
   * This is called after client successfully verifies OTP and gets ID token
   */
  static async verifyFirebaseToken(idToken: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('🔥 [Firebase] Verifying ID token...');
      
      // Initialize Firebase Admin if not already done
      initializeFirebaseAdmin();

      // Check if Firebase Admin is available
      if (admin.apps.length === 0) {
        console.warn('⚠️ Firebase Admin SDK not initialized. Token verification skipped.');
        // For development, you might want to allow this
        // In production, you should always verify tokens
        return {
          success: false,
          error: 'Firebase Admin SDK not configured. Please set up Firebase Admin credentials.',
        };
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      console.log('✅ Firebase ID token verified successfully');
      console.log('👤 User UID:', decodedToken.uid);
      console.log('📱 Phone number:', decodedToken.phone_number);
      
      return {
        success: true,
        user: {
          uid: decodedToken.uid,
          phone: decodedToken.phone_number,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified || false,
          phoneVerified: !!decodedToken.phone_number,
        },
      };
    } catch (error: any) {
      console.error('❌ Firebase token verification error:', error);
      
      let errorMessage = 'Failed to verify Firebase token';
      
      if (error.code === 'auth/argument-error') {
        errorMessage = 'Invalid Firebase ID token format';
      } else if (error.code === 'auth/id-token-expired') {
        errorMessage = 'Firebase ID token has expired';
      } else if (error.code === 'auth/id-token-revoked') {
        errorMessage = 'Firebase ID token has been revoked';
      } else if (error.code === 'auth/invalid-id-token') {
        errorMessage = 'Invalid Firebase ID token';
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export class FirebaseGoogleService {
  static async verifyGoogleToken(token: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log(`🔥 [Firebase Google] Verifying token`);
      
      // In a real implementation, you would verify with Firebase Admin SDK here
      // For now, we'll just simulate success
      
      return { 
        success: true, 
        user: {
          uid: 'google_user_id',
          email: 'user@example.com',
          name: 'Google User'
        }
      };
    } catch (error) {
      console.error('Firebase Google verify error:', error);
      return { success: false, error: 'Failed to verify Google token' };
    }
  }
}

export async function initializeFirebase(): Promise<void> {
  try {
    console.log('🔥 Initializing Firebase Admin SDK...');
    initializeFirebaseAdmin();
    console.log('🔥 Firebase Admin SDK initialization completed');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Don't throw error, allow app to continue
    // Client-side Firebase will still work
  }
}
