import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Percent, Truck, Gift, Sparkles, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
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

export default function AllCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'percentage' | 'freeship' | 'event'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [savedCouponIds, setSavedCouponIds] = useState<Set<string>>(new Set());

  // Load saved coupon IDs from localStorage
  useEffect(() => {
    try {
      const savedCoupons = JSON.parse(localStorage.getItem('saved_coupons') || '[]');
      const savedIds = new Set(savedCoupons.map((c: any) => c._id || c.id).filter(Boolean));
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
        setFilteredCoupons(promotions);
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

  // Filter coupons based on tab and search
  useEffect(() => {
    let filtered = coupons;

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'percentage') {
        filtered = filtered.filter(coupon => coupon.type === 'order_threshold' || coupon.type === 'flash_sale' || coupon.type === 'discount');
      } else if (activeTab === 'freeship') {
        filtered = filtered.filter(coupon => coupon.type === 'freeship' || (coupon.type === 'order_threshold' && (coupon.discountPercent === 0 || coupon.value === 0)));
      } else if (activeTab === 'event') {
        filtered = filtered.filter(coupon => coupon.type === 'flash_sale');
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(coupon => 
        (coupon.code && coupon.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coupon.name && coupon.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCoupons(filtered);
  }, [coupons, activeTab, searchQuery]);

  const handleCopyCode = async (code: string) => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: 'Thành công',
        description: `Đã sao chép mã ${code}`
      });
      
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể sao chép mã',
        variant: 'destructive'
      });
    }
  };

  const handleSaveCoupon = (coupon: Coupon) => {
    try {
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
      const couponId = coupon._id || coupon.id;
      if (couponId) {
        setSavedCouponIds(prev => new Set([...prev, couponId]));
      }
      
      // Show success notification
      toast({
        title: 'Thành công',
        description: `Đã lưu mã giảm giá ${coupon.code || coupon.name}`,
      });
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu mã giảm giá',
        variant: 'destructive'
      });
    }
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
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'order_threshold':
        return coupon.discountPercent && coupon.discountPercent > 0 ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' : 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'discount':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'freeship':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      default:
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.usageLimit) return 0;
    return Math.round((coupon.usageCount || 0) / coupon.usageLimit * 100);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-3 shadow-lg">
              <Gift className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              💸 Tất cả mã giảm giá
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Khám phá và sử dụng các mã giảm giá độc quyền</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm mã giảm giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center">
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
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-orange-600">{filteredCoupons.length}</span> mã giảm giá
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredCoupons.map((coupon) => (
            <Card 
              key={coupon._id || coupon.id} 
              className={`${getCouponColor(coupon)} border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
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
                  
                  {/* Usage Progress */}
                  {coupon.usageLimit && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đã sử dụng</span>
                        <span>{coupon.usageCount || 0}/{coupon.usageLimit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleSaveCoupon(coupon)}
                    disabled={savedCouponIds.has(coupon._id || coupon.id)}
                    className={`w-full shadow-lg ${
                      savedCouponIds.has(coupon._id || coupon.id) 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    }`}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {savedCouponIds.has(coupon._id || coupon.id) ? 'Đã lưu' : 'Lưu mã giảm giá'}
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
            <p className="text-gray-500 text-lg">Không tìm thấy mã giảm giá nào</p>
            <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">💡 Mẹo sử dụng mã giảm giá</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Sao chép mã và vào giỏ hàng để sử dụng
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Kiểm tra điều kiện đơn hàng tối thiểu
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Sử dụng trước ngày hết hạn
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
