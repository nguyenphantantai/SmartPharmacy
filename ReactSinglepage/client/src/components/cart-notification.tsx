import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface CartNotificationProps {
  isVisible: boolean;
  productName: string;
  quantity: number;
  unit: string;
  onClose: () => void;
}

export default function CartNotification({
  isVisible,
  productName,
  quantity,
  unit,
  onClose
}: CartNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div
        className={`bg-gray-800 text-white rounded-lg px-6 py-4 shadow-lg transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">Sản phẩm đã được thêm vào Giỏ hàng.</p>
            <p className="text-sm text-gray-300">
              {productName} ({quantity} {unit})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
