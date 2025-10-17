import { Promotion, PromotionItem } from '../models/schema';

export interface CartItemInput {
  productId: string;
  quantity: number;
  price: number;
  categoryId?: string;
}

export interface PricingResult {
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  appliedRules: { id: string; name: string; type: string; discount: number }[];
}

export async function evaluatePromotions(items: CartItemInput[]): Promise<PricingResult> {
  const now = new Date();
  const activePromotions = await Promotion.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).lean();

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  let discountTotal = 0;
  const appliedRules: PricingResult['appliedRules'] = [];

  for (const promo of activePromotions) {
    let discountForPromo = 0;

    if (promo.type === 'order_threshold' && promo.minOrderValue && promo.discountPercent) {
      if (subtotal >= promo.minOrderValue) {
        discountForPromo = Math.floor((subtotal * promo.discountPercent) / 100);
      }
    }

    if (promo.type === 'flash_sale' && promo.discountPercent) {
      // Optional daily window
      let withinWindow = true;
      if (promo.dailyStartTime && promo.dailyEndTime) {
        const [sh, sm] = promo.dailyStartTime.split(':').map(Number);
        const [eh, em] = promo.dailyEndTime.split(':').map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const startMins = sh * 60 + (sm || 0);
        const endMins = eh * 60 + (em || 0);
        withinWindow = nowMins >= startMins && nowMins <= endMins;
      }
      if (withinWindow) {
        discountForPromo = Math.floor((subtotal * promo.discountPercent) / 100);
      }
    }

    if (promo.type === 'category_bundle' && promo.discountPercent && promo.applicableCategoryId) {
      const hasAny = items.some(it => String(it.categoryId) === String(promo.applicableCategoryId));
      if (hasAny) {
        discountForPromo = Math.floor((subtotal * promo.discountPercent) / 100);
      }
    }

    if (promo.type === 'combo') {
      const comboItems = await PromotionItem.find({ promotionId: promo._id }).lean();
      const productIdToQty = new Map<string, number>();
      for (const it of items) {
        productIdToQty.set(String(it.productId), (productIdToQty.get(String(it.productId)) || 0) + it.quantity);
      }
      const canApply = comboItems.every(ci => (productIdToQty.get(String(ci.productId)) || 0) >= ci.requiredQuantity);
      if (canApply && promo.discountPercent) {
        discountForPromo = Math.floor((subtotal * promo.discountPercent) / 100);
      }
    }

    if (promo.maxDiscountAmount) {
      discountForPromo = Math.min(discountForPromo, promo.maxDiscountAmount);
    }

    if (discountForPromo > 0) {
      discountTotal += discountForPromo;
      appliedRules.push({ id: String(promo._id), name: promo.name, type: promo.type, discount: discountForPromo });
    }
  }

  const finalTotal = Math.max(0, subtotal - discountTotal);
  return { subtotal, discountAmount: discountTotal, finalTotal, appliedRules };
}


