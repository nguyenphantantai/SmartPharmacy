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

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const toNum = (s: string) => parseInt(s || "0");
  const promoItems = items.map(({ product, quantity }) => ({
    productId: String(product._id || product.id),
    quantity,
    price: toNum(product.price),
    categoryId: product.categoryId ? String(product.categoryId) : (product.category ? String(product.category) : undefined)
  }));
  
  // Calculate totals with discount
  const totals = items.reduce((acc, item) => {
    const originalPrice = toNum(item.product.originalPrice || "0");
    const currentPrice = toNum(item.product.price);
    const hasDiscount = originalPrice > currentPrice && originalPrice > 0;
    
    const itemSubtotal = currentPrice * item.quantity;
    const itemOriginalTotal = hasDiscount ? originalPrice * item.quantity : itemSubtotal;
    const itemSavings = itemOriginalTotal - itemSubtotal;
    
    return {
      subtotal: acc.subtotal + itemSubtotal,
      originalTotal: acc.originalTotal + itemOriginalTotal,
      totalSavings: acc.totalSavings + itemSavings
    };
  }, { subtotal: 0, originalTotal: 0, totalSavings: 0 });

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
                  const originalPrice = toNum(product.originalPrice || "0");
                  const currentPrice = toNum(product.price);
                  const hasDiscount = originalPrice > currentPrice && originalPrice > 0;
                  const discountAmount = originalPrice - currentPrice;
                  const discountPercent = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;
                  
                  return (
                    <div key={product._id || product.id} className="flex items-center gap-4 p-4 border rounded-xl">
                      <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {hasDiscount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 font-semibold">{format(currentPrice)} đ</span>
                              <span className="text-gray-400 line-through">{format(originalPrice)} đ</span>
                              <span className="text-xs bg-red-100 text-red-600 px-1 rounded">-{discountPercent}%</span>
                            </div>
                          ) : (
                            <span>{format(currentPrice)} đ</span>
                          )}
                          <span className="text-gray-400">/{product.unit}</span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
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
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(product._id || product.id, quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="w-32 text-right">
                        <div className="font-semibold text-red-500">{format(currentPrice * quantity)} đ</div>
                        {hasDiscount && (
                          <div className="text-xs text-gray-400 line-through">{format(originalPrice * quantity)} đ</div>
                        )}
                      </div>
                      <Button variant="ghost" onClick={() => removeItem(product._id || product.id)}>Xóa</Button>
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
              {totals.totalSavings > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tổng giá gốc</span>
                  <span className="line-through">{format(totals.originalTotal)}đ</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền</span>
                <span className="font-semibold text-red-500">{format(totals.subtotal)}đ</span>
              </div>
              {totals.totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tiết kiệm</span>
                  <span className="font-semibold">-{format(totals.totalSavings)}đ</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <CheckoutSavings
                items={promoItems}
                subtotal={totals.subtotal}
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


