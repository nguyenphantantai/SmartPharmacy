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
  Award,
  TrendingUp
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ReorderDialog } from "@/components/reorder-dialog";

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

export default function GoldenOrderHistoryPage() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [reorderOrderId, setReorderOrderId] = useState<string>("");

  const GOLDEN_ORDER_THRESHOLD = 500000; // 500,000 VND

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
    const fetchGoldenOrders = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("GET", "/api/orders");
        const data = await response.json();

        if (data.success) {
          // Filter orders with totalAmount >= GOLDEN_ORDER_THRESHOLD
          const goldenOrders = data.data.filter((order: Order) => 
            order.totalAmount >= GOLDEN_ORDER_THRESHOLD
          );
          setOrders(goldenOrders);
        }
      } catch (error) {
        console.error('Error fetching golden orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldenOrders();
  }, []);

  const handleViewDetails = (orderId: string) => {
    setLocation(`/account/orders/${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    setReorderOrderId(orderId);
    setReorderDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/account")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lịch sử Đơn vàng</h1>
              <p className="text-muted-foreground">
                Các đơn hàng có giá trị từ {format(GOLDEN_ORDER_THRESHOLD)} VND trở lên
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có Đơn vàng</h3>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có đơn hàng nào đạt giá trị {format(GOLDEN_ORDER_THRESHOLD)} VND trở lên.
            </p>
            <Button onClick={() => setLocation("/")}>
              Mua sắm ngay
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status, order.paymentStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">Đơn hàng #{order.orderNumber}</h3>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                                <Award className="h-3 w-3 mr-1" />
                                Đơn vàng
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {order.shippingAddress}
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                {getPaymentMethodLabel(order.paymentMethod)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item._id} className="flex items-center gap-3 text-sm">
                              <img
                                src={item.productId.imageUrl}
                                alt={item.productId.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.productId.name}</p>
                                <p className="text-muted-foreground">
                                  {item.quantity} x {format(item.price)} VND
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 3} sản phẩm khác
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">Tổng tiền</p>
                            <p className="text-2xl font-bold text-primary">
                              {format(order.totalAmount)} VND
                            </p>
                            {order.discountAmount && order.discountAmount > 0 && (
                              <p className="text-sm text-green-600">
                                Đã giảm: {format(order.discountAmount)} VND
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(order._id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                            {order.status === 'delivered' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReorder(order._id)}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Đặt lại
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        orderId={reorderOrderId}
      />

      <Footer />
    </div>
  );
}

