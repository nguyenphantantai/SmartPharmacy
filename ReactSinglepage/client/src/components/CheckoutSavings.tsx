import React, { useEffect, useMemo, useState } from 'react';
import { applyPromotions, fetchActivePromotions, validatePromotionCode } from '../api/promotions';
import { validateCoupon } from '../api/coupons';
import { getLoyaltyAccount } from '../api/loyalty';
import { useFlashSaleCountdown } from '../hooks/useFlashSaleCountdown';

type CartItem = { productId: string; quantity: number; price: number; categoryId?: string };

type Props = {
  items: CartItem[];
  subtotal: number;
  onPricingChange?: (pricing: { subtotal: number; discountAmount: number; finalTotal: number; couponDiscount?: number; pointsRedeem?: number }) => void;
};

export default function CheckoutSavings({ items, subtotal, onPricingChange }: Props) {
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedRules, setAppliedRules] = useState<{ id: string; name: string; type: string; discount: number }[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loyalty, setLoyalty] = useState<{ pointsBalance: number } | null>(null);
  const [usePoints, setUsePoints] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    fetchActivePromotions().then(setPromos).catch(() => {});
  }, []);

  // Load applied coupon from localStorage on mount
  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem('applied_coupon');
      if (savedCoupon) {
        const couponData = JSON.parse(savedCoupon);
        setAppliedCoupon(couponData);
        setCouponDiscount(couponData.discountAmount || 0);
      }
    } catch (error) {
      console.error('Error loading saved coupon:', error);
    }
  }, []);

  useEffect(() => {
    if (!items?.length) return;
    applyPromotions(items).then(res => {
      setPromoDiscount(res.discountAmount || 0);
      setAppliedRules(res.appliedRules || []);
      onPricingChange?.({ subtotal: res.subtotal, discountAmount: res.discountAmount, finalTotal: res.finalTotal, couponDiscount, pointsRedeem: usePoints * 10000 });
    }).catch(() => {});
  }, [JSON.stringify(items)]);

  useEffect(() => {
    getLoyaltyAccount().then(setLoyalty).catch(() => setLoyalty(null));
  }, []);

  const flash = useMemo(() => promos.find(p => p.type === 'flash_sale'), [promos]);
  const { isActive, hh, mm, ss } = useFlashSaleCountdown(flash?.dailyStartTime, flash?.dailyEndTime);

  async function onValidateCoupon() {
    try {
      // Try promotion code first
      const orderAmount = subtotal - promoDiscount;
      try {
        const promoRes = await validatePromotionCode(coupon, orderAmount);
        const discountAmount = promoRes.discountAmount || 0;
        setCouponDiscount(discountAmount);
        
        // Save applied coupon to localStorage
        const couponData = {
          code: coupon,
          name: promoRes.data?.promotion?.name || coupon,
          discountAmount: discountAmount,
          appliedAt: new Date().toISOString()
        };
        localStorage.setItem('applied_coupon', JSON.stringify(couponData));
        setAppliedCoupon(couponData);
        
        onPricingChange?.({ subtotal, discountAmount: promoDiscount + discountAmount, finalTotal: subtotal - promoDiscount - discountAmount - usePoints * 10000, couponDiscount: discountAmount, pointsRedeem: usePoints * 10000 });
        return;
      } catch {}

      // Fallback to coupon
      const res = await validateCoupon(coupon, orderAmount);
      const discountAmount = res.discountAmount || 0;
      setCouponDiscount(discountAmount);
      
      // Save applied coupon to localStorage
      const couponData = {
        code: coupon,
        name: res.data?.coupon?.name || coupon,
        discountAmount: discountAmount,
        appliedAt: new Date().toISOString()
      };
      localStorage.setItem('applied_coupon', JSON.stringify(couponData));
      setAppliedCoupon(couponData);
      
      onPricingChange?.({ subtotal, discountAmount: promoDiscount + discountAmount, finalTotal: subtotal - promoDiscount - discountAmount - usePoints * 10000, couponDiscount: discountAmount, pointsRedeem: usePoints * 10000 });
    } catch (e) {
      setCouponDiscount(0);
    }
  }

  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    localStorage.removeItem('applied_coupon');
    onPricingChange?.({ subtotal, discountAmount: promoDiscount, finalTotal: subtotal - promoDiscount - usePoints * 10000, couponDiscount: 0, pointsRedeem: usePoints * 10000 });
  };

  function onChangePoints(v: number) {
    const maxCanUse = Math.min(loyalty?.pointsBalance || 0, Math.floor((subtotal - promoDiscount - couponDiscount) / 10000));
    const clamped = Math.max(0, Math.min(maxCanUse, v));
    setUsePoints(clamped);
    onPricingChange?.({ subtotal, discountAmount: promoDiscount + couponDiscount, finalTotal: subtotal - promoDiscount - couponDiscount - clamped * 10000, couponDiscount, pointsRedeem: clamped * 10000 });
  }

  const totalDiscount = promoDiscount + couponDiscount + usePoints * 10000;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="text-sm">Bạn được giảm <b>{(totalDiscount).toLocaleString('vi-VN')}đ</b></div>
      {appliedRules?.length > 0 && (
        <ul className="text-xs list-disc pl-5">
          {appliedRules.map(r => (
            <li key={r.id}>{r.name} ({r.type}) - giảm {(r.discount).toLocaleString('vi-VN')}đ</li>
          ))}
        </ul>
      )}

      {flash && (
        <div className="text-sm">
          Flash Sale: {isActive ? 'Đang diễn ra' : 'Sắp diễn ra'}
          {isActive && (
            <span className="ml-2 font-mono">{String(hh).padStart(2,'0')}:{String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {appliedCoupon ? (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
            <span className="text-sm text-green-800">✓ {appliedCoupon.name} ({appliedCoupon.code})</span>
            <span className="text-xs text-green-600">Đã giảm {couponDiscount.toLocaleString('vi-VN')}đ</span>
            <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 text-xs">✕</button>
          </div>
        ) : (
          <>
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Nhập mã Coupon"
              className="border rounded px-2 py-1 text-sm w-40" />
            <button onClick={onValidateCoupon} className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Áp dụng</button>
          </>
        )}
      </div>

      {loyalty && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Điểm hiện có: <b>{loyalty.pointsBalance}</b></span>
          <input type="number" value={usePoints} min={0} onChange={e => onChangePoints(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm w-24" />
          <span className="text-xs text-gray-500">(1 điểm = 10.000đ)</span>
        </div>
      )}

      <div className="text-sm">Tạm tính: <b>{subtotal.toLocaleString('vi-VN')}đ</b></div>
      <div className="text-sm">Tổng giảm: <b>{(totalDiscount).toLocaleString('vi-VN')}đ</b></div>
      <div className="text-base">Thành tiền: <b>{finalTotal.toLocaleString('vi-VN')}đ</b></div>
    </div>
  );
}


