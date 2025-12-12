import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

// Helper function to extract user ID from JWT token
function extractUserIdFromToken(req: Request): string | null {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.userId) {
        return decoded.userId;
      }
    }
  } catch (error) {
    // Ignore JWT decode errors
  }
  return null;
}

// Helper function to get client IP
function getClientIP(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = String(forwardedFor).split(',');
    return ips[0].trim();
  }
  return req.headers['x-real-ip'] as string || req.ip || req.socket.remoteAddress || 'unknown';
}

// General rate limiter - sử dụng user ID nếu có, fallback về IP
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  // Tăng rate limit cho production: 5000 requests trong 15 phút
  max: process.env.NODE_ENV === 'development' ? 10000 : (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5000')),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator: ưu tiên user ID, fallback về IP
  keyGenerator: (req) => {
    // Ưu tiên sử dụng user ID nếu có (tránh block tất cả users cùng IP)
    const userId = extractUserIdFromToken(req);
    if (userId) {
      return `user:${userId}`;
    }
    
    // Fallback về IP nếu không có user ID
    return `ip:${getClientIP(req)}`;
  },
  skip: (req) => {
    // Skip rate limiting for static files, images, and health checks
    return req.path.startsWith('/medicine-images') || 
           req.path.startsWith('/images') ||
           req.path === '/health' ||
           req.path === '/api/health';
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // More lenient in development
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to safely extract IP from headers (fixes trust proxy issue)
  keyGenerator: (req) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = String(forwardedFor).split(',');
      return ips[0].trim();
    }
    return req.headers['x-real-ip'] as string || req.ip || req.socket.remoteAddress || 'unknown';
  },
});

// API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not found';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// Development helper to reset rate limits
export const resetRateLimit = (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }

  // Clear rate limit for this IP
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`🔄 Resetting rate limit for IP: ${ip}`);
  
  // Reset all rate limiters
  generalLimiter.resetKey(ip);
  authLimiter.resetKey(ip);
  apiLimiter.resetKey(ip);
  
  res.json({
    success: true,
    message: 'Rate limit reset successfully',
    ip,
    timestamp: new Date().toISOString(),
  });
};




