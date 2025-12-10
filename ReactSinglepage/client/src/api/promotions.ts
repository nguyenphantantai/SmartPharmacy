const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000';

export type CartItemInput = {
  productId: string;
  quantity: number;
  price: number;
  categoryId?: string;
};

export type Promotion = {
  _id: string;
  name: string;
  type: 'order_threshold' | 'combo' | 'flash_sale' | 'category_bundle' | 'discount' | 'freeship';
  description?: string;
  code?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive' | string;
  discountPercent?: number;
  value?: number;
  dailyStartTime?: string;
  dailyEndTime?: string;
  startDate: string;
  endDate: string;
  minOrderValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageCount?: number;
  usageLimit?: number;
};

export async function fetchActivePromotions(): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE}/api/promotions/active`);
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to load promotions');
  return data.data || [];
}

export async function fetchAllPromotions(activeOnly?: boolean): Promise<Promotion[]> {
  const url = new URL(`${API_BASE}/api/promotions`);
  if (activeOnly) url.searchParams.set('activeOnly', 'true');
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to load promotions');
  return data.data || [];
}

export async function applyPromotions(items: CartItemInput[]) {
  const res = await fetch(`${API_BASE}/api/promotions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to apply promotions');
  return data.data as { subtotal: number; discountAmount: number; finalTotal: number; appliedRules: { id: string; name: string; type: string; discount: number }[] };
}

export async function validatePromotionCode(code: string, orderAmount: number) {
  const res = await fetch(`${API_BASE}/api/promotions/validate-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderAmount })
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to validate promotion code');
  return data.data as { code: string; discountAmount: number; finalAmount: number };
}


