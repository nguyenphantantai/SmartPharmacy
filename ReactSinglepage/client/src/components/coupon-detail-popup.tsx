import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Clock, Percent, Truck, Gift, Sparkles, X, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'freeship';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  category: 'general' | 'freeship' | 'event';
  usageCount?: number;
  maxUsage?: number;
  terms?: string[];
}

interface CouponDetailPopupProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyCode: (code: string) => void;
  onUseNow: (coupon: Coupon) => void;
}

export default function CouponDetailPopup({ 
  coupon, 
  isOpen, 
  onClose, 
  onCopyCode, 
  onUseNow 
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
    switch (coupon.discountType) {
      case 'percentage':
        return <Percent className="w-6 h-6" />;
      case 'freeship':
        return <Truck className="w-6 h-6" />;
      case 'fixed':
        return <Gift className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCouponColor = (coupon: Coupon) => {
    switch (coupon.category) {
      case 'freeship':
        return 'bg-green-50 border-green-200';
      case 'event':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getDiscountText = (coupon: Coupon) => {
    switch (coupon.discountType) {
      case 'percentage':
        return `Giảm ${coupon.discountValue}%`;
      case 'fixed':
        return `Giảm ${formatCurrency(coupon.discountValue)}`;
      case 'freeship':
        return 'Miễn phí ship';
      default:
        return 'Giảm giá';
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.maxUsage) return 0;
    return Math.round((coupon.usageCount || 0) / coupon.maxUsage * 100);
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
              <CardTitle className="text-xl">{coupon.code}</CardTitle>
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
            <p className="text-gray-700">{coupon.description}</p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Chi tiết</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Đơn hàng tối thiểu:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(coupon.minOrderAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hạn sử dụng:</span>
              <span className="font-semibold text-red-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(coupon.expiryDate)}
              </span>
            </div>

            {coupon.maxUsage && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đã sử dụng:</span>
                  <span className="font-semibold">
                    {coupon.usageCount || 0}/{coupon.maxUsage}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getUsagePercentage(coupon)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          {coupon.terms && coupon.terms.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Điều khoản sử dụng</h3>
              <ul className="space-y-1">
                {coupon.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={() => onCopyCode(coupon.code)}
              variant="outline"
              className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <Copy className="w-4 h-4 mr-2" />
              Sao chép mã
            </Button>
            
            <Button
              onClick={() => onUseNow(coupon)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg"
            >
              Dùng ngay
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
