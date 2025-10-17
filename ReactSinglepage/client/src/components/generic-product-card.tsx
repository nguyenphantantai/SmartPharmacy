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

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md border">
        <div className="relative p-3">
          <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-36 object-cover rounded-lg" />
        </div>

        <div className="px-4 pb-4">
          <div className="h-12 text-sm font-medium line-clamp-2 mb-2 text-foreground">{product.name}</div>
          <div className="text-primary font-extrabold text-lg mb-2">{format(product.price)} ₫/{product.unit}</div>
          <div className="flex items-center gap-2 mb-3">
            {product.brandLabel ? (
              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">{product.brandLabel}</span>
            ) : (
              <span className={`text-xs ${categoryColor} text-white px-3 py-1 rounded-full`}>{categoryLabel}</span>
            )}
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
