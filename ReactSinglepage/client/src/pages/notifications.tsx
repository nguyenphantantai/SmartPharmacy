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
  Check
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  type: 'order' | 'brand' | 'promotion' | 'health' | 'news' | 'system';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    [key: string]: any;
  };
  createdAt: string;
}

type NotificationTab = 'order' | 'brand' | 'promotion' | 'health' | 'news' | 'system' | 'all';

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [pPointBalance, setPPointBalance] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan" },
    { icon: MapPin, label: "Số địa chỉ nhận hàng", href: "/account/dia-chi-nhan-hang" },
    { icon: ShoppingBag, label: "Lịch sử đơn hàng", href: "/account/lich-su-don-hang" },
    { icon: Gift, label: "Mã giảm giá", href: "/account/ma-giam-gia" },
    { icon: Star, label: "Lịch sử P-Xu Vàng", href: "/account/lich-su-p-xu" },
    { icon: FileText, label: "Quy chế xếp hạng", href: "/account/quy-che-xep-hang" },
    { icon: Bell, label: "Thông báo của tôi", href: "/account/thong-bao", active: true },
    { icon: CreditCard, label: "Quản lý thanh toán", href: "/account/quan-ly-thanh-toan" },
    { icon: Users, label: "Hồ sơ gia đình", href: "/account/ho-so-gia-dinh" },
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe" },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe" },
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi" },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: Microscope, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const tabs = [
    { key: 'all' as NotificationTab, label: 'Tất cả' },
    { key: 'order' as NotificationTab, label: 'Đơn hàng' },
    { key: 'brand' as NotificationTab, label: 'Thương hiệu' },
    { key: 'promotion' as NotificationTab, label: 'Ưu đãi' },
    { key: 'health' as NotificationTab, label: 'Sức khoẻ' },
    { key: 'news' as NotificationTab, label: 'Tin tức' },
    { key: 'system' as NotificationTab, label: 'Hệ thống' },
  ];

  const handleMenuClick = (href: string) => {
    setLocation(href);
  };

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const params = new URLSearchParams();
        if (activeTab !== 'all') {
          params.append('type', activeTab);
        }

        const response = await fetch(
          `${API_BASE}/api/notifications?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(data.data.notifications || []);
            setUnreadCount(data.data.unreadCount || 0);
          }
        } else if (response.status === 403 || response.status === 401) {
          // Token expired or invalid - logout user
          const data = await response.json().catch(() => ({}));
          if (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN') {
            console.log('Token expired or invalid, logging out...');
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông báo. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user, token, activeTab]);

  // Load unread count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(`${API_BASE}/api/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUnreadCount(data.data.unreadCount || 0);
          }
        } else if (response.status === 403 || response.status === 401) {
          // Token expired or invalid - logout user
          const data = await response.json().catch(() => ({}));
          if (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN') {
            console.log('Token expired or invalid, logging out...');
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();
  }, [user, token]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/mark-all-read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: activeTab !== 'all' ? activeTab : undefined,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
          );
          setUnreadCount(0);
          toast({
            title: "Thành công",
            description: "Đã đánh dấu tất cả thông báo là đã đọc",
          });
        }
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu tất cả thông báo. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate to link if available
    if (notification.link) {
      setLocation(notification.link);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    }
  };

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(notif => notif.type === activeTab);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
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
                        {item.label === "Thông báo của tôi" && unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
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
                  <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                  {filteredNotifications.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={handleMarkAllAsRead}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Đọc tất cả
                    </Button>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                        activeTab === tab.key
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Đang tải...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có thông báo mới</h3>
                    <p className="text-gray-500">Bạn chưa có thông báo mới nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-colors",
                          notification.isRead
                            ? "bg-white border-gray-200 hover:bg-gray-50"
                            : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={cn(
                                "font-semibold",
                                notification.isRead ? "text-gray-900" : "text-blue-900"
                              )}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className={cn(
                              "text-sm mb-2",
                              notification.isRead ? "text-gray-600" : "text-gray-700"
                            )}>
                              {notification.content}
                            </p>
                            {notification.metadata?.orderNumber && (
                              <p className="text-xs text-gray-500 mb-1">
                                Đơn hàng: {notification.metadata.orderNumber}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="ml-4"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
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

