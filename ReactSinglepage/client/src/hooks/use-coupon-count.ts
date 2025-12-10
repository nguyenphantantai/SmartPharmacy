import { useState, useEffect } from 'react';
import { fetchAllPromotions } from '@/api/promotions';

export function useCouponCount() {
  const [couponCount, setCouponCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCouponCount = async () => {
      try {
        setIsLoading(true);
        const promotions = await fetchAllPromotions(false);
        // Filter active promotions only
        const now = new Date();
        const activePromotions = promotions.filter(promo => {
          if (!promo.isActive) return false;
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);
          return startDate <= now && endDate >= now;
        });
        setCouponCount(activePromotions.length);
      } catch (error) {
        console.error('Error loading coupon count:', error);
        setCouponCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadCouponCount();
  }, []);

  return { couponCount, isLoading };
}

