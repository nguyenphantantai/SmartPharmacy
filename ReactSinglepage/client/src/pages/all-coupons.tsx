import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Percent, Truck, Gift, Sparkles, Search } from "lucide-react";
import { useState, useEffect } from "react";
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
}

export default function AllCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'percentage' | 'freeship' | 'event'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
        category: 'general',
        usageCount: 150,
        maxUsage: 1000
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
        category: 'freeship',
        usageCount: 89,
        maxUsage: 500
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
        category: 'event',
        usageCount: 45,
        maxUsage: 200
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
        category: 'general',
        usageCount: 23,
        maxUsage: 100
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
        category: 'event',
        usageCount: 67,
        maxUsage: 300
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
        category: 'general',
        usageCount: 34,
        maxUsage: 200
      },
      {
        id: '7',
        code: 'BEAUTY12',
        description: 'Giảm 12% sản phẩm làm đẹp',
        discountType: 'percentage',
        discountValue: 12,
        minOrderAmount: 250000,
        expiryDate: '2025-11-30',
        isActive: true,
        category: 'event',
        usageCount: 78,
        maxUsage: 150
      },
      {
        id: '8',
        code: 'MOMBABY8',
        description: 'Giảm 8% đồ mẹ và bé',
        discountType: 'percentage',
        discountValue: 8,
        minOrderAmount: 400000,
        expiryDate: '2025-10-15',
        isActive: true,
        category: 'general',
        usageCount: 56,
        maxUsage: 100
      }
    ];
    setCoupons(mockCoupons);
    setFilteredCoupons(mockCoupons);
  }, []);

  // Filter coupons based on tab and search
  useEffect(() => {
    let filtered = coupons;

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'percentage') {
        filtered = filtered.filter(coupon => coupon.discountType === 'percentage');
      } else if (activeTab === 'freeship') {
        filtered = filtered.filter(coupon => coupon.discountType === 'freeship');
      } else if (activeTab === 'event') {
        filtered = filtered.filter(coupon => coupon.category === 'event');
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(coupon => 
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCoupons(filtered);
  }, [coupons, activeTab, searchQuery]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Đã sao chép mã ${code}`);
      
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Không thể sao chép mã');
    }
  };

  const handleUseNow = (coupon: Coupon) => {
    handleCopyCode(coupon.code);
    toast.info(`Mã ${coupon.code} đã được sao chép! Vào giỏ hàng để sử dụng.`);
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
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'event':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.maxUsage) return 0;
    return Math.round((coupon.usageCount || 0) / coupon.maxUsage * 100);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
              key={coupon.id} 
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
                  
                  {/* Usage Progress */}
                  {coupon.maxUsage && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đã sử dụng</span>
                        <span>{coupon.usageCount || 0}/{coupon.maxUsage}</span>
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
                    onClick={() => handleCopyCode(coupon.code)}
                    variant="outline"
                    size="sm"
                    className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedCode === coupon.code ? 'Đã sao chép!' : 'Sao chép mã'}
                  </Button>
                  
                  <Button
                    onClick={() => handleUseNow(coupon)}
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
