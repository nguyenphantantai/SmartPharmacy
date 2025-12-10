import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useAuth } from "@/contexts/AuthContext";
import SenderForm from "@/components/sender-form";
import AddressForm from "@/components/address-form";
import PaymentMethodForm from "@/components/payment-method-form";
import CouponSelector from "@/components/coupon-selector";
import { API_BASE } from "@/lib/utils";

export default function CheckoutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { items, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { apiRequest } = useApiRequest();
  const { isAuthenticated, showLoginDialog, user } = useAuth();
  

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load applied coupon from localStorage on mount and when items change
  // Validate coupon with backend to ensure it's still valid
  useEffect(() => {
    const validateAndLoadCoupon = async () => {
      try {
        const savedCoupon = localStorage.getItem('applied_coupon');
        if (!savedCoupon) {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          return;
        }

        const couponData = JSON.parse(savedCoupon);
        const couponCode = couponData.code;

        if (!couponCode) {
          // No code, clear coupon
          localStorage.removeItem('applied_coupon');
          setAppliedCoupon(null);
          setDiscountAmount(0);
          return;
        }

        // Validate coupon with backend to ensure it's still valid
        try {
          const subtotal = items.reduce((sum, i) => sum + toNum(i.product.price) * i.quantity, 0);
          
          // Try promotion code validation first
          const response = await apiRequest("POST", "/api/promotions/validate-code", {
            code: couponCode,
            orderAmount: subtotal,
          });

          const data = await response.json();
          
          if (data.success) {
            // Coupon is still valid, update discount amount
            const discountAmount = data.data.discountAmount;
            setAppliedCoupon(couponData);
            setDiscountAmount(discountAmount);
            // Update localStorage with new discount amount
            localStorage.setItem('applied_coupon', JSON.stringify({
              ...couponData,
              discountAmount: discountAmount,
            }));
          } else {
            // Coupon is invalid or expired, remove it
            console.log('Coupon validation failed:', data.message);
            localStorage.removeItem('applied_coupon');
            setAppliedCoupon(null);
            setDiscountAmount(0);
          }
        } catch (promoError) {
          // Try coupon validation as fallback
          try {
            const subtotal = items.reduce((sum, i) => sum + toNum(i.product.price) * i.quantity, 0);
            const response = await apiRequest("POST", "/api/coupons/validate", {
              code: couponCode,
              orderAmount: subtotal,
            });

            const data = await response.json();
            
            if (data.success) {
              // Coupon is still valid, update discount amount
              const discountAmount = data.data.discountAmount;
              setAppliedCoupon(couponData);
              setDiscountAmount(discountAmount);
              // Update localStorage with new discount amount
              localStorage.setItem('applied_coupon', JSON.stringify({
                ...couponData,
                discountAmount: discountAmount,
              }));
            } else {
              // Coupon is invalid or expired, remove it
              console.log('Coupon validation failed:', data.message);
              localStorage.removeItem('applied_coupon');
              setAppliedCoupon(null);
              setDiscountAmount(0);
            }
          } catch (couponError) {
            // Both validations failed, remove coupon
            console.error('Error validating coupon:', couponError);
            localStorage.removeItem('applied_coupon');
            setAppliedCoupon(null);
            setDiscountAmount(0);
          }
        }
      } catch (error) {
        console.error('Error loading saved coupon:', error);
        localStorage.removeItem('applied_coupon');
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    };

    validateAndLoadCoupon();
  }, [items, apiRequest]); // Re-check when items change

  // Form data
  const [senderData, setSenderData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: ""
  });

  const [addressData, setAddressData] = useState({
    receiverName: "",
    receiverPhone: "",
    province: "",
    provinceName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    address: ""
  });

  const toNum = (s: string) => parseInt(s || "0");
  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const subtotal = items.reduce((sum, i) => sum + toNum(i.product.price) * i.quantity, 0);
  const finalAmount = subtotal - discountAmount;

  // Coupon handlers
  const handleCouponApplied = (coupon: any, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
    toast({
      title: "Áp dụng mã giảm giá thành công",
      description: `Bạn đã tiết kiệm được ${format(discount)}đ`,
    });
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast({
      title: "Đã xóa mã giảm giá",
      description: "Mã giảm giá đã được gỡ bỏ khỏi đơn hàng",
    });
  };

  const handleSenderDataChange = (data: typeof senderData) => {
    setSenderData(data);
  };

  const handleAddressDataChange = (data: typeof addressData) => {
    setAddressData(data);
  };

  // Check if token is valid before checkout
  const checkTokenValidity = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }

    try {
      // Test token by calling a simple authenticated endpoint
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.log('Token is invalid, user needs to login again');
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  };

  const handleCheckout = async () => {
    // Validate form
    if (!senderData.senderName || !senderData.senderPhone || !addressData.receiverName || 
        !addressData.receiverPhone || !addressData.province || !addressData.district || 
        !addressData.ward || !addressData.address) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Lỗi",
        description: "Giỏ hàng trống",
        variant: "destructive"
      });
      return;
    }

    // Check token validity if user is authenticated
    if (isAuthenticated && user) {
      const isTokenValid = await checkTokenValidity();
      if (!isTokenValid) {
        toast({
          title: "Phiên đăng nhập đã hết hạn",
          description: "Vui lòng đăng nhập lại để đặt hàng và xem lịch sử đơn hàng",
          variant: "destructive"
        });
        showLoginDialog();
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Debug: Log cart items
      console.log('Cart items:', items);
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        });
      });

      const mappedPaymentMethod = paymentMethod;
      console.log('Payment method:', paymentMethod);

      // Create order data
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id || item.product.id, // Use actual product ID (MongoDB uses _id)
          quantity: item.quantity,
          price: toNum(item.product.price)
        })),
        shippingAddress: `${addressData.address}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.provinceName}`,
        shippingPhone: addressData.receiverPhone,
        paymentMethod: mappedPaymentMethod,
        notes: `Địa chỉ: ${addressData.address}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.provinceName}`,
        couponCode: appliedCoupon?.code,
        discountAmount: discountAmount
      };

      // Call API to create order (authenticated user or guest)
      const response = await apiRequest("POST", "/api/orders", orderData);
      const result = await response.json();

      if (result.success) {
        console.log('Order created successfully:', result.data);
        console.log('Order userId:', result.data.userId || 'GUEST');
        console.log('Order payment method:', result.data.paymentMethod);
        
        // IMPORTANT: For online payments (VNPay/MoMo), don't show success message yet
        // Wait for payment confirmation before showing success
        // Order is created but payment is still pending
        
        // If payment method is MoMo, create payment request and redirect to MoMo payment page
        if (mappedPaymentMethod === 'momo') {
          console.log('Processing MoMo payment...');
          try {
            // Create MoMo payment request
            console.log('Creating MoMo payment request for order:', result.data._id);
            const paymentResponse = await apiRequest("POST", "/api/payment/momo/create", {
              orderId: result.data._id,
              amount: finalAmount,
              orderInfo: `Thanh toán đơn hàng ${result.data.orderNumber}`,
            });
            
            const paymentResult = await paymentResponse.json();
            console.log('MoMo payment response:', paymentResult);
            
            if (paymentResult.success && paymentResult.data.payUrl) {
              console.log('MoMo payment request created successfully, redirecting to MoMo payment page');
              
              // Redirect to MoMo payment page
              window.location.href = paymentResult.data.payUrl;
              
              // Don't clear cart yet - wait for payment confirmation
              // Don't redirect yet - wait for payment confirmation
              setIsProcessing(false);
              return; // Exit early
            } else {
              throw new Error(paymentResult.message || "Không thể tạo yêu cầu thanh toán MoMo");
            }
          } catch (error) {
            console.error("MoMo payment creation error:", error);
            toast({
              title: "Lỗi",
              description: error instanceof Error ? error.message : "Không thể tạo yêu cầu thanh toán MoMo",
              variant: "destructive"
            });
            // For MoMo payment errors, don't redirect - let user try again or choose different payment method
            // Don't clear cart - order is created but payment failed
            setIsProcessing(false);
            return; // Exit early
          }
        }
        // If payment method is VNPay, create payment request and redirect to VNPay payment page
        else if (mappedPaymentMethod === 'vnpay') {
          console.log('Processing VNPay payment...');
          try {
            // Create VNPay payment request
            console.log('Creating VNPay payment request for order:', result.data._id);
            const paymentResponse = await apiRequest("POST", "/api/payment/vnpay/create", {
              orderId: result.data._id,
              amount: finalAmount,
              orderInfo: `Thanh toán đơn hàng ${result.data.orderNumber}`,
            });
            
            const paymentResult = await paymentResponse.json();
            console.log('VNPay payment response:', paymentResult);
            
            if (paymentResult.success && paymentResult.data.payUrl) {
              console.log('VNPay payment request created successfully, redirecting to VNPay payment page');
              
              // Show loading message (not success - payment is pending)
              toast({
                title: "Đang chuyển đến VNPay...",
                description: "Vui lòng hoàn tất thanh toán trên trang VNPay",
              });
              
              // Small delay to show toast, then redirect
              setTimeout(() => {
                // Redirect to VNPay payment page
                window.location.href = paymentResult.data.payUrl;
              }, 500);
              
              // Don't clear cart yet - wait for payment confirmation
              // Don't show success message - payment is still pending
              setIsProcessing(false);
              return; // Exit early
            } else {
              throw new Error(paymentResult.message || "Không thể tạo yêu cầu thanh toán VNPay");
            }
          } catch (error) {
            console.error("VNPay payment creation error:", error);
            toast({
              title: "Lỗi",
              description: error instanceof Error ? error.message : "Không thể tạo yêu cầu thanh toán VNPay",
              variant: "destructive"
            });
            // For VNPay payment errors, don't redirect - let user try again or choose different payment method
            // Don't clear cart - order is created but payment failed
            setIsProcessing(false);
            return; // Exit early
          }
        } else {
          // For non-online payment methods (cash, etc.), proceed as normal
          console.log('Non-online payment method, proceeding with normal checkout flow');
          
          // Clear cart
          clear();
          
          // Trigger order refresh for other pages
          localStorage.setItem('orderCreated', Date.now().toString());
          
          // Dispatch custom event to refresh order list in same tab
          window.dispatchEvent(new Event('orderCreated'));
          
          // Show success message based on payment method
          if (mappedPaymentMethod === 'cash') {
            // Cash payment: Order created, waiting for admin to confirm payment
            toast({
              title: "Đặt hàng thành công!",
              description: `Mã đơn hàng: ${result.data.orderNumber}. Vui lòng chờ xác nhận thanh toán từ admin.`,
            });
          } else {
            // Other payment methods
            toast({
              title: "Đặt hàng thành công!",
              description: `Mã đơn hàng: ${result.data.orderNumber}`,
            });
          }

          // Redirect to order confirmation page
          setLocation(`/order-confirmation/${result.data._id}`);
        }
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <section className="bg-card rounded-2xl border p-8 space-y-8">
            <SenderForm 
              formData={senderData}
              onFormDataChange={handleSenderDataChange}
            />
            
            <AddressForm 
              formData={addressData}
              onFormDataChange={handleAddressDataChange}
              senderData={{
                name: senderData.senderName,
                phone: senderData.senderPhone
              }}
            />
            
            <PaymentMethodForm 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </section>

          <aside className="bg-card rounded-2xl border p-8 h-max">
            <h3 className="font-semibold mb-4">Thành tiền</h3>
            
            {/* Coupon Input */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-sm font-medium text-green-800">
                        ✓ {appliedCoupon.name} ({appliedCoupon.code})
                      </div>
                      <div className="text-xs text-green-600">
                        Đã giảm {format(discountAmount)}đ
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setDiscountAmount(0);
                      localStorage.removeItem('applied_coupon');
                      toast({
                        title: "Đã xóa mã giảm giá",
                        description: "Mã giảm giá đã được gỡ bỏ khỏi đơn hàng",
                      });
                    }}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <CouponSelector
                  orderAmount={subtotal}
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                  appliedCoupon={appliedCoupon}
                  discountAmount={discountAmount}
                />
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền</span>
                <span>{format(subtotal)}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{format(discountAmount)}đ</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Thành tiền</span>
                  <span className="text-red-500">{format(finalAmount)}đ</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-6 w-full" 
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? "Đang xử lý..." : "Đặt Hàng"}
            </Button>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}


