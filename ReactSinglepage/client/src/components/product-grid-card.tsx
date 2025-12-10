import { useState, useEffect } from "react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import ProductSelectionPopup from "./product-selection-popup";
import CartNotification from "./cart-notification";
import { getImageUrl } from "@/lib/imageUtils";
import { Package, Calendar, AlertTriangle } from "lucide-react";

interface ProductGridCardProps {
  product: Product;
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  const { addItem, lastAddedItem } = useCart();
  const [, setLocation] = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const format = (n: string) => new Intl.NumberFormat("vi-VN").format(parseInt(n || "0"));

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

  // Show notification when item is added to cart
  const handleShowNotification = () => {
    if (lastAddedItem && (lastAddedItem.product._id || lastAddedItem.product.id) === (product._id || product.id)) {
      setShowNotification(true);
    }
  };

  // Listen for cart changes to show notification
  useEffect(() => {
    handleShowNotification();
  }, [lastAddedItem]);

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <div className="relative p-3">
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="w-full h-36 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/medicines/default.jpg";
            }}
          />
        </div>

        <div className="px-4 pb-4">
          <div className="min-h-[3rem] text-sm font-medium mb-2 text-foreground break-words">{product.name}</div>
          
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
          
          <div className="text-primary font-extrabold text-lg mb-2">{format(product.price)} đ/{product.unit}</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full">Đang bán chạy</span>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={() => setIsPopupOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-semibold rounded-lg"
            >
              Mua ngay
            </Button>
            <Button 
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
    </>
  );
}
