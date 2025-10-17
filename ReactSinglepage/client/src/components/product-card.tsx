import { useState, useEffect } from "react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import ProductSelectionPopup from "./product-selection-popup";
import CartNotification from "./cart-notification";
import { getImageUrl } from "@/lib/imageUtils";
import { Package, Calendar, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "hot-deal";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem, lastAddedItem } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return new Intl.NumberFormat("vi-VN").format(numPrice);
  };

  const discount = product.discountPercentage ?? 0;

  // Stock and expiration info
  const getStockInfo = () => {
    const stockQuantity = product.stockQuantity || 0;
    if (stockQuantity === 0) {
      return { text: "Hết hàng", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    } else if (stockQuantity <= 10) {
      return { text: `Còn ${stockQuantity}`, color: "bg-orange-100 text-orange-800", icon: AlertTriangle };
    } else {
      return { text: `Còn ${stockQuantity}`, color: "bg-green-100 text-green-800", icon: Package };
    }
  };

  const getExpirationInfo = () => {
    if (!product.expirationDate) return null;
    
    const expirationDate = new Date(product.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      return { text: "Hết hạn", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    } else if (daysUntilExpiration <= 30) {
      return { text: `Hết hạn ${daysUntilExpiration} ngày`, color: "bg-orange-100 text-orange-800", icon: Calendar };
    } else if (daysUntilExpiration <= 90) {
      return { text: `Hết hạn ${daysUntilExpiration} ngày`, color: "bg-yellow-100 text-yellow-800", icon: Calendar };
    } else {
      return { text: `Hết hạn ${daysUntilExpiration} ngày`, color: "bg-blue-100 text-blue-800", icon: Calendar };
    }
  };

  const stockInfo = getStockInfo();
  const expirationInfo = getExpirationInfo();

  const getBadgeContent = () => {
    if (product.isNew) return { text: "MỚI", color: "bg-secondary text-secondary-foreground" };
    if (product.isHot) return { text: "HOT", color: "bg-accent text-accent-foreground" };
    if (discount > 0) {
      return { text: `-${discount}%`, color: "bg-red-500 text-white" };
    }
    return null;
  };

  const badge = getBadgeContent();

  // Show notification when item is added to cart
  const handleShowNotification = () => {
    if (lastAddedItem && lastAddedItem.product.id === product.id) {
      setShowNotification(true);
    }
  };

  // Listen for cart changes to show notification
  useEffect(() => {
    handleShowNotification();
  }, [lastAddedItem]);

  if (variant === "hot-deal") {
    return (
      <div className="product-card bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 relative text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        {badge && (
          <div className="badge">
            <Badge className="bg-yellow-400 text-red-600 font-bold shadow-lg">HOT</Badge>
          </div>
        )}
        <div className="relative z-10">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="text-xs mb-1 text-shadow">Giảm {discount}%</div>
          )}
          <div className="bg-yellow-300 text-red-600 text-center font-bold text-lg rounded-full py-1 mb-2 floating-animation shadow-lg">
            {discount}%
          </div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-shadow" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          
          {/* Stock and Expiration Info */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1">
              <stockInfo.icon className="h-3 w-3 text-white" />
              <span className={`text-xs px-2 py-1 rounded-full ${stockInfo.color} bg-white/20 backdrop-blur-sm`}>
                {stockInfo.text}
              </span>
            </div>
            {expirationInfo && (
              <div className="flex items-center gap-1">
                <expirationInfo.icon className="h-3 w-3 text-white" />
                <span className={`text-xs px-2 py-1 rounded-full ${expirationInfo.color} bg-white/20 backdrop-blur-sm`}>
                  {expirationInfo.text}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-lg font-bold mb-3 text-shadow" data-testid={`text-product-price-${product.id}`}>
            {formatPrice(product.price)} đ/{product.unit}
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              data-testid={`button-buy-now-hot-${product.id}`}
              onClick={() => setIsPopupOpen(true)}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Mua ngay
            </Button>
            <Button
              data-testid={`button-add-to-cart-hot-${product.id}`}
              onClick={() => {
                console.log('🛒 Adding directly to cart:', product.name);
                addItem(product, 1, true); // Add 1 item with notification
              }}
              className="w-full bg-white text-red-500 hover:bg-gray-100 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
        
        {/* Popup and Notification */}
        <ProductSelectionPopup
          product={product}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
        
        <CartNotification
          isVisible={showNotification}
          productName={product.name}
          quantity={lastAddedItem?.quantity || 1}
          unit={product.unit || "cái"}
          onClose={() => setShowNotification(false)}
        />
      </div>
    );
  }

  return (
    <div className="product-card bg-card rounded-xl p-4 relative shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      {badge && (
        <div className="badge">
          <Badge className={`${badge.color} shadow-lg`}>{badge.text}</Badge>
        </div>
      )}
      <div className="relative z-10">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/medicines/default.jpg";
          }}
        />
        <h3 className="font-semibold text-sm mb-2 line-clamp-2" data-testid={`text-product-name-${product._id || product.id}`}>
          {product.name}
        </h3>
        
        {/* Stock and Expiration Info */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-1">
            <stockInfo.icon className="h-3 w-3" />
            <span className={`text-xs px-2 py-1 rounded-full ${stockInfo.color}`}>
              {stockInfo.text}
            </span>
          </div>
          {expirationInfo && (
            <div className="flex items-center gap-1">
              <expirationInfo.icon className="h-3 w-3" />
              <span className={`text-xs px-2 py-1 rounded-full ${expirationInfo.color}`}>
                {expirationInfo.text}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary font-bold" data-testid={`text-product-price-${product._id || product.id}`}>
            {formatPrice(product.price)} đ/{product.unit}
          </span>
        </div>
        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            data-testid={`button-buy-now-${product._id || product.id}`}
            onClick={() => setIsPopupOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-semibold rounded-lg"
          >
            Mua ngay
          </Button>
          <Button
            data-testid={`button-add-to-cart-${product._id || product.id}`}
            onClick={() => {
              console.log('🛒 Adding directly to cart:', product.name);
              addItem(product, 1, true); // Add 1 item with notification
            }}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-2 text-sm font-semibold rounded-lg"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
      
      {/* Popup and Notification */}
      <ProductSelectionPopup
        product={product}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
      
      <CartNotification
        isVisible={showNotification}
        productName={product.name}
        quantity={lastAddedItem?.quantity || 1}
        unit={product.unit || "cái"}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}
