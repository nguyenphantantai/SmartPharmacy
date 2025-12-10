const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000';

export async function validateCoupon(code: string, orderAmount: number, userId?: string) {
  const res = await fetch(`${API_BASE}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderAmount, userId })
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Validate coupon failed');
  return data.data as { coupon: any; discountAmount: number; finalAmount: number };
}


