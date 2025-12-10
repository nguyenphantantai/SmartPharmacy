import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Tag, Gift } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CouponSelectorProps {
  orderAmount: number;
  onCouponApplied: (coupon: any, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
  discountAmount?: number;
}

interface SavedCoupon {
  _id: string;
  name: string;
  description?: string;
  type: 'order_threshold' | 'combo' | 'flash_sale' | 'category_bundle' | 'discount' | 'freeship';
  code?: string;
  isActive: boolean;
  status?: 'active' | 'inactive' | string;
  startDate: string;
  endDate: string;
  minOrderValue?: number;
  minOrderAmount?: number;
  discountPercent?: number;
  value?: number;
  maxDiscountAmount?: number;
  usageCount?: number;
  usageLimit?: number;
}

export default function CouponSelector({ 
  orderAmount, 
  onCouponApplied, 
  onCouponRemoved,
  appliedCoupon,
  discountAmount = 0
}: CouponSelectorProps) {
  const [savedCoupons, setSavedCoupons] = useState<SavedCoupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  // Load saved coupons from localStorage and validate with backend
  // Also fetch active promotions from API to ensure we have the latest data
  useEffect(() => {
    const loadAndValidateCoupons = async () => {
      try {
        // First, try to fetch active promotions from API to get latest data
        let activePromotions: SavedCoupon[] = [];
        try {
          const response = await apiRequest("GET", "/api/promotions?activeOnly=true");
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            activePromotions = data.data;
            console.log('Fetched active promotions from API:', activePromotions);
          }
        } catch (apiError) {
          console.error('Error fetching active promotions:', apiError);
        }

        // Then check localStorage for saved coupons
        const saved = localStorage.getItem('saved_coupons');
        let savedCouponsList: SavedCoupon[] = [];
        
        if (saved) {
          try {
            savedCouponsList = JSON.parse(saved);
            console.log('Loading saved coupons from localStorage:', savedCouponsList);
          } catch (parseError) {
            console.error('Error parsing saved coupons:', parseError);
          }
        }

        // Merge: Use saved coupons if they exist, otherwise use active promotions
        // But prioritize saved coupons that are still in active promotions
        const allCoupons = savedCouponsList.length > 0 ? savedCouponsList : activePromotions;

        // Validate each coupon with backend to ensure it's still valid
        const now = new Date();
        const validCoupons: SavedCoupon[] = [];
        const expiredCoupons: string[] = [];

        // Only process coupons that have a code (required for manual application)
        const couponsWithCode = allCoupons.filter(coupon => coupon.code && coupon.code.trim() !== '');

        for (const coupon of couponsWithCode) {
          // First check date validity locally
          const startDate = coupon.startDate ? new Date(coupon.startDate) : null;
          const endDate = coupon.endDate ? new Date(coupon.endDate) : null;
          
          // Check if coupon is expired by date - only remove truly expired coupons
          if (endDate && now > endDate) {
            console.log(`Coupon ${coupon.code || coupon._id} is expired (endDate: ${endDate})`);
            expiredCoupons.push(coupon._id || coupon.id);
            continue;
          }

          if (startDate && now < startDate) {
            // Not started yet, but keep it in saved list
            validCoupons.push(coupon);
            continue;
          }

          // Check if coupon is inactive - only remove truly inactive coupons
          if (coupon.isActive === false || coupon.status === 'inactive') {
            console.log(`Coupon ${coupon.code || coupon._id} is inactive`);
            expiredCoupons.push(coupon._id || coupon.id);
            continue;
          }

          // If coupon has code, validate with promotions API (since coupons are stored in promotions table)
          // But don't remove from saved list if validation fails due to order amount - that's temporary
          if (coupon.code) {
            try {
              const response = await apiRequest("POST", "/api/promotions/validate-code", {
                code: coupon.code,
                orderAmount: orderAmount,
              });

              const data = await response.json();
              
              if (data.success) {
                // Coupon is still valid according to promotions API
                validCoupons.push(coupon);
              } else {
                // Validation failed - but keep it in saved list if it's just a minimum order issue
                // Only remove if it's truly invalid (expired, not found, etc.)
                const errorMsg = data.message || '';
                if (errorMsg.includes('không tồn tại') || errorMsg.includes('không hoạt động')) {
                  // Truly invalid, remove it
                  console.log(`Promotion ${coupon.code} is invalid:`, data.message);
                  expiredCoupons.push(coupon._id || coupon.id);
                } else {
                  // Might just be minimum order issue, keep it
                  validCoupons.push(coupon);
                }
              }
            } catch (error) {
              console.error(`Error validating promotion ${coupon.code}:`, error);
              // If API call fails, keep the coupon in saved list to be safe
              validCoupons.push(coupon);
            }
          } else {
            // No code, just check date and active status
            // These are automatic promotions that don't require a code
            validCoupons.push(coupon);
          }
        }

        // Only remove truly expired/inactive coupons from localStorage
        if (expiredCoupons.length > 0) {
          const remainingCoupons = savedCouponsList.filter(c => 
            !expiredCoupons.includes(c._id || c.id)
          );
          localStorage.setItem('saved_coupons', JSON.stringify(remainingCoupons));
          console.log(`Removed ${expiredCoupons.length} expired/invalid coupons from localStorage`);
        }

        setSavedCoupons(validCoupons);
      } catch (error) {
        console.error('Error loading saved coupons:', error);
        setSavedCoupons([]);
      }
    };

    loadAndValidateCoupons();
  }, [orderAmount]); // Re-validate when order amount changes

  // Separate coupons into eligible and not eligible
  const eligibleCoupons = savedCoupons.filter(coupon => {
    const minOrder = coupon.minOrderValue || coupon.minOrderAmount || 0;
    return orderAmount >= minOrder;
  });
  
  const notEligibleCoupons = savedCoupons.filter(coupon => {
    const minOrder = coupon.minOrderValue || coupon.minOrderAmount || 0;
    return orderAmount < minOrder;
  });

  const handleApplyCoupon = async () => {
    if (!selectedCouponId) return;

    const selectedCoupon = savedCoupons.find(c => (c._id || c.id) === selectedCouponId);
    if (!selectedCoupon) return;

    console.log('Applying coupon:', selectedCoupon);
    console.log('Order amount:', orderAmount);

    setIsValidating(true);
    setError("");

    try {
      // Try promotion code validation first
      if (selectedCoupon.code) {
        console.log('Validating code:', selectedCoupon.code);
        try {
          const response = await apiRequest("POST", "/api/promotions/validate-code", {
            code: selectedCoupon.code,
            orderAmount: orderAmount,
          });

          const data = await response.json();
          console.log('Validation response:', data);
          
          if (data.success) {
            const discountAmount = data.data.discountAmount;
            console.log('Discount amount:', discountAmount);
            
            // Save to localStorage
            localStorage.setItem('applied_coupon', JSON.stringify({
              ...selectedCoupon,
              discountAmount: discountAmount,
              appliedAt: new Date().toISOString()
            }));
            
            onCouponApplied(selectedCoupon, discountAmount);
            setSelectedCouponId("");
            return;
          } else {
            console.log('Validation failed:', data.message);
            setError(data.message || "Mã giảm giá không hợp lệ");
            return;
          }
        } catch (apiError: any) {
          // Handle API errors (404, 400, etc.)
          console.error('API validation error:', apiError);
          
          // Try to parse error message from response
          let errorMessage = "Không thể áp dụng mã giảm giá này";
          try {
            // Check if error has responseText property
            if (apiError.responseText) {
              try {
                const errorData = JSON.parse(apiError.responseText);
                errorMessage = errorData.message || errorMessage;
              } catch {
                // If not JSON, use the text as is
                errorMessage = apiError.responseText || errorMessage;
              }
            } else if (apiError.message && apiError.message.includes(':')) {
              // Fallback: try to parse from error message
              const parts = apiError.message.split(':');
              if (parts.length > 1) {
                const errorText = parts.slice(1).join(':').trim();
                try {
                  const errorData = JSON.parse(errorText);
                  errorMessage = errorData.message || errorMessage;
                } catch {
                  // If not JSON, use the text as is
                  errorMessage = errorText || errorMessage;
                }
              }
            }
          } catch {
            // If parsing fails, use default message
          }
          
          setError(errorMessage);
          return;
        }
      }

      // If no code or validation failed, calculate discount manually
      console.log('Calculating discount manually');
      let discountAmount = 0;
      if (selectedCoupon.discountPercent) {
        discountAmount = Math.floor((orderAmount * selectedCoupon.discountPercent) / 100);
      } else if (selectedCoupon.value && selectedCoupon.type === 'discount') {
        discountAmount = Math.floor((orderAmount * selectedCoupon.value) / 100);
      }

      if (selectedCoupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, selectedCoupon.maxDiscountAmount);
      }

      console.log('Manual discount amount:', discountAmount);

      // Save to localStorage
      localStorage.setItem('applied_coupon', JSON.stringify({
        ...selectedCoupon,
        discountAmount: discountAmount,
        appliedAt: new Date().toISOString()
      }));
      
      onCouponApplied(selectedCoupon, discountAmount);
      setSelectedCouponId("");

    } catch (error) {
      console.error('Error applying coupon:', error);
      setError("Không thể áp dụng mã giảm giá này");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    localStorage.removeItem('applied_coupon');
    onCouponRemoved();
    setError("");
  };

  if (appliedCoupon) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">
                ✓ {appliedCoupon.name} ({appliedCoupon.code || 'Tự động'})
              </div>
              <div className="text-xs text-green-600">
                Đã giảm {format(discountAmount)}đ
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-700 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (savedCoupons.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Gift className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Chưa có mã giảm giá nào đã lưu</p>
          <p className="text-xs text-gray-500 mt-1">
            Lưu mã giảm giá từ trang mã giảm giá để sử dụng
          </p>
        </div>
      </div>
    );
  }
  
  if (eligibleCoupons.length === 0 && notEligibleCoupons.length > 0) {
    return (
      <div className="space-y-3">
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Gift className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-yellow-800 font-medium">Bạn có {notEligibleCoupons.length} mã giảm giá đã lưu</p>
          <p className="text-xs text-yellow-600 mt-1">
            Thêm sản phẩm để đạt đơn tối thiểu và sử dụng mã giảm giá
          </p>
          {notEligibleCoupons.map(coupon => {
            const minOrder = coupon.minOrderValue || coupon.minOrderAmount || 0;
            return (
              <div key={coupon._id || coupon.id} className="mt-2 text-xs text-yellow-700">
                {coupon.code || coupon.name}: Cần đơn tối thiểu {format(minOrder)}đ
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Chọn coupon đủ điều kiện:
        </label>
        <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn mã giảm giá..." />
          </SelectTrigger>
          <SelectContent>
            {eligibleCoupons.map((coupon) => (
              <SelectItem key={coupon._id || coupon.id} value={coupon._id || coupon.id}>
                <div className="flex flex-col">
                  <div className="font-medium">
                    {coupon.code || 'Tự động'} - {coupon.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {coupon.discountPercent ? `Giảm ${coupon.discountPercent}%` : 
                     coupon.type === 'discount' ? `Giảm ${coupon.value}%` : 
                     coupon.type === 'freeship' ? 'Miễn phí ship' : 'Giảm giá'}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {notEligibleCoupons.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-medium text-yellow-800 mb-1">
            Mã giảm giá chưa đủ điều kiện ({notEligibleCoupons.length}):
          </p>
          {notEligibleCoupons.map(coupon => {
            const minOrder = coupon.minOrderValue || coupon.minOrderAmount || 0;
            return (
              <div key={coupon._id || coupon.id} className="text-xs text-yellow-700">
                {coupon.code || coupon.name}: Cần đơn tối thiểu {format(minOrder)}đ (hiện tại: {format(orderAmount)}đ)
              </div>
            );
          })}
        </div>
      )}

      <Button
        onClick={handleApplyCoupon}
        disabled={isValidating || !selectedCouponId}
        className="w-full"
      >
        {isValidating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Áp dụng mã giảm giá
          </>
        )}
      </Button>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
