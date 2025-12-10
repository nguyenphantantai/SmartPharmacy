import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Eye, 
  RotateCcw,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Save
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ReorderDialog } from "@/components/reorder-dialog";
import { getImageUrl } from "@/lib/imageUtils";
import { API_BASE } from "@/lib/utils";

interface OrderItem {
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
}

interface Order {
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
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [reorderOrderId, setReorderOrderId] = useState<string>("");

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string, paymentStatus?: string) => {
    // If payment was confirmed, prefer showing "Đã xác nhận"
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
        return { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle };
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('OrderHistoryPage - Fetching orders...');
        
        const [ordersResponse, statsResponse] = await Promise.all([
          apiRequest("GET", "/api/orders"),
          apiRequest("GET", "/api/orders/stats")
        ]);

        const ordersData = await ordersResponse.json();
        const statsData = await statsResponse.json();

        console.log('OrderHistoryPage - Orders response:', ordersData);
        console.log('OrderHistoryPage - Stats response:', statsData);

        if (ordersData.success) {
          console.log('OrderHistoryPage - Orders data:', ordersData.data);
          console.log('OrderHistoryPage - Orders count:', ordersData.data?.length || 0);
          setOrders(ordersData.data || []);
        } else {
          console.error('OrderHistoryPage - Orders API failed:', ordersData);
        }
        
        if (statsData.success) {
          console.log('OrderHistoryPage - Stats data:', statsData.data);
          setStats(statsData.data);
        } else {
          console.error('OrderHistoryPage - Stats API failed:', statsData);
        }
      } catch (error) {
        console.error('OrderHistoryPage - Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Check if order was just created and refresh immediately
    const orderCreated = localStorage.getItem('orderCreated');
    if (orderCreated) {
      console.log('Order was created, refreshing order list...');
      setTimeout(() => {
        fetchOrders();
        localStorage.removeItem('orderCreated');
      }, 1000); // Wait 1 second for backend to process
    }

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    // Listen for focus events to refresh when user comes back to tab
    const handleFocus = () => {
      fetchOrders();
    };

    // Listen for storage events (when order is created in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orderCreated') {
        console.log('Order created in another tab, refreshing...');
        fetchOrders();
        localStorage.removeItem('orderCreated');
      }
    };

    // Listen for custom event (when order is created in same tab)
    const handleOrderCreated = () => {
      console.log('Order created event received, refreshing...');
      fetchOrders();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orderCreated', handleOrderCreated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderCreated', handleOrderCreated);
    };
  }, []);

  const handleViewOrder = (orderId: string) => {
    setLocation(`/account/chi-tiet-don-hang/${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    setReorderOrderId(orderId);
    setReorderDialogOpen(true);
  };

  const handleSavePrescription = (orderId: string) => {
    // Navigate to save prescription page with order ID
    setLocation(`/account/luu-don-thuoc-tu-don-hang/${orderId}`);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/account")}
            className="inline-flex items-center gap-2 hover:underline p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Tài khoản
          </Button>
          <span>/</span>
          <span>Lịch sử đơn hàng</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setLoading(true);
              const fetchOrders = async () => {
                try {
                  const [ordersResponse, statsResponse] = await Promise.all([
                    apiRequest("GET", "/api/orders"),
                    apiRequest("GET", "/api/orders/stats")
                  ]);

                  const ordersData = await ordersResponse.json();
                  const statsData = await statsResponse.json();

                  if (ordersData.success) {
                    setOrders(ordersData.data);
                  }
                  if (statsData.success) {
                    setStats(statsData.data);
                  }
                } catch (error) {
                  console.error('Error fetching orders:', error);
                } finally {
                  setLoading(false);
                }
              };
              fetchOrders();
            }}
            disabled={loading}
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.completedOrders}</div>
                    <div className="text-sm text-muted-foreground">Đã giao</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                    <div className="text-sm text-muted-foreground">Đang xử lý</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{format(stats.totalAmount)}đ</div>
                    <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-muted-foreground mb-4">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <Button onClick={() => setLocation("/")}>
                Mua sắm ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status, (order as any).paymentStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">#{order.orderNumber}</h3>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.shippingAddress}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-red-500">
                          {format(order.totalAmount)}đ
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="text-sm text-green-600">
                            Tiết kiệm: {format(order.discountAmount)}đ
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Sản phẩm:</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => {
                          // Kiểm tra nếu productId null hoặc undefined
                          if (!item.productId) {
                            return (
                              <div key={item._id} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-muted-foreground">Sản phẩm đã bị xóa</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.quantity} x {format(item.price || 0)}đ
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={item._id} className="flex items-center gap-3">
                              <img 
                                src={getImageUrl(item.productId.imageUrl)} 
                                alt={item.productId.name || 'Sản phẩm'}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  // Fallback nếu image load fail
                                  (e.target as HTMLImageElement).src = `${API_BASE}/medicine-images/default-medicine.jpg`;
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.productId.name || 'Sản phẩm không xác định'}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.quantity} x {format(item.productId.price || item.price || 0)}đ
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {order.items.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 3} sản phẩm khác
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem chi tiết
                      </Button>
                      {order.status === 'delivered' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReorder(order._id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Mua lại
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSavePrescription(order._id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Lưu đơn thuốc
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      
      {/* Reorder Dialog */}
      <ReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        orderId={reorderOrderId}
      />
    </div>
  );
}
