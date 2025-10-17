import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useApiRequest } from "@/hooks/useApiRequest";
import SenderForm from "@/components/sender-form";
import AddressForm from "@/components/address-form";
import PaymentMethodForm from "@/components/payment-method-form";
import CouponInput from "@/components/coupon-input";

export default function CheckoutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { items, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { apiRequest } = useApiRequest();

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load applied coupon from localStorage on mount
  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem('applied_coupon');
      if (savedCoupon) {
        const couponData = JSON.parse(savedCoupon);
        setAppliedCoupon(couponData);
        setDiscountAmount(couponData.discountAmount || 0);
      }
    } catch (error) {
      console.error('Error loading saved coupon:', error);
    }
  }, []);

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

      // Map payment method to backend format
      const mapPaymentMethod = (method: string) => {
        switch (method) {
          case 'bank_transfer_atm':
            return 'bank_transfer';
          default:
            return method;
        }
      };

      // Create order data
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id || item.product.id, // Use actual product ID (MongoDB uses _id)
          quantity: item.quantity,
          price: toNum(item.product.price)
        })),
        shippingAddress: `${addressData.address}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.provinceName}`,
        shippingPhone: addressData.receiverPhone,
        paymentMethod: mapPaymentMethod(paymentMethod),
        notes: `Địa chỉ: ${addressData.address}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.provinceName}`,
        couponCode: appliedCoupon?.code,
        discountAmount: discountAmount
      };

      // Call API to create order (authenticated user or guest)
      const response = await apiRequest("POST", "/api/orders", orderData);
      const result = await response.json();

      if (result.success) {
        // Clear cart
        clear();
        
        // Trigger order refresh for other pages
        localStorage.setItem('orderCreated', Date.now().toString());
        
        // Show success message
        toast({
          title: "Đặt hàng thành công!",
          description: `Mã đơn hàng: ${result.data.orderNumber}`,
        });

        // Redirect to order confirmation page
        setLocation(`/order-confirmation/${result.data._id}`);
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
                <CouponInput
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


