import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const API_BASE = 'http://localhost:5000';

export default function OrderConfirmationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, params] = useRoute("/order-confirmation/:id");

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);

        // Try authenticated order first (if user has token)
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let response = await fetch(`${API_BASE}/api/orders/${params.id}`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const authResult = await response.json();
          if (authResult.success) {
            setOrderData(authResult.data);
            return;
          }
        }

        // Fallback to guest order (works for guest checkout)
        response = await fetch(`${API_BASE}/api/orders/guest-by-id/${params.id}`);
        const guestResult = await response.json();
        if (guestResult.success) {
          setOrderData(guestResult.data);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 mx-auto max-w-4xl px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải thông tin đơn hàng...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 mx-auto max-w-4xl px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy đơn hàng</h1>
            <Link href="/">
              <Button>Về trang chủ</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getPaymentMethodText = (method: string) => {
    const methods: { [key: string]: string } = {
      cod: "Thanh toán tiền mặt khi nhận hàng",
      qr: "Thanh toán bằng chuyển khoản (QR Code)",
      atm: "Thanh toán bằng thẻ ATM nội địa",
      card: "Thanh toán bằng thẻ quốc tế",
      zalopay: "Thanh toán bằng ví ZaloPay",
      momo: "Thanh toán bằng ví MoMo",
      vnpay: "Thanh toán bằng VNPAY"
    };
    return methods[method] || method;
  };

  const getStatusText = (status: string) => {
    const statuses: { [key: string]: string } = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipped: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy"
    };
    return statuses[status] || status;
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-4xl px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã mua sắm tại NHÀ THUỐC THÔNG MINH
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-card rounded-2xl border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
            <span className="text-sm text-muted-foreground">
              {new Date(orderData.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Thông tin đơn hàng
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Mã đơn hàng:</span> {orderData.orderNumber}</div>
                <div><span className="font-medium">Trạng thái:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    orderData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    orderData.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusText(orderData.status)}
                  </span>
                </div>
                <div><span className="font-medium">Tổng tiền:</span> {format(orderData.totalAmount)} ₫</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Phương thức thanh toán
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Phương thức:</span> {getPaymentMethodText(orderData.paymentMethod)}</div>
                <div><span className="font-medium">Trạng thái thanh toán:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    orderData.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    orderData.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {orderData.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </div>
                {orderData.paymentMethod === 'cash' && orderData.paymentStatus === 'pending' && (
                  <div className="text-xs text-yellow-600 mt-1">
                    ⚠️ Đơn hàng đã được tạo. Vui lòng chờ admin xác nhận thanh toán.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-2xl border p-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h3>
          <div className="space-y-4">
            {orderData.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.productId?.name || 'Sản phẩm'}</h4>
                  <p className="text-sm text-muted-foreground">
                    Số lượng: {item.quantity} | Đơn giá: {format(item.price)} ₫
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{format(item.price * item.quantity)} ₫</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-card rounded-2xl border p-8 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Thông tin giao hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Người nhận</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Số điện thoại: {orderData.shippingPhone}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Địa chỉ giao hàng</h4>
              <div className="text-sm text-muted-foreground">
                {orderData.shippingAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">Bước tiếp theo</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Xác nhận đơn hàng</p>
                <p>Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium">Chuẩn bị hàng</p>
                <p>Đơn hàng sẽ được chuẩn bị và đóng gói cẩn thận</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Giao hàng</p>
                <p>Đơn hàng sẽ được giao trong 1-2 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Tiếp tục mua sắm
            </Button>
          </Link>
          <Link href={`/track-order?order=${orderData?.orderNumber || ''}`}>
            <Button className="w-full sm:w-auto">
              Theo dõi đơn hàng
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
