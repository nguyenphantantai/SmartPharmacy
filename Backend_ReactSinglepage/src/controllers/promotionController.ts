import { Request, Response } from 'express';
import { Promotion, PromotionItem } from '../models/schema';
import { evaluatePromotions } from '../services/pricingService';

export class PromotionController {
  static async getAllPromotions(req: Request, res: Response) {
    try {
      // Optional filters: activeOnly, from, to
      const { activeOnly } = (req.query || {}) as any;
      const now = new Date();
      const filter: any = {};
      if (String(activeOnly) === 'true') {
        filter.isActive = true;
        filter.startDate = { $lte: now };
        filter.endDate = { $gte: now };
      }

      const promotions = await Promotion.find(filter).sort({ updatedAt: -1 }).lean();
      res.json({ success: true, data: promotions });
    } catch (error) {
      console.error('Get promotions error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getActivePromotions(req: Request, res: Response) {
    try {
      const now = new Date();
      const promotions = await Promotion.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      }).lean();

      res.json({ success: true, data: promotions });
    } catch (error) {
      console.error('Get active promotions error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getPromotionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const promotion = await Promotion.findById(id).lean();
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
      const items = await PromotionItem.find({ promotionId: promotion._id })
        .populate('productId', 'name price imageUrl')
        .lean();

      res.json({ success: true, data: { ...promotion, items } });
    } catch (error) {
      console.error('Get promotion by id error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async createPromotion(req: Request, res: Response) {
    try {
      const { items, ...data } = req.body;
      const promotion = await Promotion.create(data);

      if (Array.isArray(items) && items.length > 0) {
        await PromotionItem.insertMany(items.map((it: any) => ({
          promotionId: promotion._id,
          productId: it.productId,
          requiredQuantity: it.requiredQuantity || 1,
        })));
      }

      res.status(201).json({ success: true, message: 'Promotion created', data: promotion });
    } catch (error) {
      console.error('Create promotion error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async updatePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { items, ...data } = req.body;
      const promotion = await Promotion.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }

      if (Array.isArray(items)) {
        await PromotionItem.deleteMany({ promotionId: promotion._id });
        if (items.length > 0) {
          await PromotionItem.insertMany(items.map((it: any) => ({
            promotionId: promotion._id,
            productId: it.productId,
            requiredQuantity: it.requiredQuantity || 1,
          })));
        }
      }

      res.json({ success: true, message: 'Promotion updated', data: promotion });
    } catch (error) {
      console.error('Update promotion error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async deletePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const promotion = await Promotion.findByIdAndDelete(id);
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
      await PromotionItem.deleteMany({ promotionId: id });
      res.json({ success: true, message: 'Promotion deleted' });
    } catch (error) {
      console.error('Delete promotion error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Apply promotions to a cart (public)
  static async applyToCart(req: Request, res: Response) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Items required' });
      }
      const result = await evaluatePromotions(items);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Apply promotions error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Validate promotion code against order amount
  static async validateCode(req: Request, res: Response) {
    console.log('validateCode called with:', { code: req.body?.code, orderAmount: req.body?.orderAmount });
    try {
      let { code, orderAmount } = req.body as any;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Promotion code is required' });
      }
      const raw = String(code).trim();
      const norm = raw.toUpperCase();
      const body: any = req.body || {};
      const amount = Number(
        orderAmount ?? body.amount ?? body.total ?? body.subtotal ?? body.orderTotal ?? 0
      );

      // Use Vietnam timezone (UTC+7) for date comparison
      const now = new Date();
      const vietnamOffset = 7 * 60; // UTC+7 in minutes
      const vietnamTime = new Date(now.getTime() + (vietnamOffset * 60 * 1000));
      
      // For date comparison, we only care about the date part (YYYY-MM-DD), not the time
      const nowDateOnly = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), vietnamTime.getDate());
      
      console.log('🔍 Searching for promotion:', { 
        code: norm, 
        raw, 
        now: now.toISOString(),
        vietnamTime: vietnamTime.toISOString(),
        nowDateOnly: nowDateOnly.toISOString(),
        amount 
      });

      // First, try to find by exact code match (case-insensitive)
      let promo = await Promotion.findOne({
        $or: [
          { code: norm },
          { code: raw },
          { code: { $regex: new RegExp(`^${raw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } }
        ]
      }).lean();

      console.log('🔍 Found promotion:', promo ? {
        _id: promo._id,
        code: promo.code,
        name: promo.name,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
        status: (promo as any).status,
        minOrderValue: promo.minOrderValue
      } : 'NOT FOUND');

      // Check if promotion exists
      if (!promo) {
        console.log('❌ Promotion not found in database');
        return res.status(404).json({ success: false, message: 'Mã khuyến mãi không tồn tại hoặc không hoạt động' });
      }

      // Check date validity - compare only date part (YYYY-MM-DD), not time
      const startDate = promo.startDate ? new Date(promo.startDate) : null;
      const endDate = promo.endDate ? new Date(promo.endDate) : null;
      
      if (startDate) {
        // Convert to Vietnam timezone and get date only
        const startDateVietnam = new Date(startDate.getTime() + (vietnamOffset * 60 * 1000));
        const startDateOnly = new Date(startDateVietnam.getFullYear(), startDateVietnam.getMonth(), startDateVietnam.getDate());
        
        if (nowDateOnly < startDateOnly) {
          console.log('❌ Promotion not started yet:', { 
            startDate: startDate.toISOString(), 
            startDateOnly: startDateOnly.toISOString(),
            now: now.toISOString(),
            nowDateOnly: nowDateOnly.toISOString()
          });
          return res.status(400).json({ success: false, message: 'Mã khuyến mãi chưa bắt đầu' });
        }
      }

      if (endDate) {
        // Convert to Vietnam timezone and get date only, then add 1 day to include the end date
        const endDateVietnam = new Date(endDate.getTime() + (vietnamOffset * 60 * 1000));
        const endDateOnly = new Date(endDateVietnam.getFullYear(), endDateVietnam.getMonth(), endDateVietnam.getDate());
        // Add 1 day to include the end date (promotion is valid until end of endDate)
        const endDateInclusive = new Date(endDateOnly);
        endDateInclusive.setDate(endDateInclusive.getDate() + 1);
        
        if (nowDateOnly >= endDateInclusive) {
          console.log('❌ Promotion expired:', { 
            endDate: endDate.toISOString(), 
            endDateOnly: endDateOnly.toISOString(),
            endDateInclusive: endDateInclusive.toISOString(),
            now: now.toISOString(),
            nowDateOnly: nowDateOnly.toISOString()
          });
          return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết hạn' });
        }
      }

      // Check if promotion is active
      const isActive = promo.isActive === true || (promo as any).status === 'active';
      if (!isActive) {
        console.log('❌ Promotion is not active:', { isActive: promo.isActive, status: (promo as any).status });
        return res.status(400).json({ success: false, message: 'Mã khuyến mãi không hoạt động' });
      }

      // Check minimum order value for all promotion types (not just order_threshold)
      if (promo.minOrderValue && amount < promo.minOrderValue) {
        console.log('❌ Order amount too low:', { amount, minOrderValue: promo.minOrderValue });
        return res.status(400).json({ success: false, message: `Đơn tối thiểu ${promo.minOrderValue.toLocaleString('vi-VN')}đ để dùng mã này` });
      }

      // Calculate discount amount purely by percentage on orderAmount with cap
      let discountAmount = 0;
      const percent = (promo as any).discountPercent ?? (promo as any).value ?? 0;
      if (percent) {
        discountAmount = Math.floor((amount * Number(percent)) / 100);
      }
      if (promo.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, promo.maxDiscountAmount);
      }

      console.log('✅ Promotion validated successfully:', {
        code: promo.code,
        discountAmount,
        finalAmount: Math.max(0, amount - discountAmount)
      });

      return res.json({ success: true, data: { code: promo.code || norm, discountAmount, finalAmount: Math.max(0, amount - discountAmount) } });
    } catch (error) {
      console.error('Validate promotion code error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}


