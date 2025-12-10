import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin, validateUserRegisterWithOTP } from '../middleware/validation.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.post('/register', validateUserRegisterWithOTP, AuthController.register);
router.post('/login', validateUserLogin, AuthController.login);
router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/verify-firebase-token', AuthController.verifyFirebaseToken);
router.post('/google-signin', AuthController.googleSignIn);

// Debug routes for development
if (process.env.NODE_ENV === 'development') {
  router.post('/debug-generate-otp', AuthController.generateDebugOTP);
  router.get('/test-otp/:phone', (req, res) => {
    const { phone } = req.params;
    // This is just for development testing
    res.json({ 
      message: 'Check server console for OTP',
      phone 
    });
  });
}

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), AuthController.uploadAvatar as any);
router.put('/change-password', authenticateToken, AuthController.changePassword);
router.post('/complete-profile', authenticateToken, upload.single('avatar'), AuthController.completeProfile as any);

export default router;




