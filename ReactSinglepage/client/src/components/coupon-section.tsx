import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Clock, Percent, Truck, Gift, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import CouponDetailPopup from "./coupon-detail-popup";
import { fetchAllPromotions } from "@/api/promotions";

interface Coupon {
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

export default function CouponSection() {
  const [, setLocation] = useLocation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'percentage' | 'freeship' | 'event'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [savedCouponIds, setSavedCouponIds] = useState<Set<string>>(new Set());

  // Load saved coupon IDs from localStorage
  useEffect(() => {
    try {
      const savedCoupons = JSON.parse(localStorage.getItem('saved_coupons') || '[]');
      const savedIds = new Set(savedCoupons.map((c: any) => c._id));
      setSavedCouponIds(savedIds);
    } catch (error) {
      console.error('Error loading saved coupons:', error);
    }
  }, []);

  // Fetch real promotions from API
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promotions = await fetchAllPromotions(false);
        setCoupons(promotions);
      } catch (error) {
        console.error('Error loading promotions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải mã khuyến mãi',
          variant: 'destructive'
        });
      }
    };
    
    loadPromotions();
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true;
    if (activeTab === 'percentage') return coupon.type === 'order_threshold' || coupon.type === 'flash_sale' || coupon.type === 'discount';
    if (activeTab === 'freeship') return coupon.type === 'freeship' || (coupon.type === 'order_threshold' && (coupon.discountPercent === 0 || coupon.value === 0));
    if (activeTab === 'event') return coupon.type === 'flash_sale';
    return true;
  });

  const handleSaveCoupon = (coupon: Coupon) => {
    // Save coupon to localStorage for later use
    const savedCoupons = JSON.parse(localStorage.getItem('saved_coupons') || '[]');
    const existingIndex = savedCoupons.findIndex((c: any) => c._id === coupon._id);
    
    if (existingIndex >= 0) {
      savedCoupons[existingIndex] = coupon;
    } else {
      savedCoupons.push(coupon);
    }
    
    localStorage.setItem('saved_coupons', JSON.stringify(savedCoupons));
    
    // Update state to disable the button
    setSavedCouponIds(prev => new Set([...prev, coupon._id]));
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
    switch (coupon.type) {
      case 'order_threshold':
        return coupon.discountPercent && coupon.discountPercent > 0 ? <Percent className="w-4 h-4" /> : <Truck className="w-4 h-4" />;
      case 'discount':
        return <Percent className="w-4 h-4" />;
      case 'freeship':
        return <Truck className="w-4 h-4" />;
      case 'flash_sale':
        return <Sparkles className="w-4 h-4" />;
      case 'combo':
        return <Gift className="w-4 h-4" />;
      case 'category_bundle':
        return <Percent className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCouponColor = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'flash_sale':
        return 'bg-lime-50 border-lime-200';
      case 'order_threshold':
        return coupon.discountPercent && coupon.discountPercent > 0 ? 'bg-green-50 border-green-200' : 'bg-teal-50 border-teal-200';
      case 'discount':
        return 'bg-green-50 border-green-200';
      case 'freeship':
        return 'bg-teal-50 border-teal-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTypeLabel = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'order_threshold': return 'Theo giá trị đơn';
      case 'discount': return 'Giảm %/số tiền';
      case 'freeship': return 'Freeship';
      case 'flash_sale': return 'Flash sale';
      case 'combo': return 'Combo';
      case 'category_bundle': return 'Theo danh mục';
      default: return 'Khuyến mãi';
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
                        {coupon.code || 'Tự động'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </div>
                    {coupon.isActive === false && (
                      <Badge className="mt-1" variant="secondary">Tạm dừng</Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    {coupon.description || coupon.name}
                  </p>
                  <div className="text-xs text-gray-500 mb-1">{getTypeLabel(coupon)}</div>
                  {(coupon.minOrderValue || coupon.minOrderAmount) && (
                    <p className="text-xs text-gray-500">
                      Đơn tối thiểu: {formatCurrency(coupon.minOrderValue || coupon.minOrderAmount!)}
                    </p>
                  )}
                  {(coupon.discountPercent || coupon.value) && (
                    <p className="text-xs text-green-600 font-medium">
                      {coupon.discountPercent ? `Giảm ${coupon.discountPercent}%` : 
                       coupon.type === 'discount' ? `Giảm ${coupon.value}%` : `Giảm ${formatCurrency(coupon.value!)}`}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveCoupon(coupon);
                    }}
                    disabled={savedCouponIds.has(coupon._id)}
                    className={`w-full shadow-lg ${
                      savedCouponIds.has(coupon._id) 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    }`}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {savedCouponIds.has(coupon._id) ? 'Đã lưu' : 'Lưu mã giảm giá'}
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
        onSaveCoupon={handleSaveCoupon}
        savedCouponIds={savedCouponIds}
      />
    </section>
  );
}
