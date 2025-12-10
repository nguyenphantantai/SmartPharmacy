import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { SearchHistory, ViewHistory } from '../models/schema.js';

/**
 * Middleware để lưu lịch sử tìm kiếm
 * Sử dụng cho các route search
 */
export async function trackSearchHistory(
  req: AuthenticatedRequest | Request,
  res: Response,
  next: NextFunction
) {
  try {
    const keyword = req.query.search || req.query.keyword || req.body.keyword;
    
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return next();
    }

    const userId = (req as AuthenticatedRequest).user?.id || null;
    const clickResult = req.query.productId || req.body.productId || null;

    // Lưu search history (async, không block request)
    SearchHistory.create({
      userId: userId ? userId : undefined,
      keyword: keyword.trim(),
      clickResult: clickResult || undefined,
    }).catch(err => {
      console.error('Error saving search history:', err);
      // Không throw error, chỉ log để không ảnh hưởng đến request
    });

    next();
  } catch (error) {
    console.error('Error in trackSearchHistory middleware:', error);
    next(); // Tiếp tục request dù có lỗi
  }
}

/**
 * Middleware để lưu lịch sử xem sản phẩm
 * Sử dụng cho route GET /api/products/:id
 */
export async function trackViewHistory(
  req: AuthenticatedRequest | Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = req.params.id;
    
    if (!productId) {
      return next();
    }

    const userId = (req as AuthenticatedRequest).user?.id || null;

    // Lưu view history (async, không block request)
    ViewHistory.create({
      userId: userId ? userId : undefined,
      productId: productId,
    }).catch(err => {
      console.error('Error saving view history:', err);
      // Không throw error, chỉ log để không ảnh hưởng đến request
    });

    next();
  } catch (error) {
    console.error('Error in trackViewHistory middleware:', error);
    next(); // Tiếp tục request dù có lỗi
  }
}

