import React, { useEffect, useMemo, useState } from 'react';
import { applyPromotions, fetchActivePromotions, validatePromotionCode } from '../api/promotions';
import { validateCoupon } from '../api/coupons';
import { getLoyaltyAccount } from '../api/loyalty';
import { useFlashSaleCountdown } from '../hooks/useFlashSaleCountdown';
import CouponSelector from './coupon-selector';

type CartItem = { productId: string; quantity: number; price: number; categoryId?: string };

type Props = {
  items: CartItem[];
  subtotal: number;
  onPricingChange?: (pricing: { subtotal: number; discountAmount: number; finalTotal: number; couponDiscount?: number; pointsRedeem?: number }) => void;
};

export default function CheckoutSavings({ items, subtotal, onPricingChange }: Props) {
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedRules, setAppliedRules] = useState<{ id: string; name: string; type: string; discount: number }[]>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loyalty, setLoyalty] = useState<{ pointsBalance: number } | null>(null);
  const [usePoints, setUsePoints] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    fetchActivePromotions().then(setPromos).catch(() => {});
  }, []);

  // Load applied coupon from localStorage on mount and when items change
  // Validate coupon with backend to ensure it's still valid
  useEffect(() => {
    const validateAndLoadCoupon = async () => {
      try {
        const savedCoupon = localStorage.getItem('applied_coupon');
        if (!savedCoupon) {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          return;
        }

        const couponData = JSON.parse(savedCoupon);
        const couponCode = couponData.code;

        if (!couponCode) {
          // No code, clear coupon
          localStorage.removeItem('applied_coupon');
          setAppliedCoupon(null);
          setCouponDiscount(0);
          return;
        }

        // Validate coupon with backend to ensure it's still valid
        try {
          // Try promotion code validation first
          const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/promotions/validate-code`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: couponCode,
              orderAmount: subtotal,
            }),
          });

          const data = await response.json();
          
          if (data.success) {
            // Coupon is still valid, update discount amount
            const discountAmount = data.data.discountAmount;
            setAppliedCoupon(couponData);
            setCouponDiscount(discountAmount);
            // Update localStorage with new discount amount
            localStorage.setItem('applied_coupon', JSON.stringify({
              ...couponData,
              discountAmount: discountAmount,
            }));
          } else {
            // Coupon is invalid or expired, remove it
            console.log('Coupon validation failed:', data.message);
            localStorage.removeItem('applied_coupon');
            setAppliedCoupon(null);
            setCouponDiscount(0);
          }
        } catch (promoError) {
          // Try coupon validation as fallback
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/coupons/validate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: couponCode,
                orderAmount: subtotal,
              }),
            });

            const data = await response.json();
            
            if (data.success) {
              // Coupon is still valid, update discount amount
              const discountAmount = data.data.discountAmount;
              setAppliedCoupon(couponData);
              setCouponDiscount(discountAmount);
              // Update localStorage with new discount amount
              localStorage.setItem('applied_coupon', JSON.stringify({
                ...couponData,
                discountAmount: discountAmount,
              }));
            } else {
              // Coupon is invalid or expired, remove it
              console.log('Coupon validation failed:', data.message);
              localStorage.removeItem('applied_coupon');
              setAppliedCoupon(null);
              setCouponDiscount(0);
            }
          } catch (couponError) {
            // Both validations failed, remove coupon
            console.error('Error validating coupon:', couponError);
            localStorage.removeItem('applied_coupon');
            setAppliedCoupon(null);
            setCouponDiscount(0);
          }
        }
      } catch (error) {
        console.error('Error loading saved coupon:', error);
        localStorage.removeItem('applied_coupon');
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    };

    validateAndLoadCoupon();
  }, [items, subtotal]); // Re-check when items or subtotal change

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

  const handleCouponApplied = (coupon: any, discountAmount: number) => {
    setCouponDiscount(discountAmount);
    setAppliedCoupon(coupon);
    onPricingChange?.({ subtotal, discountAmount: promoDiscount + discountAmount, finalTotal: subtotal - promoDiscount - discountAmount - usePoints * 10000, couponDiscount: discountAmount, pointsRedeem: usePoints * 10000 });
  };

  const handleCouponRemoved = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
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

      <CouponSelector
        orderAmount={subtotal - promoDiscount}
        onCouponApplied={handleCouponApplied}
        onCouponRemoved={handleCouponRemoved}
        appliedCoupon={appliedCoupon}
        discountAmount={couponDiscount}
      />

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


