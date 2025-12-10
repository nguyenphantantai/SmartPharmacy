import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { API_BASE } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export default function PaymentSuccessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { clear } = useCart();
  const [cartCleared, setCartCleared] = useState(false);
  const [orderIdFromUrl, setOrderIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check if this is VNPay return (has vnp_ResponseCode)
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');
        const vnpTxnRef = urlParams.get('vnp_TxnRef');
        
        // Check if this is MoMo return (has resultCode)
        const orderId = urlParams.get('orderId');
        const resultCode = urlParams.get('resultCode');
        const message = urlParams.get('message');

        // Handle VNPay return
        if (vnpResponseCode !== null && vnpTxnRef) {
          console.log('VNPay return detected:', { vnpResponseCode, vnpTxnRef });
          
          // Store orderId from URL for navigation
          setOrderIdFromUrl(vnpTxnRef);

          // Check payment status from backend
          // If vnp_ResponseCode is '00', pass it to backend to confirm payment immediately
          const statusUrl = vnpResponseCode === '00' 
            ? `${API_BASE}/api/payment/vnpay/status/${vnpTxnRef}?vnp_ResponseCode=00`
            : `${API_BASE}/api/payment/vnpay/status/${vnpTxnRef}`;
          
          const response = await fetch(statusUrl);
          const result = await response.json();

          if (result.success) {
            setOrderData(result.data);
            
            if (result.data.paymentStatus === 'paid') {
              setPaymentStatus('success');
              // Clear cart and coupon when payment is confirmed successful
              if (!cartCleared) {
                clear();
                localStorage.removeItem('applied_coupon');
                setCartCleared(true);
                console.log('Cart and coupon cleared after successful VNPay payment');
              }
            } else if (result.data.paymentStatus === 'failed') {
              setPaymentStatus('failed');
              setErrorMessage('Thanh toán thất bại');
            } else {
              // If vnp_ResponseCode is '00' but payment status is still pending, try to confirm
              if (vnpResponseCode === '00') {
                // Payment was successful according to VNPay, but order not updated yet
                setPaymentStatus('success');
                if (!cartCleared) {
                  clear();
                  localStorage.removeItem('applied_coupon');
                  setCartCleared(true);
                  console.log('Cart and coupon cleared after successful VNPay payment (vnp_ResponseCode=00, pending status)');
                }
              } else {
                setPaymentStatus('pending');
              }
            }
          } else {
            // If vnp_ResponseCode from VNPay is '00', payment is successful
            if (vnpResponseCode === '00') {
              setPaymentStatus('success');
              // Clear cart and coupon when payment is confirmed successful
              if (!cartCleared) {
                clear();
                localStorage.removeItem('applied_coupon');
                setCartCleared(true);
                console.log('Cart and coupon cleared after successful VNPay payment (vnp_ResponseCode=00)');
              }
            } else {
              setPaymentStatus('failed');
              setErrorMessage('Thanh toán thất bại');
            }
          }
          return; // Exit early for VNPay
        }

        // Handle MoMo return (existing code)
        if (!orderId) {
          setPaymentStatus('failed');
          setErrorMessage('Không tìm thấy thông tin đơn hàng');
          return;
        }

        // Store orderId from URL for navigation
        setOrderIdFromUrl(orderId);

        // Check payment status from backend
        // If resultCode is 0, pass it to backend to confirm payment immediately
        const statusUrl = resultCode === '0' 
          ? `${API_BASE}/api/payment/momo/status/${orderId}?resultCode=0`
          : `${API_BASE}/api/payment/momo/status/${orderId}`;
        
        const response = await fetch(statusUrl);
        const result = await response.json();

        if (result.success) {
          setOrderData(result.data);
          
          if (result.data.paymentStatus === 'paid') {
            setPaymentStatus('success');
            // Clear cart and coupon when payment is confirmed successful
            if (!cartCleared) {
              clear();
              localStorage.removeItem('applied_coupon');
              setCartCleared(true);
              console.log('Cart and coupon cleared after successful MoMo payment');
            }
          } else if (result.data.paymentStatus === 'failed') {
            setPaymentStatus('failed');
            setErrorMessage(message || 'Thanh toán thất bại');
          } else {
            // If resultCode is 0 but payment status is still pending, try to confirm
            if (resultCode === '0') {
              // Payment was successful according to MoMo, but order not updated yet
              // This should be handled by backend, but if not, set success anyway
              setPaymentStatus('success');
              if (!cartCleared) {
                clear();
                localStorage.removeItem('applied_coupon');
                setCartCleared(true);
                console.log('Cart and coupon cleared after successful MoMo payment (resultCode=0, pending status)');
              }
            } else {
              setPaymentStatus('pending');
            }
          }
        } else {
          // If resultCode from MoMo is 0, payment is successful
          if (resultCode === '0') {
            setPaymentStatus('success');
            // Clear cart and coupon when payment is confirmed successful
            if (!cartCleared) {
              clear();
              localStorage.removeItem('applied_coupon');
              setCartCleared(true);
              console.log('Cart and coupon cleared after successful MoMo payment (resultCode=0)');
            }
          } else {
            setPaymentStatus('failed');
            setErrorMessage(message || 'Thanh toán thất bại');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
        setErrorMessage('Không thể kiểm tra trạng thái thanh toán');
      }
    };

    checkPaymentStatus();
  }, []);

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-4xl px-6 py-16">
        <div className="bg-card rounded-2xl border p-8 md:p-12">
          {paymentStatus === 'checking' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Đang kiểm tra trạng thái thanh toán...
              </h1>
              <p className="text-gray-600">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 text-lg">
                  Cảm ơn bạn đã thanh toán đơn hàng
                </p>
              </div>

              {orderData && (
                <div className="bg-gray-50 rounded-lg p-6 mt-8 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-semibold">{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái thanh toán:</span>
                      <span className="font-semibold text-green-600">
                        {orderData.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Đang xử lý'}
                      </span>
                    </div>
                    {orderData.orderStatus && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trạng thái đơn hàng:</span>
                        <span className={`font-semibold ${
                          orderData.orderStatus === 'confirmed' ? 'text-blue-600' :
                          orderData.orderStatus === 'processing' ? 'text-purple-600' :
                          orderData.orderStatus === 'shipped' ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {orderData.orderStatus === 'confirmed' ? '✓ Đã xác nhận' : 
                           orderData.orderStatus === 'processing' ? 'Đang xử lý' :
                           orderData.orderStatus === 'shipped' ? 'Đã giao hàng' :
                           orderData.orderStatus === 'pending' ? 'Chờ xác nhận' :
                           orderData.orderStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Về trang chủ
                  </Button>
                </Link>
                {(orderData?.orderDbId || orderData?.orderId || orderIdFromUrl) && (
                  <Link href={
                    orderData?.orderDbId 
                      ? `/order-confirmation/${orderData.orderDbId}`
                      : orderData?.orderId 
                        ? `/order-tracking?orderNumber=${orderData.orderId}`
                        : orderIdFromUrl
                          ? `/order-tracking?orderNumber=${orderIdFromUrl}`
                          : '/'
                  }>
                    <Button className="w-full sm:w-auto">
                      <Package className="h-4 w-4 mr-2" />
                      Xem đơn hàng
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thanh toán thất bại
                </h1>
                <p className="text-gray-600 text-lg">
                  {errorMessage || 'Đã xảy ra lỗi trong quá trình thanh toán'}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Nếu bạn đã thanh toán thành công nhưng trang này hiển thị lỗi, 
                  vui lòng liên hệ với chúng tôi để được hỗ trợ.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Về trang chủ
                  </Button>
                </Link>
                <Button 
                  onClick={() => setLocation('/checkout')}
                  className="w-full sm:w-auto"
                >
                  Thử lại thanh toán
                </Button>
              </div>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-yellow-600 animate-spin" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Đang xử lý thanh toán
                </h1>
                <p className="text-gray-600 text-lg">
                  Vui lòng đợi trong giây lát, chúng tôi đang xử lý giao dịch của bạn
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  Trạng thái thanh toán sẽ được cập nhật tự động. 
                  Nếu sau 5 phút vẫn chưa cập nhật, vui lòng liên hệ với chúng tôi.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Về trang chủ
                  </Button>
                </Link>
                {orderData?.orderId && (
                  <Link href={`/order-tracking?orderNumber=${orderData.orderId}`}>
                    <Button className="w-full sm:w-auto">
                      <Package className="h-4 w-4 mr-2" />
                      Theo dõi đơn hàng
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

