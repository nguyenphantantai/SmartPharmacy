import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Clock, Percent, Truck, Gift, Sparkles, X, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Coupon {
  _id: string;
  name: string;
  description?: string;
  type: 'order_threshold' | 'combo' | 'flash_sale' | 'category_bundle';
  code?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  minOrderValue?: number;
  discountPercent?: number;
  maxDiscountAmount?: number;
}

interface CouponDetailPopupProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCoupon: (coupon: Coupon) => void;
  savedCouponIds?: Set<string>;
}

export default function CouponDetailPopup({ 
  coupon, 
  isOpen, 
  onClose, 
  onSaveCoupon,
  savedCouponIds = new Set()
}: CouponDetailPopupProps) {
  if (!isOpen || !coupon) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCouponIcon = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'order_threshold':
        return coupon.discountPercent && coupon.discountPercent > 0 ? <Percent className="w-6 h-6" /> : <Truck className="w-6 h-6" />;
      case 'flash_sale':
        return <Sparkles className="w-6 h-6" />;
      case 'combo':
        return <Gift className="w-6 h-6" />;
      case 'category_bundle':
        return <Percent className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCouponColor = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'flash_sale':
        return 'bg-purple-50 border-purple-200';
      case 'order_threshold':
        return coupon.discountPercent && coupon.discountPercent > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountPercent && coupon.discountPercent > 0) {
      return `Giảm ${coupon.discountPercent}%`;
    } else if (coupon.type === 'discount' && coupon.value) {
      return `Giảm ${coupon.value}%`;
    } else if (coupon.type === 'order_threshold') {
      return 'Miễn phí ship';
    } else if (coupon.value) {
      return `Giảm ${formatCurrency(coupon.value)}`;
    } else {
      return 'Giảm giá';
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`${getCouponColor(coupon)} border-2 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-3">
              {getCouponIcon(coupon)}
            </div>
            <div>
              <CardTitle className="text-xl">{coupon.code || 'Tự động'}</CardTitle>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 mt-1"
              >
                {getDiscountText(coupon)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
            <p className="text-gray-700">{coupon.description || coupon.name}</p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Chi tiết</h3>
            
            {coupon.minOrderValue && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đơn hàng tối thiểu:</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(coupon.minOrderValue)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hạn sử dụng:</span>
              <span className="font-semibold text-red-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(coupon.endDate)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={() => onSaveCoupon(coupon)}
              disabled={savedCouponIds.has(coupon._id)}
              className={`w-full shadow-lg ${
                savedCouponIds.has(coupon._id) 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
              }`}
            >
              <Gift className="w-4 h-4 mr-2" />
              {savedCouponIds.has(coupon._id) ? 'Đã lưu' : 'Lưu mã giảm giá'}
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Mẹo sử dụng</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sao chép mã và vào giỏ hàng để áp dụng</li>
              <li>• Kiểm tra điều kiện đơn hàng tối thiểu</li>
              <li>• Sử dụng trước ngày hết hạn</li>
              <li>• Mỗi mã chỉ áp dụng cho một đơn hàng</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
