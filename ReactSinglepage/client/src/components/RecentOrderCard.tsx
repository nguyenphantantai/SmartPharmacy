import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, MapPin, Phone, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Medicine {
  _id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  category?: string;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  medicines: Medicine[];
}

interface RecentOrderCardProps {
  order: RecentOrder;
  onReorder?: () => void;
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Đang giao", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" }
};

const paymentMethodConfig = {
  cash: "Tiền mặt",
  card: "Thẻ tín dụng",
  bank_transfer: "Chuyển khoản"
};

export const RecentOrderCard: React.FC<RecentOrderCardProps> = ({ order, onReorder }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Đơn thuốc gần nhất
          </CardTitle>
          <Badge className={statusConfig[order.status].color}>
            {statusConfig[order.status].label}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Mã đơn hàng: <span className="font-mono font-semibold">{order.orderNumber}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Ngày đặt: {formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span>Thanh toán: {paymentMethodConfig[order.paymentMethod]}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="truncate">{order.shippingAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{order.shippingPhone}</span>
          </div>
        </div>

        {/* Medicines List */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Danh sách thuốc ({order.medicines.length} loại)
          </h4>
          <div className="space-y-3">
            {order.medicines.map((medicine) => (
              <div key={medicine._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={medicine.imageUrl || '/placeholder-medicine.jpg'} 
                  alt={medicine.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{medicine.name}</h5>
                  {medicine.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {medicine.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>Số lượng: {medicine.quantity} {medicine.unit}</span>
                    <span>•</span>
                    <span>Giá: {formatPrice(medicine.price)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {formatPrice(medicine.price * medicine.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm">
            <span>Tổng tiền:</span>
            <span className="font-semibold text-lg">{formatPrice(order.totalAmount)}</span>
          </div>
          {order.discountAmount && order.discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>Giảm giá:</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          {order.couponCode && (
            <div className="text-xs text-gray-500 mt-1">
              Mã giảm giá: {order.couponCode}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.location.href = `/track-order?order=${order.orderNumber}`}
          >
            Xem chi tiết
          </Button>
          {onReorder && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={onReorder}
            >
              Đặt lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
