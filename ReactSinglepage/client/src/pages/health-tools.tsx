import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Gift, 
  Star, 
  FileText, 
  Bell, 
  CreditCard, 
  Users, 
  Activity, 
  Stethoscope, 
  ClipboardList,
  Microscope,
  ArrowRight,
  Calculator,
  Heart,
  Droplet,
  Calendar,
  Pill,
  Activity as ActivityIcon,
  Scale,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HealthToolsPage() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pPointBalance, setPPointBalance] = useState<number>(0);

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan" },
    { icon: MapPin, label: "Số địa chỉ nhận hàng", href: "/account/dia-chi-nhan-hang" },
    { icon: ShoppingBag, label: "Lịch sử đơn hàng", href: "/account/lich-su-don-hang" },
    { icon: Gift, label: "Mã giảm giá", href: "/account/ma-giam-gia" },
    { icon: Star, label: "Lịch sử P-Xu Vàng", href: "/account/lich-su-p-xu" },
    { icon: FileText, label: "Quy chế xếp hạng", href: "/account/quy-che-xep-hang" },
    { icon: Bell, label: "Thông báo của tôi", href: "/account/thong-bao" },
    { icon: CreditCard, label: "Quản lý thanh toán", href: "/account/quan-ly-thanh-toan" },
    { icon: Users, label: "Hồ sơ gia đình", href: "/account/ho-so-gia-dinh" },
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe" },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe", active: true },
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi" },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: Microscope, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const handleMenuClick = (href: string) => {
    setLocation(href);
  };

  // Load P-Xu balance
  useEffect(() => {
    const loadPPointBalance = async () => {
      if (!user || !token) return;
      
      try {
        const response = await fetch(`${API_BASE}/api/p-points/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPPointBalance(data.data.balance || 0);
          }
        }
      } catch (error) {
        console.error('Error loading P-Xu balance:', error);
      }
    };

    loadPPointBalance();
  }, [user, token]);

  // Health tools data
  const healthTools = [
    {
      id: 'bmi',
      title: 'Tính chỉ số BMI',
      description: 'BMI đánh giá tình trạng dinh dưỡng và nguy cơ bệnh lý dựa trên mức độ phù hợp giữa cân nặng và chiều cao.',
      icon: Scale,
      href: '/account/cong-cu-suc-khoe/bmi',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'bmr',
      title: 'Tính chỉ số BMR',
      description: 'BMR là chỉ số để tính toán lượng calo cần thiết giúp xác định lượng calo tiêu thụ cho các hoạt động hàng ngày để duy trì cân nặng.',
      icon: Sparkles,
      href: '/account/cong-cu-suc-khoe/bmr',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'menstrual',
      title: 'Theo dõi kinh nguyệt',
      description: 'Bằng cách ghi lại ngày bắt đầu và kết thúc của chu kỳ, cũng như các triệu chứng, phụ nữ có thể dự đoán chu kỳ kinh nguyệt tiếp theo.',
      icon: Heart,
      href: '/account/cong-cu-suc-khoe/theo-doi-kinh-nguyet',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'blood-glucose',
      title: 'Theo dõi Đường Huyết',
      description: 'Tính năng Đo Đường Huyết hỗ trợ người dùng dễ dàng lập lịch đo và phân tích số liệu sức khỏe về đường huyết bản thân.',
      icon: Droplet,
      href: '/account/cong-cu-suc-khoe/theo-doi-duong-huyet',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'blood-fat',
      title: 'Theo dõi mỡ máu',
      description: 'Đo mỡ máu giúp phát hiện nguy cơ bệnh tim mạch và các vấn đề sức khỏe liên quan.',
      icon: Droplet,
      href: '/account/cong-cu-suc-khoe/theo-doi-mo-mau',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'pregnancy-weight',
      title: 'Theo dõi cân nặng mẹ bầu',
      description: 'Hỗ trợ đo số cân nặng tiêu chuẩn giúp các mẹ bầu theo dõi cân nặng của mình trong suốt thai kỳ.',
      icon: Users,
      href: '/account/cong-cu-suc-khoe/theo-doi-can-nang-me-bau',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'medication',
      title: 'Nhắc lịch uống thuốc',
      description: 'Tính năng này giúp bạn quản lý và nhắc nhở bạn uống thuốc. Bạn sẽ không bao giờ quên lịch uống thuốc của mình.',
      icon: Pill,
      href: '/account/cong-cu-suc-khoe/nhac-lich-uong-thuoc',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'blood-pressure',
      title: 'Theo Dõi Huyết Áp',
      description: 'Theo dõi Huyết Áp giúp chăm sóc sức khỏe dễ dàng và tiện lợi hơn. Công cụ không những ghi nhận chỉ số huyết áp mà có thể đánh giá chỉ số nhịp tim.',
      icon: ActivityIcon,
      href: '/account/cong-cu-suc-khoe/theo-doi-huyet-ap',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'osteoporosis',
      title: 'Theo dõi loãng xương',
      description: 'Tính năng này giúp bạn theo dõi tình trạng xương và phát hiện sớm các dấu hiệu loãng xương.',
      icon: Activity,
      href: '/account/cong-cu-suc-khoe/theo-doi-loang-xuong',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const handleToolClick = (href: string) => {
    setLocation(href);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex-1">
        {/* Header Banner */}
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-blue-600 mb-2">
                  Trang chủ &gt; Công cụ sức khỏe
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Công cụ sức khỏe</h1>
                <p className="text-gray-700 text-lg">
                  Với các công cụ đánh giá sức khỏe tiện lợi từ Pharmacity, giúp bạn cải thiện sức khoẻ và nâng cao chất lượng cuộc sống cho bản thân và gia đình
                </p>
              </div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center ml-8">
                <Stethoscope className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  {/* User Profile */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Khách Hàng</h3>
                    <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                      <span className="font-bold">P</span>
                      <span>{pPointBalance} P-Xu</span>
                    </div>
                  </div>

                  {/* Membership Tier */}
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-white" />
                          <span className="text-white font-bold text-lg">VÀNG</span>
                        </div>
                        <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs">💎</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="w-full bg-white/30 rounded-full h-2 relative">
                          <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '5%' }}></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-yellow-100">
                          Chi tiêu thêm 4.000.000 ₫ để thăng hạng
                        </p>
                        <button className="w-4 h-4 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600 text-xs font-bold">i</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    {sidebarMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleMenuClick(item.href)}
                          className={cn(
                            "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left",
                            item.active
                              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Công cụ khác</h2>
                
                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {healthTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Card
                        key={tool.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleToolClick(tool.href)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", tool.color)}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {tool.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

