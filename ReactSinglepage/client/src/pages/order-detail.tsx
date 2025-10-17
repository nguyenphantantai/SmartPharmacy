import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Plus,
  Minus,
  ShoppingCart,
  Edit3,
  Save,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
    unit: string;
    description?: string;
    category?: string;
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

export default function OrderDetailPage() {
  const [, params] = useRoute("/account/chi-tiet-don-hang/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItems, setEditingItems] = useState<{ [key: string]: number }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { toast } = useToast();

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
        return { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' };
      case 'processing':
        return { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800' };
      case 'shipped':
        return { label: 'Đang giao', color: 'bg-orange-100 text-orange-800' };
      case 'delivered':
        return { label: 'Đã giao', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
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
    const fetchOrderDetail = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);
        const response = await apiRequest("GET", `/api/orders/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setOrder(result.data);
          // Initialize editing quantities with current quantities
          const initialQuantities: { [key: string]: number } = {};
          result.data.items.forEach((item: OrderItem) => {
            initialQuantities[item._id] = item.quantity;
          });
          setEditingItems(initialQuantities);
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải chi tiết đơn hàng",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [params?.id, toast]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setEditingItems(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const calculateNewTotal = () => {
    if (!order) return 0;
    
    return order.items.reduce((total, item) => {
      const quantity = editingItems[item._id] || 0;
      return total + (item.price * quantity);
    }, 0);
  };

  const getChangedItems = () => {
    if (!order) return [];
    
    return order.items.filter(item => {
      const originalQuantity = item.quantity;
      const newQuantity = editingItems[item._id] || 0;
      return newQuantity !== originalQuantity && newQuantity > 0;
    });
  };

  const handleCreateNewOrder = async () => {
    if (!order) return;
    
    const changedItems = getChangedItems();
    if (changedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng thay đổi số lượng thuốc trước khi tạo đơn mới",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreatingOrder(true);
      
      const newOrderItems = changedItems.map(item => ({
        productId: item.productId._id,
        quantity: editingItems[item._id],
        price: item.price
      }));

      const response = await apiRequest("POST", "/api/orders", {
        items: newOrderItems,
        shippingAddress: order.shippingAddress,
        shippingPhone: order.shippingPhone,
        paymentMethod: order.paymentMethod,
        notes: `Đơn hàng được tạo từ đơn cũ #${order.orderNumber}`,
        discountAmount: 0
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã tạo đơn hàng mới từ đơn cũ",
        });
        
        // Redirect to new order confirmation
        window.location.href = `/order-confirmation/${result.data._id}`;
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating new order:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo đơn hàng mới",
        variant: "destructive"
      });
    } finally {
      setCreatingOrder(false);
    }
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

  if (!order) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy đơn hàng</h1>
            <Link href="/account/lich-su-don-hang">
              <Button>Quay lại lịch sử đơn hàng</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const newTotal = calculateNewTotal();
  const originalTotal = order.totalAmount;
  const changedItems = getChangedItems();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 hover:underline p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <span>/</span>
          <Link href="/account/lich-su-don-hang">
            <span className="hover:underline cursor-pointer">Lịch sử đơn hàng</span>
          </Link>
          <span>/</span>
          <span>Chi tiết đơn hàng</span>
        </div>

        {/* Order Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.orderNumber}</h1>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa đơn hàng'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-medium">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đặt</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="font-medium text-primary">{format(order.totalAmount)} ₫</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                  <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái thanh toán</p>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{order.shippingPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {isEditing ? 'Chỉnh sửa thuốc/thực phẩm' : 'Thuốc/thực phẩm đã đặt'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.productId.imageUrl}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productId.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.productId.description || 'Không có mô tả'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Đơn giá: {format(item.price)} ₫/{item.productId.unit}
                        </p>
                      </div>
                      
                      {isEditing ? (
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, editingItems[item._id] - 1)}
                            disabled={editingItems[item._id] <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={editingItems[item._id] || 0}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, editingItems[item._id] + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="font-medium">Số lượng: {item.quantity}</p>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          {format(item.price * (editingItems[item._id] || item.quantity))} ₫
                        </p>
                        {isEditing && editingItems[item._id] !== item.quantity && (
                          <p className="text-xs text-muted-foreground">
                            Gốc: {format(item.price * item.quantity)} ₫
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng tiền:</span>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">
                        {format(newTotal)} ₫
                      </p>
                      {isEditing && newTotal !== originalTotal && (
                        <p className="text-sm text-muted-foreground">
                          Gốc: {format(originalTotal)} ₫
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={handleCreateNewOrder}
                      disabled={creatingOrder || changedItems.length === 0}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {creatingOrder ? 'Đang tạo đơn...' : 'Tạo đơn hàng mới'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                )}

                {isEditing && changedItems.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Thay đổi:</strong> {changedItems.length} thuốc/thực phẩm đã được chỉnh sửa
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
