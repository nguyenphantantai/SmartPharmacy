import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/schema.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string; // Email có thể là undefined
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Auth middleware - Starting authentication...');
    const authHeader = req.headers['authorization'];
    console.log('Auth middleware - Auth header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Auth middleware - Token extracted:', token ? `${token.substring(0, 20)}...` : 'null');

    if (!token) {
      console.log('Auth middleware - No token provided');
      res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
      return;
    }

    console.log('Auth middleware - Verifying token...');
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    console.log('Auth middleware - Token decoded:', decoded);
    
    // Get user from database
    console.log('Auth middleware - Looking for user:', decoded.userId);
    const user = await User.findById(decoded.userId).lean();
    console.log('Auth middleware - User found:', user ? {
      id: user._id,
      isActive: user.isActive,
      role: user.role
    } : 'null');

    if (!user || !user.isActive) {
      console.log('Auth middleware - User not found or inactive');
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive user' 
      });
      return;
    }

    req.user = {
      id: String(user._id),
      ...(user.email && { email: user.email }), // Chỉ thêm email nếu có giá trị
      role: user.role,
    };
    
    console.log('Auth middleware - User authenticated:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });

    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
    return;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requirePharmacist = requireRole(['admin', 'customer']);

