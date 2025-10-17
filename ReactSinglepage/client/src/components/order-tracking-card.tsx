import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Search, Package, Truck, CheckCircle } from "lucide-react";

export default function OrderTrackingCard() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      window.location.href = `/track-order?order=${encodeURIComponent(trackingNumber.trim())}`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Package className="h-5 w-5" />
          Theo dõi đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-blue-700">
            Nhập mã đơn hàng để xem trạng thái giao hàng và lịch sử vận chuyển
          </p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã đơn hàng..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={!trackingNumber.trim()}
              className="px-4"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-blue-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Xác nhận</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>Chuẩn bị</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>Giao hàng</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/track-order">
              <Button variant="outline" size="sm" className="w-full text-blue-700 border-blue-300 hover:bg-blue-50">
                Xem tất cả đơn hàng
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
