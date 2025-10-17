import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Clock, Percent, Truck, Gift, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import CouponDetailPopup from "./coupon-detail-popup";

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
}

export default function CouponSection() {
  const [, setLocation] = useLocation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'percentage' | 'freeship' | 'event'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Mock data - sau này sẽ thay bằng API call
  useEffect(() => {
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'GIAM10',
        description: 'Giảm 10% cho đơn từ 200.000đ',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 200000,
        expiryDate: '2025-10-20',
        isActive: true,
        category: 'general'
      },
      {
        id: '2',
        code: 'FREESHIP',
        description: 'Miễn phí ship cho đơn từ 300.000đ',
        discountType: 'freeship',
        discountValue: 0,
        minOrderAmount: 300000,
        expiryDate: '2025-12-31',
        isActive: true,
        category: 'freeship'
      },
      {
        id: '3',
        code: 'NEWUSER20',
        description: 'Giảm 20% cho khách hàng mới',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 100000,
        expiryDate: '2025-11-15',
        isActive: true,
        category: 'event'
      },
      {
        id: '4',
        code: 'VIP50K',
        description: 'Giảm 50.000đ cho đơn từ 500.000đ',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderAmount: 500000,
        expiryDate: '2025-09-30',
        isActive: true,
        category: 'general'
      },
      {
        id: '5',
        code: 'WEEKEND15',
        description: 'Giảm 15% cuối tuần',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 150000,
        expiryDate: '2025-08-25',
        isActive: true,
        category: 'event'
      },
      {
        id: '6',
        code: 'MEDICINE5',
        description: 'Giảm 5% thuốc kê đơn',
        discountType: 'percentage',
        discountValue: 5,
        minOrderAmount: 100000,
        expiryDate: '2025-12-20',
        isActive: true,
        category: 'general'
      }
    ];
    setCoupons(mockCoupons);
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true;
    if (activeTab === 'percentage') return coupon.discountType === 'percentage';
    if (activeTab === 'freeship') return coupon.discountType === 'freeship';
    if (activeTab === 'event') return coupon.category === 'event';
    return true;
  });

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Đã sao chép mã ${code}`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Không thể sao chép mã');
    }
  };

  const handleUseNow = (coupon: Coupon) => {
    // Copy code to clipboard first
    handleCopyCode(coupon.code);
    
    // Redirect to cart or shopping page
    // window.location.href = '/cart';
    toast.info(`Mã ${coupon.code} đã được sao chép! Vào giỏ hàng để sử dụng.`);
  };

  const handleCouponClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCoupon(null);
  };

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
        return <Percent className="w-4 h-4" />;
      case 'freeship':
        return <Truck className="w-4 h-4" />;
      case 'fixed':
        return <Gift className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCouponColor = (coupon: Coupon) => {
    switch (coupon.category) {
      case 'freeship':
        return 'bg-teal-50 border-teal-200';
      case 'event':
        return 'bg-lime-50 border-lime-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <section className="py-10 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-3 shadow-lg">
              <Gift className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              💸 Mã giảm giá hôm nay
            </h2>
          </div>
          <p className="text-gray-600 text-lg">Tiết kiệm ngay với các mã giảm giá độc quyền</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            {[
              { key: 'all', label: 'Tất cả', icon: Sparkles },
              { key: 'percentage', label: 'Giảm %', icon: Percent },
              { key: 'freeship', label: 'Freeship', icon: Truck },
              { key: 'event', label: 'Sự kiện', icon: Gift }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoupons.map((coupon) => (
            <Card 
              key={coupon.id} 
              className={`${getCouponColor(coupon)} border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
              onClick={() => handleCouponClick(coupon)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg p-2">
                      {getCouponIcon(coupon)}
                    </div>
                    <div>
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0"
                      >
                        {coupon.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      HSD: {formatDate(coupon.expiryDate)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    {coupon.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Đơn tối thiểu: {formatCurrency(coupon.minOrderAmount)}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(coupon.code);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedCode === coupon.code ? 'Đã sao chép!' : 'Sao chép mã'}
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseNow(coupon);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    Dùng ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không có mã giảm giá nào</p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">💡 Mẹo: Sao chép mã và vào giỏ hàng để sử dụng</p>
          <Button 
            size="lg"
            onClick={() => setLocation('/ma-giam-gia')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
          >
            Xem tất cả mã giảm giá
          </Button>
        </div>
      </div>

      {/* Coupon Detail Popup */}
      <CouponDetailPopup
        coupon={selectedCoupon}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onCopyCode={handleCopyCode}
        onUseNow={handleUseNow}
      />
    </section>
  );
}
