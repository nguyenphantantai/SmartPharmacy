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
  Calendar as CalendarIcon,
  ShoppingCart,
  Shield,
  MoreVertical
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  paymentStatus: string;
}

interface ChartData {
  month: string;
  total: number;
  count: number;
}

type TimeRange = '1m' | '3m' | '6m' | 'custom';

export default function HealthSpendingPage() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<{ status: string; message: string }>({
    status: 'good',
    message: 'Bạn nằm trong nhóm có sức khỏe tốt. Hãy tiếp tục duy trì lối sống lành mạnh và kiểm tra sức khỏe định kỳ để giữ vững phong độ.'
  });
  const [pPointBalance, setPPointBalance] = useState<number>(0);
  const chartRef = useRef<HTMLDivElement>(null);

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
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe", active: true },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe" },
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

  // Calculate date range based on timeRange
  const getDateRange = (): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    let startDate = new Date();

    if (timeRange === 'custom') {
      if (customDateRange.from && customDateRange.to) {
        startDate = new Date(customDateRange.from);
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate: customDateRange.to };
      }
      // Fallback to 6 months if custom range not set
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeRange === '1m') {
      // For 1 month: show only current month (from 1st day of current month to today)
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === '3m') {
      // For 3 months: show last 3 months including current month (2 months ago to current month)
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === '6m') {
      // For 6 months: show last 6 months including current month (5 months ago to current month)
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  };

  // Load health status
  useEffect(() => {
    const loadHealthStatus = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(`${API_BASE}/api/health-spending/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHealthStatus(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading health status:', error);
      }
    };

    loadHealthStatus();
  }, [user, token]);

  // Load spending statistics
  useEffect(() => {
    const loadSpendingStats = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { startDate, endDate } = getDateRange();

        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        const response = await fetch(
          `${API_BASE}/api/health-spending/stats?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTotalSpending(data.data.totalSpending || 0);
            setTotalOrders(data.data.totalOrders || 0);
            setOrders(data.data.orders || []);
            setChartData(data.data.chartData || []);
            // Debug: log chart data
            console.log('Chart data received:', data.data.chartData);
          }
        }
      } catch (error) {
        console.error('Error loading spending stats:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu chi tiêu. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSpendingStats();
  }, [user, token, timeRange, customDateRange.from, customDateRange.to]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatDateRange = () => {
    if (!customDateRange.from && !customDateRange.to) {
      return "Chọn khoảng thời gian";
    }
    if (customDateRange.from && customDateRange.to) {
      return `${format(customDateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(customDateRange.to, "dd/MM/yyyy", { locale: vi })}`;
    }
    if (customDateRange.from) {
      return `Từ ${format(customDateRange.from, "dd/MM/yyyy", { locale: vi })}`;
    }
    if (customDateRange.to) {
      return `Đến ${format(customDateRange.to, "dd/MM/yyyy", { locale: vi })}`;
    }
    return "Chọn khoảng thời gian";
  };

  // Prepare chart data with proper formatting
  const chartDataFormatted = chartData.map(item => ({
    month: item.month,
    total: item.total / 1000000, // Convert to millions for display
    count: item.count
  }));

  // Debug: log formatted chart data
  console.log('Chart data formatted:', chartDataFormatted);

  // Calculate max value for Y-axis (in millions)
  const maxValue = chartDataFormatted.length > 0
    ? Math.max(...chartDataFormatted.map(d => d.total), 0.6)
    : 2;
  
  console.log('Max value for Y-axis:', maxValue);

  // Download functions
  const downloadSVG = () => {
    if (!chartRef.current) return;
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'bang-thong-ke.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPNG = () => {
    if (!chartRef.current) return;
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'bang-thong-ke.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(pngUrl);
          }
        });
      }
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const downloadCSV = () => {
    const headers = ['Tháng', 'Tổng chi (VND)', 'Số đơn'];
    const rows = chartData.map(item => [
      item.month,
      item.total,
      item.count
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'bang-thong-ke.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex-1">
        {/* Yellow Banner Header */}
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Chi tiêu sức khoẻ</h1>
                <p className="text-gray-700 text-lg">
                  Với các công cụ đánh giá sức khỏe tiện lợi từ Pharmacity, giúp bạn cải thiện sức khoẻ và nâng cao chất lượng cuộc sống cho bản thân và gia đình
                </p>
              </div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center ml-8">
                <ShoppingCart className="w-10 h-10 text-blue-600" />
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
            <div className="lg:col-span-3 space-y-6">
              {/* Health Status Banner */}
              <div className="bg-blue-900 text-white rounded-lg p-6 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg font-medium">
                    {healthStatus.message}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center ml-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Time Range Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setTimeRange('6m')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        timeRange === '6m'
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      6 Tháng
                    </button>
                    <button
                      onClick={() => setTimeRange('3m')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        timeRange === '3m'
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      3 Tháng
                    </button>
                    <button
                      onClick={() => setTimeRange('1m')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        timeRange === '1m'
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      1 Tháng
                    </button>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <button
                          onClick={() => {
                            setTimeRange('custom');
                            if (!customDateRange.from || !customDateRange.to) {
                              setIsDatePickerOpen(true);
                            }
                          }}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[200px] justify-start",
                            timeRange === 'custom'
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          {customDateRange.from && customDateRange.to ? (
                            <>
                              <CalendarIcon className="w-4 h-4" />
                              <span>
                                {format(customDateRange.from, "dd/MM/yyyy", { locale: vi })} - {format(customDateRange.to, "dd/MM/yyyy", { locale: vi })}
                              </span>
                            </>
                          ) : (
                            <>
                              <CalendarIcon className="w-4 h-4" />
                              <span>Tùy chọn</span>
                            </>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={customDateRange?.from || new Date()}
                          selected={customDateRange}
                          onSelect={(range) => {
                            // Prevent selecting dates in the future
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            
                            // Compare dates without time
                            const compareDates = (date1: Date, date2: Date) => {
                              const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
                              const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
                              return d1 > d2;
                            };
                            
                            if (range?.from && compareDates(range.from, today)) {
                              return;
                            }
                            if (range?.to && compareDates(range.to, today)) {
                              return;
                            }
                            
                            setCustomDateRange(range || {});
                            if (range?.from && range?.to) {
                              setIsDatePickerOpen(false);
                            }
                          }}
                          numberOfMonths={2}
                          locale={vi}
                          disabled={(date) => {
                            // Disable dates in the future (compare only dates, not time)
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            return dateToCompare > today;
                          }}
                        />
                        <div className="flex items-center justify-between p-4 border-t">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setCustomDateRange({});
                              setIsDatePickerOpen(false);
                            }}
                          >
                            Thiết lập lại
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDatePickerOpen(false)}
                            >
                              Thoát
                            </Button>
                            <Button
                              onClick={() => {
                                if (customDateRange.from && customDateRange.to) {
                                  setTimeRange('custom');
                                  setIsDatePickerOpen(false);
                                }
                              }}
                            >
                              Áp dụng
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-700 mb-2">Tổng chi</div>
                    <div className="text-3xl font-bold text-red-600">
                      {formatCurrency(totalSpending)}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-700 mb-2">Tổng đơn hàng</div>
                    <div className="text-3xl font-bold text-green-600">
                      {totalOrders}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Spending Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết khoản chi</h2>
                  
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-500">Đang tải...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có dữ liệu</h3>
                      <p className="text-gray-500">Hiện tại chưa có dữ liệu để hiển thị</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-semibold text-gray-900">
                                Đơn hàng: {order.orderNumber}
                              </span>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded text-xs font-medium",
                                  order.paymentStatus === 'paid'
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                )}
                              >
                                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Ngày đặt: {formatDate(order.createdAt)}
                            </p>
                            <p className="text-lg font-bold text-red-600">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/account/chi-tiet-don-hang/${order._id}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics Chart */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Bảng thống kê</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={downloadSVG} className="cursor-pointer">
                          Download SVG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadPNG} className="cursor-pointer">
                          Download PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
                          Download CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-500">Đang tải...</p>
                    </div>
                  ) : chartDataFormatted.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Chưa có dữ liệu để hiển thị biểu đồ</p>
                    </div>
                  ) : (
                    <div className="w-full" style={{ height: '400px' }} ref={chartRef}>
                      <ChartContainer
                        config={{
                          total: {
                            label: "Tổng chi (triệu VND)",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <BarChart 
                          data={chartDataFormatted}
                          margin={{ top: 20, right: 30, left: 20, bottom: chartDataFormatted.length > 6 ? 80 : 50 }}
                          barCategoryGap="20%"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            stroke="#6b7280"
                            angle={chartDataFormatted.length > 6 ? -45 : 0}
                            textAnchor={chartDataFormatted.length > 6 ? "end" : "middle"}
                            height={chartDataFormatted.length > 6 ? 80 : 40}
                            interval={0}
                          />
                          <YAxis
                            domain={[0, Math.max(maxValue * 1.2, 0.6)]}
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            stroke="#6b7280"
                            tickFormatter={(value) => `${value.toFixed(1)}M`}
                            allowDecimals={true}
                            ticks={(() => {
                              const max = Math.max(maxValue * 1.2, 0.6);
                              const tickValues = [];
                              for (let i = 0.2; i <= max; i += 0.2) {
                                tickValues.push(parseFloat(i.toFixed(1)));
                              }
                              return tickValues;
                            })()}
                          />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                                    <p className="text-sm font-semibold mb-1">
                                      {payload[0].payload.month}
                                    </p>
                                    <p className="text-sm text-blue-600">
                                      Tổng chi: {formatCurrency((payload[0].value as number) * 1000000)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Số đơn: {payload[0].payload.count}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="total"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

