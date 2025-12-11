import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  User,
  History
} from "lucide-react";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoginDialogWrapper } from "@/components/LoginDialogWrapper";
import { RecentOrderCard } from "@/components/RecentOrderCard";
import { ReorderDialog } from "@/components/reorder-dialog";
import { getImageUrl } from "@/lib/imageUtils";
import { API_BASE } from "@/lib/utils";

interface UserOrder {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  items: Array<{
    _id: string;
    productId: {
      _id: string;
      name: string;
      imageUrl: string;
      price: number;
      unit: string;
    };
    quantity: number;
    price: number;
  }>;
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-500", icon: CheckCircle },
  preparing: { label: "Đang chuẩn bị", color: "bg-orange-500", icon: Package },
  shipping: { label: "Đang giao hàng", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Đã giao hàng", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-500", icon: CheckCircle }
};

export default function OrderTrackingPage() {
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUserOrders, setLoadingUserOrders] = useState(true);
  const [loadingRecentOrder, setLoadingRecentOrder] = useState(true);
  const [error, setError] = useState("");
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [reorderOrderId, setReorderOrderId] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { apiRequest } = useApiRequest();
  const { isAuthenticated } = useAuth();

  // Load user's recent orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      // Only fetch if user is authenticated
      if (!isAuthenticated) {
        console.log('Order tracking: User not authenticated, skipping fetch');
        setLoadingUserOrders(false);
        return;
      }

      console.log('Order tracking: Fetching user orders...');
      try {
        setLoadingUserOrders(true);
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE}/api/orders?limit=5`, {
          method: 'GET',
          headers
        });
        const result = await response.json();
        
        if (result.success) {
          setUserOrders(result.data);
          // Auto-select the most recent order
          if (result.data.length > 0) {
            setSelectedOrder(result.data[0]);
          }
        }
      } catch (error: any) {
        console.error("Error fetching user orders:", error);
        
        // Authentication errors are handled by useApiRequest hook
        if (!error.message?.includes('Authentication failed')) {
          toast({
            title: "Lỗi",
            description: "Không thể tải đơn hàng của bạn. Vui lòng thử lại sau.",
            variant: "destructive"
          });
        }
      } finally {
        setLoadingUserOrders(false);
      }
    };

    // Only fetch if user is authenticated
    if (isAuthenticated) {
      fetchUserOrders();

      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchUserOrders, 30000);

      // Listen for focus events to refresh when user comes back to tab
      const handleFocus = () => {
        fetchUserOrders();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    } else {
      setLoadingUserOrders(false);
    }
  }, [toast, isAuthenticated]);

  // Load user's most recent order with medicine details
  useEffect(() => {
    const fetchRecentOrder = async () => {
      if (!isAuthenticated) {
        console.log('Order tracking: User not authenticated, skipping recent order fetch');
        setLoadingRecentOrder(false);
        return;
      }

      console.log('Order tracking: Fetching recent order...');
      try {
        setLoadingRecentOrder(true);
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE}/api/orders/most-recent`, {
          method: 'GET',
          headers
        });
        const result = await response.json();
        
        if (result.success) {
          // API đã trả về medicines rồi, không cần map lại
          setRecentOrder(result.data);
        }
      } catch (error: any) {
        console.error("Error fetching recent order:", error);
        // Don't show error toast for 404 (no orders found)
        if (!error.message?.includes('Authentication failed') && !error.message?.includes('404')) {
          toast({
            title: "Lỗi",
            description: "Không thể tải đơn hàng gần nhất",
            variant: "destructive"
          });
        }
      } finally {
        setLoadingRecentOrder(false);
      }
    };

    // Only fetch if user is authenticated
    if (isAuthenticated) {
      fetchRecentOrder();
    } else {
      setLoadingRecentOrder(false);
    }
  }, [isAuthenticated, toast]);


  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusInfo = (status: string, paymentStatus?: string) => {
    const effectiveStatus = (paymentStatus === 'paid' && (status === 'pending' || status === 'processing'))
      ? 'confirmed'
      : status;
    switch (effectiveStatus) {
      case 'pending':
        return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'confirmed':
        return { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'processing':
        return { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800', icon: Package };
      case 'shipped':
        return { label: 'Đang giao', color: 'bg-orange-100 text-orange-800', icon: Truck };
      case 'delivered':
        return { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Thanh toán khi nhận hàng';
      case 'card':
        return 'Thẻ tín dụng';
      case 'bank_transfer':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };


  return (
    <LoginDialogWrapper>
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Theo dõi đơn hàng</h1>
              <p className="text-muted-foreground">Xem trạng thái đơn hàng của bạn</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Thông báo",
                    description: "Vui lòng đăng nhập để xem đơn hàng của bạn",
                    variant: "destructive"
                  });
                  return;
                }
                
                setLoadingUserOrders(true);
                const fetchUserOrders = async () => {
                  try {
                    const token = localStorage.getItem('auth_token');
                    const headers: Record<string, string> = {};
                    if (token) {
                      headers['Authorization'] = `Bearer ${token}`;
                    }
                    
                    const response = await fetch(`${API_BASE}/api/orders?limit=5`, {
                      method: 'GET',
                      headers
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                      setUserOrders(result.data);
                      // Auto-select the most recent order
                      if (result.data.length > 0) {
                        setSelectedOrder(result.data[0]);
                      }
                    }
                  } catch (error: any) {
                    console.error("Error fetching user orders:", error);
                    
                    // Authentication errors are handled by useApiRequest hook
                    if (!error.message?.includes('Authentication failed')) {
                      toast({
                        title: "Lỗi",
                        description: "Không thể tải đơn hàng của bạn. Vui lòng thử lại sau.",
                        variant: "destructive"
                      });
                    }
                  } finally {
                    setLoadingUserOrders(false);
                  }
                };
                fetchUserOrders();
              }}
              disabled={loadingUserOrders || !isAuthenticated}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingUserOrders ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Tabs - Removed search tab, only show user orders */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-white text-primary shadow-sm"
            >
              <User className="h-4 w-4 mr-2 inline" />
              Đơn hàng của tôi
            </button>
          </div>
        </div>

        {/* User Orders Content */}
        <div className="space-y-6">
            {/* Most Recent Order with Medicine Details */}
            {loadingRecentOrder ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Đang tải đơn thuốc gần nhất...</p>
                  </div>
                </CardContent>
              </Card>
            ) : recentOrder ? (
              <RecentOrderCard 
                order={recentOrder}
                onReorder={() => {
                  setReorderOrderId(recentOrder._id);
                  setReorderDialogOpen(true);
                }}
              />
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Bạn chưa có đơn thuốc nào</p>
                    <Link href="/thuoc">
                      <Button className="mt-4" size="sm">
                        Mua thuốc ngay
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Orders List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Tất cả đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingUserOrders ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Đang tải...</p>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
                        <Link href="/">
                          <Button className="mt-4" size="sm">
                            Mua sắm ngay
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userOrders.map((order) => {
                          const statusInfo = getStatusInfo(order.status, (order as any).paymentStatus);
                          const Icon = statusInfo.icon;
                          return (
                            <div
                              key={order._id}
                              onClick={() => setSelectedOrder(order)}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedOrder?._id === order._id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">#{order.orderNumber}</span>
                                <Badge className={statusInfo.color}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{formatDate(order.createdAt)}</p>
                                <p className="font-medium text-primary">{format(order.totalAmount)} ₫</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            {/* Order Details */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Chi tiết đơn hàng #{selectedOrder.orderNumber}</span>
                        <Badge className={getStatusInfo(selectedOrder.status, (selectedOrder as any).paymentStatus).color}>
                          {getStatusInfo(selectedOrder.status, (selectedOrder as any).paymentStatus).label}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Ngày đặt:</p>
                          <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tổng tiền:</p>
                          <p className="font-medium text-primary">{format(selectedOrder.totalAmount)} ₫</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phương thức thanh toán:</p>
                          <p className="font-medium">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Trạng thái thanh toán:</p>
                          <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                            {selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Mã giảm giá:</strong> {selectedOrder.couponCode} 
                            <span className="ml-2">(-{format(selectedOrder.discountAmount)} ₫)</span>
                          </p>
                        </div>
                      ) : null}

                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Địa chỉ giao hàng:</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">{selectedOrder.shippingAddress}</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.shippingPhone}</p>
                        </div>
                      </div>

                      {selectedOrder.notes && (
                        <div>
                          <p className="text-muted-foreground text-sm mb-2">Ghi chú:</p>
                          <p className="text-sm">{selectedOrder.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sản phẩm đã đặt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => {
                          // Kiểm tra nếu productId null hoặc undefined
                          if (!item.productId) {
                            return (
                              <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-muted-foreground">Sản phẩm đã bị xóa</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.quantity} x {format(item.price || 0)} ₫
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-primary">
                                    {format(item.price * item.quantity)} ₫
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg">
                              <img
                                src={getImageUrl(item.productId.imageUrl)}
                                alt={item.productId.name || 'Sản phẩm'}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  // Fallback nếu image load fail
                                  (e.target as HTMLImageElement).src = `${API_BASE}/medicine-images/default-medicine.jpg`;
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.productId.name || 'Sản phẩm không xác định'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} x {format(item.productId.price || item.price || 0)} ₫/{item.productId.unit || 'đơn vị'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-primary">
                                  {format(item.price * item.quantity)} ₫
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setLocation(`/order-confirmation/${selectedOrder._id}`);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            setReorderOrderId(selectedOrder._id);
                            setReorderDialogOpen(true);
                          }}
                        >
                          Đặt lại
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chọn một đơn hàng để xem chi tiết</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        </main>

        <Footer />
        
        {/* Reorder Dialog */}
        <ReorderDialog
          open={reorderDialogOpen}
          onOpenChange={setReorderDialogOpen}
          orderId={reorderOrderId}
        />
      </div>
    </LoginDialogWrapper>
  );
}
