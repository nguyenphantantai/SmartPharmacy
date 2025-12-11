import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/imageUtils";
import { API_BASE } from "@/lib/utils";
import { Minus, Plus, Star, Check, Truck, Shield, Package } from "lucide-react";
import ProductSelectionPopup from "@/components/product-selection-popup";
import CartNotification from "@/components/cart-notification";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  imageUrl: string;
  brand?: string;
  manufacturer?: string;
  productCode?: string;
  unit: string;
  inStock: boolean;
  stockQuantity: number;
  isHot: boolean;
  isNewProduct: boolean;
  isPrescription: boolean;
  categoryId?: string;
  categoryName?: string;
  activeIngredient?: string;
  indications?: string;
  dosageForm?: string;
  packaging?: string;
  registrationNumber?: string;
}

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { addItem, lastAddedItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProduct(data.data);
            // Set first image as selected
            setSelectedImage(0);
          }
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy sản phẩm",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sản phẩm",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  useEffect(() => {
    if (lastAddedItem && lastAddedItem.product.id === product?.id) {
      setShowNotification(true);
    }
  }, [lastAddedItem, product]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN").format(parseInt(price || "0"));
  };

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQuantity = quantity + delta;
    // Don't allow quantity to exceed stock
    if (product.stockQuantity !== undefined && newQuantity > product.stockQuantity) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Check stock availability
    if (product.stockQuantity !== undefined && product.stockQuantity === 0) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    
    setIsPopupOpen(true);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check stock availability
    if (product.stockQuantity !== undefined && product.stockQuantity === 0) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    
    addItem(product, quantity, true);
  };

  // Create array of images (main image + potentially more)
  const productImages = product?.imageUrl ? [product.imageUrl] : [];

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="mx-auto max-w-screen-2xl px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="mx-auto max-w-screen-2xl px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border">
              <img
                src={getImageUrl(productImages[selectedImage] || product.imageUrl)}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/medicines/default.jpg";
                }}
              />
            </div>
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-blue-600 text-center">
              Sản phẩm 100% chính hãng, mẫu mã có thể thay đổi theo lô hàng
            </p>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">
                  {product.productCode || product.id} - Thương hiệu: {product.manufacturer || product.brand || "Không xác định"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-600 text-white">SẢN PHẨM CHÍNH HÃNG</Badge>
                <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  5⭐
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(product.price)} ₫/{product.unit}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được thể hiện khi đặt hàng.
              </p>
              {/* Stock Quantity */}
              <div className="mb-4">
                {product.stockQuantity !== undefined && (
                  <div className="flex items-center gap-2">
                    {product.stockQuantity === 0 ? (
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        <Package className="h-3 w-3 mr-1" />
                        Hết hàng
                      </Badge>
                    ) : product.stockQuantity <= 10 ? (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                        <Package className="h-3 w-3 mr-1" />
                        Còn {product.stockQuantity} {product.unit}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <Package className="h-3 w-3 mr-1" />
                        Còn {product.stockQuantity} {product.unit}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Classification */}
            <div>
              <label className="text-sm font-medium mb-2 block">Phân loại sản phẩm</label>
              <div className="flex gap-2">
                {(() => {
                  const unitLower = product.unit?.toLowerCase() || '';
                  let displayText = product.unit || 'Hộp';
                  
                  // Map unit to display text
                  if (unitLower.includes('gói') || unitLower.includes('goi')) {
                    displayText = 'Gói';
                  } else if (unitLower.includes('chai')) {
                    displayText = 'Chai';
                  } else if (unitLower.includes('viên') || unitLower.includes('vien')) {
                    displayText = 'Viên';
                  } else if (unitLower.includes('hộp') || unitLower.includes('hop')) {
                    displayText = 'Hộp';
                  }
                  
                  return (
                    <Button variant="default" size="sm" disabled>
                      {displayText}
                    </Button>
                  );
                })()}
              </div>
            </div>

            {/* Quantity and Purchase */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Số lượng</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Mua ngay
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  Thêm vào giỏ
                </Button>
              </div>

              {/* Service Icons */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex flex-col items-center gap-2 text-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Package className="h-6 w-6 text-primary" />
                  <span className="text-xs">Đủ thuốc chuẩn</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-xs">Giao hàng siêu tốc</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-xs">Miễn phí vận chuyển</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Thông tin chi tiết</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Danh mục:</span>
              <p className="mt-1">{product.categoryName || "Thuốc tiêu hóa"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nhà sản xuất:</span>
              <p className="mt-1">{product.manufacturer || product.brand || "Không xác định"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Hoạt chất:</span>
              <p className="mt-1">{product.activeIngredient || product.description || "Không có thông tin"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Công dụng:</span>
              <p className="mt-1">{product.indications || product.description || "Không có thông tin"}</p>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm font-medium text-muted-foreground">Lưu ý:</span>
            <p className="mt-1 text-sm text-muted-foreground">
              Mọi thông tin trên đây chỉ mang tính chất tham khảo. Vui lòng đọc kĩ thông tin chi tiết ở tờ hướng dẫn sử dụng của sản phẩm.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Popup and Notification */}
      <ProductSelectionPopup
        product={product}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />

      <CartNotification
        isVisible={showNotification}
        productName={product.name}
        quantity={lastAddedItem?.quantity || quantity}
        unit={product.unit}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

