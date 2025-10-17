const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000/api';

export type CartItemInput = {
  productId: string;
  quantity: number;
  price: number;
  categoryId?: string;
};

export type Promotion = {
  _id: string;
  name: string;
  type: 'order_threshold' | 'combo' | 'flash_sale' | 'category_bundle';
  discountPercent?: number;
  dailyStartTime?: string;
  dailyEndTime?: string;
  startDate: string;
  endDate: string;
};

export async function fetchActivePromotions(): Promise<Promotion[]> {
  const res = await fetch(`${API_BASE}/promotions/active`);
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to load promotions');
  return data.data || [];
}

export async function applyPromotions(items: CartItemInput[]) {
  const res = await fetch(`${API_BASE}/promotions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to apply promotions');
  return data.data as { subtotal: number; discountAmount: number; finalTotal: number; appliedRules: { id: string; name: string; type: string; discount: number }[] };
}

export async function validatePromotionCode(code: string, orderAmount: number) {
  const res = await fetch(`${API_BASE}/promotions/validate-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderAmount })
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to validate promotion code');
  return data.data as { code: string; discountAmount: number; finalAmount: number };
}


