import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Plus, Package } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { getImageUrl } from "@/lib/imageUtils";
import type { Product } from "@shared/schema";

interface ProductSelectionPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductSelectionPopup({ 
  product, 
  isOpen, 
  onClose 
}: ProductSelectionPopupProps) {
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset quantity when popup closes
      setQuantity(1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  console.log('🔍 ProductSelectionPopup rendered:', { 
    isOpen, 
    productName: product.name, 
    quantity,
    mounted,
    timestamp: new Date().toISOString()
  });

  if (!isOpen || !mounted) {
    console.log('❌ Popup not open or not mounted, returning null');
    return null;
  }

  console.log('✅ Popup is open, rendering full popup with buttons');

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN").format(parseInt(price));
  };

  const currentPrice = parseInt(product.price);
  // Bỏ tính toán discount vì là dữ liệu ảo

  const handleAddToCart = () => {
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
    
    console.log('🛒 Adding to cart:', { product: product.name, quantity });
    addItem(product, quantity, true); // Show notification
    onClose();
  };

  const handleBuyNow = () => {
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
    
    console.log('⚡ Buying now:', { product: product.name, quantity });
    // Clear cart and add only this product
    addItem(product, quantity, false); // Don't show notification for buy now
    setLocation("/checkout");
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }
    
    // Check stock availability
    if (product.stockQuantity !== undefined && newQuantity > product.stockQuantity) {
      toast({
        title: "Thông báo",
        description: "Sản phẩm này đã hết hàng, đang bổ sung thêm hàng",
        variant: "destructive",
      });
      return;
    }
    
    setQuantity(newQuantity);
  };

  const popupContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        animation: 'none',
        transform: 'none'
      }}
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full flex flex-col shadow-2xl relative"
        style={{
          position: 'relative',
          zIndex: 100000,
          maxHeight: '90vh',
          minHeight: '500px',
          animation: 'none',
          transform: 'none'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Chọn sản phẩm</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Free shipping banner */}
        <div className="bg-blue-50 text-blue-800 text-sm font-medium p-3 text-center flex-shrink-0">
          Miễn phí vận chuyển cho mọi đơn hàng 0đ
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Product Image */}
          <div className="relative p-4">
            <div className="relative">
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="px-4 pb-4">
            <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-gray-900">
              {product.name}
            </h3>

            {/* Pricing */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-red-500">
                  {formatPrice(product.price)} ₫/{product.unit}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Tích lũy từ {Math.round(currentPrice / 100)} P-Xu vàng
              </div>
              {/* Stock Quantity */}
              {product.stockQuantity !== undefined && (
                <div className="mt-2">
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

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-900">Số lượng</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 max-w-[60px]">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-full text-center text-lg font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                  className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Always visible at bottom */}
        <div 
          className="p-4 border-t border-gray-100 flex-shrink-0 bg-white rounded-b-2xl" 
          style={{ 
            minHeight: '140px',
            position: 'sticky',
            bottom: 0,
            zIndex: 100001
          }}
        >
          <div className="space-y-3">
            <Button
              onClick={handleBuyNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-lg shadow-lg"
              style={{ minHeight: '48px' }}
            >
              Mua ngay
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-base font-semibold rounded-lg"
              style={{ minHeight: '48px' }}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside the DOM tree
  return createPortal(popupContent, document.body);
}
