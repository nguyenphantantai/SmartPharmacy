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
  Calendar as CalendarIcon
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface PPointTransaction {
  _id: string;
  orderId?: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
  };
  type: 'earn' | 'redeem' | 'adjust';
  points: number;
  description?: string;
  createdAt: string;
}

export default function PPointHistoryPage() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<PPointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan" },
    { icon: MapPin, label: "Số địa chỉ nhận hàng", href: "/account/dia-chi-nhan-hang" },
    { icon: ShoppingBag, label: "Lịch sử đơn hàng", href: "/account/lich-su-don-hang" },
    { icon: Gift, label: "Mã giảm giá", href: "/account/ma-giam-gia" },
    { icon: Star, label: "Lịch sử P-Xu Vàng", href: "/account/lich-su-p-xu", active: true },
    { icon: FileText, label: "Quy chế xếp hạng", href: "/account/quy-che-xep-hang" },
    { icon: Bell, label: "Thông báo của tôi", href: "/account/thong-bao" },
    { icon: CreditCard, label: "Quản lý thanh toán", href: "/account/quan-ly-thanh-toan" },
    { icon: Users, label: "Hồ sơ gia đình", href: "/account/ho-so-gia-dinh" },
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe" },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe" },
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi" },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: Microscope, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const handleMenuClick = (href: string) => {
    setLocation(href);
  };

  // Load P-Xu account and transactions
  useEffect(() => {
    const loadData = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load balance
        const accountResponse = await fetch(`${API_BASE}/api/p-points/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          if (accountData.success) {
            setBalance(accountData.data.balance || 0);
          }
        }

        // Load transactions
        const params = new URLSearchParams();
        if (dateRange.from) {
          params.append('startDate', dateRange.from.toISOString());
        }
        if (dateRange.to) {
          params.append('endDate', dateRange.to.toISOString());
        }

        const transactionsResponse = await fetch(
          `${API_BASE}/api/p-points/transactions?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          if (transactionsData.success) {
            setTransactions(transactionsData.data.transactions || []);
          }
        }
      } catch (error) {
        console.error('Error loading P-Xu data:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu P-Xu. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, token, dateRange.from, dateRange.to]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) {
      return "Chọn khoảng thời gian";
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`;
    }
    if (dateRange.from) {
      return `Từ ${format(dateRange.from, "dd/MM/yyyy", { locale: vi })}`;
    }
    if (dateRange.to) {
      return `Đến ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`;
    }
    return "Chọn khoảng thời gian";
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                    <span>{balance} P-Xu</span>
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
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                          item.active 
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử P-Xu Vàng</h1>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-bold">P</span>
                      <span>{balance} P-Xu</span>
                    </div>
                  </div>
                  
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !dateRange.from && !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range || {});
                          if (range?.from && range?.to) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        numberOfMonths={2}
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Đang tải...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch sử P-Xu</h3>
                    <p className="text-gray-500">Hiện tại bạn chưa sử dụng P-Xu nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`text-lg font-bold ${
                                transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {transaction.points > 0 ? '+' : ''}{transaction.points} P-Xu
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.type === 'earn'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.type === 'redeem'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {transaction.type === 'earn'
                                ? 'Nhận'
                                : transaction.type === 'redeem'
                                ? 'Sử dụng'
                                : 'Điều chỉnh'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {transaction.description || 'Không có mô tả'}
                          </p>
                          {transaction.orderId && (
                            <p className="text-xs text-gray-500">
                              Đơn hàng: {transaction.orderId.orderNumber}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

