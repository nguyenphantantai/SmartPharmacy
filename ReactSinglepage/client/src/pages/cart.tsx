import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import CheckoutSavings from "@/components/CheckoutSavings";
import { getImageUrl } from "@/lib/imageUtils";

export default function CartPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { items, removeItem, clear, updateQuantity } = useCart();

  // Pricing state updated from CheckoutSavings
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const toNum = (s: string) => parseInt(s || "0");
  const promoItems = items.map(({ product, quantity }) => ({
    productId: String(product._id || product.id),
    quantity,
    price: toNum(product.price),
    categoryId: product.categoryId ? String(product.categoryId) : (product.category ? String(product.category) : undefined)
  }));
  
  // Calculate totals (bỏ phần discount vì là dữ liệu ảo)
  const totals = items.reduce((acc, item) => {
    const currentPrice = toNum(item.product.price);
    const itemSubtotal = currentPrice * item.quantity;
    
    return {
      subtotal: acc.subtotal + itemSubtotal,
      originalTotal: acc.subtotal + itemSubtotal,
      totalSavings: 0
    };
  }, { subtotal: 0, originalTotal: 0, totalSavings: 0 });

  // Ensure initial final total equals subtotal when no discounts
  const currentFinalTotal = finalTotal || totals.subtotal - discountAmount;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <section className="bg-card rounded-2xl border p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="inline-flex items-center gap-2 hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </div>

            <h2 className="text-lg font-semibold mb-4">Giỏ hàng của bạn</h2>

            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed p-14 text-center text-base">
                <p className="text-muted-foreground">Chưa có sản phẩm nào trong giỏ hàng.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => {
                  const currentPrice = toNum(product.price);
                  // Bỏ tính toán discount vì là dữ liệu ảo
                  
                  // Parse product name to extract dosage/strength if present
                  // Example: "MALTAGIT_2500mg_500mg" -> name: "MALTAGIT", dosage: "2500mg/500mg"
                  const parseProductName = (name: string | undefined | null) => {
                    // Handle undefined/null name
                    if (!name || typeof name !== 'string') {
                      return { name: 'Sản phẩm không có tên', dosage: null };
                    }
                    
                    // Try to extract dosage information (numbers followed by mg, g, ml, etc.)
                    const dosagePattern = /(\d+(?:\.\d+)?(?:mg|g|ml|l|mcg|iu|ui)\/?\d*(?:\.\d+)?(?:mg|g|ml|l|mcg|iu|ui)?)/gi;
                    const dosages = name.match(dosagePattern);
                    
                    if (dosages && dosages.length > 0) {
                      const cleanName = name.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
                      const baseName = cleanName.split(/\d/)[0].trim();
                      const dosage = dosages.join('/');
                      return { name: baseName || cleanName, dosage };
                    }
                    return { name: name.replace(/_/g, ' '), dosage: null };
                  };
                  
                  const { name: displayName, dosage } = parseProductName(product.name);
                  
                  return (
                    <div key={product._id || product.id} className="border rounded-xl overflow-hidden">
                      <div className="flex gap-4 p-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={getImageUrl(product.imageUrl)} 
                            alt={product.name} 
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                          {/* Tên sản phẩm */}
                          <div className="md:col-span-2">
                            <div className="font-semibold text-base mb-1">{displayName}</div>
                            {dosage && (
                              <div className="text-sm text-muted-foreground mb-1">
                                <span className="font-medium">Hàm lượng:</span> {dosage}
                              </div>
                            )}
                          </div>
                          
                          {/* Đơn vị */}
                          <div className="text-sm">
                            <div className="text-muted-foreground mb-1">Đơn vị</div>
                            <div className="font-medium">{product.unit || "cái"}</div>
                          </div>
                          
                          {/* Giá */}
                          <div className="text-sm">
                            <div className="text-muted-foreground mb-1">Giá</div>
                            <div className="font-semibold">{format(currentPrice)} đ</div>
                          </div>
                          
                          {/* Số lượng */}
                          <div className="text-sm">
                            <div className="text-muted-foreground mb-2">Số lượng</div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => updateQuantity(product._id || product.id, quantity - 1)}
                                disabled={quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-10 text-center font-medium">{quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => updateQuantity(product._id || product.id, quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Total Price and Delete */}
                        <div className="flex flex-col items-end justify-between min-w-[120px]">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">Thành tiền</div>
                            <div className="font-semibold text-lg text-red-500">{format(currentPrice * quantity)} đ</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(product._id || product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2">
                  <Button variant="destructive" onClick={clear}>Xóa tất cả</Button>
                </div>
              </div>
            )}
          </section>

          <aside className="bg-card rounded-2xl border p-8 h-max">
            <h3 className="font-semibold mb-4">Thành tiền</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền</span>
                <span className="font-semibold">{format(totals.subtotal)}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá (mã giảm giá)</span>
                  <span className="font-semibold">-{format(discountAmount)}đ</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Thành tiền</span>
                  <span className="text-red-500">{format(Math.max(0, currentFinalTotal))}đ</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <CheckoutSavings
                items={promoItems}
                subtotal={totals.subtotal}
                showCoupon={false}
                onPricingChange={({ discountAmount, finalTotal }) => {
                  setDiscountAmount(discountAmount);
                  setFinalTotal(finalTotal);
                }}
              />
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full" disabled={items.length === 0}>Mua hàng</Button>
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}


