import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied: (coupon: any, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
  discountAmount?: number;
}

export default function CouponInput({ 
  orderAmount, 
  onCouponApplied, 
  onCouponRemoved,
  appliedCoupon,
  discountAmount = 0
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      // Try promotion code first
      const response = await apiRequest("POST", "/api/promotions/validate-code", {
        code: couponCode.trim(),
        orderAmount: orderAmount,
      });

      const data = await response.json();
      
      if (data.success) {
        const couponData = data.data.promotion || data.data;
        const discountAmount = data.data.discountAmount;
        
        // Save to localStorage
        localStorage.setItem('applied_coupon', JSON.stringify({
          code: couponCode.trim(),
          name: couponData.name || couponCode.trim(),
          discountAmount: discountAmount,
          appliedAt: new Date().toISOString()
        }));
        
        onCouponApplied(couponData, discountAmount);
        setCouponCode("");
        return;
      }
    } catch (error) {
      console.log("Promotion validation failed, trying coupon...");
    }

    try {
      // Fallback to coupon validation
      const response = await apiRequest("POST", "/api/coupons/validate", {
        code: couponCode.trim(),
        orderAmount: orderAmount,
      });

      const data = await response.json();
      
      if (data.success) {
        const couponData = data.data.coupon;
        const discountAmount = data.data.discountAmount;
        
        // Save to localStorage
        localStorage.setItem('applied_coupon', JSON.stringify({
          code: couponCode.trim(),
          name: couponData.name || couponCode.trim(),
          discountAmount: discountAmount,
          appliedAt: new Date().toISOString()
        }));
        
        onCouponApplied(couponData, discountAmount);
        setCouponCode("");
      } else {
        setError(response.message || "Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Apply coupon error:", error);
      setError("Có lỗi xảy ra khi áp dụng mã giảm giá");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    localStorage.removeItem('applied_coupon');
    onCouponRemoved();
    setCouponCode("");
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
                {appliedCoupon.name} ({appliedCoupon.code})
              </div>
              <div className="text-xs text-green-600">
                Giảm {format(discountAmount)}đ
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nhập mã giảm giá"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1"
          disabled={isValidating}
        />
        <Button
          onClick={handleApplyCoupon}
          disabled={isValidating || !couponCode.trim()}
          className="px-4"
        >
          {isValidating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
