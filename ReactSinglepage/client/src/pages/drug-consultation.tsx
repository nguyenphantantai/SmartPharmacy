import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  History,
  ShoppingCart,
  User
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function DrugConsultation() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const popularSearches = [
    "sữa dinh dưỡng", "probiotics", "khẩu trang", "kem chống nắng", 
    "collagen", "giải nhiệt", "hạ sốt", "Mua 1 Tặng 1"
  ];

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleOrderPrescription = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  const handleSavePrescription = () => {
    setLocation("/luu-don-thuoc");
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tư vấn thuốc</h1>
          <Button variant="link" className="text-blue-600 hover:text-blue-800">
            <History className="w-4 h-4 mr-2" />
            Lịch sử tư vấn thuốc
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Add Products for Consultation */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  Thêm sản phẩm cần tư vấn
                </h2>
                <p className="text-blue-800 mb-6">
                  Gửi thông tin sản phẩm và thuốc, dược sĩ sẽ gọi điện thoại tư vấn và giao hàng tận nơi.
                </p>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm sản phẩm bạn cần ở đây"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Popular Searches */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Tìm kiếm phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Order Options */}
          <div className="space-y-6">
            {/* Prescription Drugs */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white rounded-full p-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Thuốc kê đơn
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Đặt thuốc kê đơn từ bác sĩ
                    </p>
                    <Button 
                      onClick={handleOrderPrescription}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Đặt ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Hướng dẫn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Bước 1
              </h3>
              <p className="text-gray-600 mb-4">
                Bấm vào khung tìm kiếm và nhập tên hoặc thông tin sản phẩm bạn cần.
              </p>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tìm sản phẩm bạn cần ở đây"
                      className="pl-10 pr-4 py-2"
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Bước 2
              </h3>
              <p className="text-gray-600 mb-4">
                Chọn sản phẩm bạn muốn được tư vấn từ kết quả tìm kiếm như hình và bấm xác nhận.
              </p>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-semibold">ABBOTT</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Sữa bột dinh dưỡng ABBOTT PROSURE bổ sung dinh dưỡng đặc biệt cho người sụt cân, suy kiệt (800g)
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                    Xác nhận
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Bước 3
              </h3>
              <p className="text-gray-600 mb-4">
                Xem lại các sản phẩm bạn đã chọn và bấm nút Yêu Cầu Tư Vấn.
              </p>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-semibold">Ensure</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Sữa Abbott Ensure hương hạnh nhân (500g)
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                    Yêu cầu tư vấn
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
