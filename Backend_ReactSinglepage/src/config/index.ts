import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI!,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret-key-for-development-only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret-key-for-development-only',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // Increased from 100 to 1000
  },
  
  // Supabase (optional - for image storage)
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // VNPay configuration
  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE || 'JQV2XIVU',
    hashSecret: process.env.VNPAY_HASH_SECRET || 'UC3W9EZFGKNEG1F038WJ4W8WZ01OQ2A7',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-success',
    ipnUrl: process.env.VNPAY_IPN_URL || 'http://localhost:5000/api/payment/vnpay/callback',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

