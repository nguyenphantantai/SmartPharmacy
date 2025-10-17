import { Request, Response } from 'express';
import { Promotion, PromotionItem } from '../models/schema';
import { evaluatePromotions } from '../services/pricingService';

export class PromotionController {
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

      const now = new Date();
      // Support both our schema and admin data: isActive or status='active'
      const promo = await Promotion.findOne({
        startDate: { $lte: now },
        endDate: { $gte: now },
        $or: [
          { code: norm },
          { code: { $regex: new RegExp(`^${raw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } }
        ],
        $and: [
          { $or: [ { isActive: true }, { status: 'active' } ] }
        ]
      }).lean();
      if (!promo) {
        return res.status(404).json({ success: false, message: 'Mã khuyến mãi không tồn tại hoặc không hoạt động' });
      }

      // Basic validation per type
      if (promo.type === 'order_threshold') {
        if (promo.minOrderValue && amount < promo.minOrderValue) {
          return res.status(400).json({ success: false, message: `Đơn tối thiểu ${promo.minOrderValue.toLocaleString('vi-VN')}đ để dùng mã này` });
        }
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

      return res.json({ success: true, data: { code: promo.code || norm, discountAmount, finalAmount: Math.max(0, amount - discountAmount) } });
    } catch (error) {
      console.error('Validate promotion code error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}


