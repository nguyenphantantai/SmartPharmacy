import { useState, useEffect } from "react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import ProductSelectionPopup from "./product-selection-popup";
import CartNotification from "./cart-notification";
import { getImageUrl } from "@/lib/imageUtils";

interface GenericProductCardProps {
  product: Product & {
    promotion?: string;
    brandLabel?: string;
    discountPercentage?: string;
    onlineOnly?: boolean;
    gift?: boolean;
    dateRange?: string;
    voucher?: boolean;
    fastDelivery?: boolean;
    mondayDiscount?: string;
  };
  categoryLabel?: string;
  categoryColor?: string;
}

export default function GenericProductCard({ 
  product, 
  categoryLabel = "Đang bán chạy",
  categoryColor = "bg-red-500"
}: GenericProductCardProps) {
  const { addItem, lastAddedItem } = useCart();
  const [, setLocation] = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const format = (n: string) => new Intl.NumberFormat("vi-VN").format(parseInt(n || "0"));

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

  const handleCardClick = () => {
    const productId = product._id || product.id;
    if (productId) {
      setLocation(`/product/${productId}`);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative p-3">
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="w-full h-36 object-cover rounded-lg"
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const currentSrc = target.src;
              console.error('❌ Image failed to load:', {
                productName: product.name,
                imageUrl: product.imageUrl,
                attemptedUrl: currentSrc
              });
              // Fallback to default image if Supabase URL fails
              const defaultUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/medicine-images/default-medicine.jpg`;
              if (target.src !== defaultUrl) {
                console.log('🔄 Falling back to default image');
                target.src = defaultUrl;
              }
            }}
            onLoad={() => {
              if (import.meta.env.DEV) {
                console.log('✅ Image loaded successfully:', product.name);
              }
            }}
            loading="eager"
          />
        </div>

        <div className="px-4 pb-4">
          <div className="min-h-[3rem] text-sm font-medium mb-2 text-foreground break-words">
            {product.name || product.id || 'Sản phẩm không có tên'}
          </div>
          <div className="text-primary font-extrabold text-lg mb-2">
            {format(product.price || "0")} ₫/{product.unit || "cái"}
          </div>
          <div className="flex items-center gap-2 mb-3">
            {product.brandLabel ? (
              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">{product.brandLabel}</span>
            ) : (
              <span className={`text-xs ${categoryColor} text-white px-3 py-1 rounded-full`}>{categoryLabel}</span>
            )}
          </div>
          
          {/* Action Button */}
          <div className="space-y-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                console.log('📦 Opening product selection popup:', product.name);
                setIsPopupOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-semibold rounded-lg"
            >
              Chọn sản phẩm
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
