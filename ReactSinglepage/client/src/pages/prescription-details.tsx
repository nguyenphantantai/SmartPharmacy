import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Copy,
  Eye,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function PrescriptionDetails() {
  const [, setLocation] = useLocation();
  const [prescriptionData] = useState({
    id: "PS-MC8KWJ89",
    status: "Đã tư vấn",
    createdAt: "17:37 01/10/2025",
    rejectionReason: "KNM",
    imageUrl: "/images/prescription-sample.jpg" // Sử dụng hình ảnh mẫu
  });

  const handleBack = () => {
    setLocation("/account/don-thuoc-cua-toi");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(prescriptionData.id);
    // TODO: Show toast notification
  };

  const handleViewSuggestions = () => {
    // TODO: Implement view suggestions functionality
    console.log("Viewing suggestions for rejection reason:", prescriptionData.rejectionReason);
  };

  const handleRecreatePrescription = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn thuốc</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Prescription Information */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                    <span className="text-sm font-mono text-gray-900">#{prescriptionData.id}</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {prescriptionData.status}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">Thời gian tạo đơn:</span>
                  <span className="text-sm text-gray-900">{prescriptionData.createdAt}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">Lý do từ chối:</span>
                  <span className="text-sm text-gray-900">{prescriptionData.rejectionReason}</span>
                  <button
                    onClick={handleViewSuggestions}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Xem gợi ý</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mb-6"></div>

              {/* Prescription Image */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình đơn thuốc</h3>
                <div className="relative inline-block">
                  <img
                    src={prescriptionData.imageUrl}
                    alt="Hình đơn thuốc"
                    className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                    onError={(e) => {
                      // Fallback nếu hình ảnh không tải được
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <div class="text-center text-gray-500">
                              <div class="text-4xl mb-2">📄</div>
                              <p class="text-sm">Hình đơn thuốc</p>
                              <p class="text-xs text-gray-400">Không có hình ảnh</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Button
                  onClick={handleRecreatePrescription}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tạo lại đơn thuốc</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
