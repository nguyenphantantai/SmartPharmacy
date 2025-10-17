import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Layers } from "lucide-react";
import { useState } from "react";

export default function SkinDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const skinDiseases = [
    // Cột 1
    "Bệnh than",
    "Gàu",
    "Thuỷ đậu",
    "Nổi mẩn ngứa",
    "Chàm",
    "Rụng tóc",
    "U tế bào hắc tố",
    "Bệnh do nhiễm Leishmania",
    "Ghẻ",
    "Đồi mồi",
    "Loạn dưỡng móng",
    "Viêm da",
    "Nám da",
    "Mụn bọc",
    "Chàm đồng tiền",
    
    // Cột 2
    "Viêm da mụn mủ truyền nhiễm",
    "Mô bào Langerhans",
    "Tay chân miệng",
    "Bỏng da",
    "Hắc lào",
    "Bệnh Still ở người lớn",
    "Nấm móng",
    "Nhiễm Candida",
    "Bệnh Buerger",
    "Viêm da do ánh nắng",
    "Viêm da dị ứng",
    "Mụn đầu đen",
    "Nứt gót chân",
    "Sẹo lồi",
    "Lupus ban đỏ dạng đĩa",
    
    // Cột 3
    "Nấm da đầu",
    "Hói",
    "Ngứa da",
    "Bỏng nắng",
    "Phát ban",
    "Mộng thịt",
    "Nhiễm trùng vết thương",
    "Chân madura",
    "Ngứa là gì",
    "Sạm da",
    "Hội chứng Stevens-Johnson",
    "Mụn đầu trắng",
    "Viêm da tiết bã",
    "Chàm môi",
    "Lichen phẳng"
  ];

  // Chia danh sách thành 3 cột
  const column1 = skinDiseases.slice(0, 15);
  const column2 = skinDiseases.slice(15, 30);
  const column3 = skinDiseases.slice(30, 45);

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/benh">Bệnh</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bệnh Về Da</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Skin Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Layers className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Về Da</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Diseases List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Tổng hợp các bệnh liên quan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="space-y-3">
              {column1.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline text-[15px] leading-relaxed block"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              {column2.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline text-[15px] leading-relaxed block"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              {column3.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline text-[15px] leading-relaxed block"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về bệnh da</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Chàm</li>
                <li>• Viêm da</li>
                <li>• Mụn</li>
                <li>• Nấm da</li>
                <li>• Hắc lào</li>
                <li>• Ghẻ</li>
                <li>• Nám da</li>
                <li>• Đồi mồi</li>
                <li>• Rụng tóc</li>
                <li>• Gàu</li>
                <li>• Ngứa da</li>
                <li>• Phát ban</li>
                <li>• Bỏng nắng</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Vệ sinh da sạch sẽ</li>
                <li>• Dưỡng ẩm da</li>
                <li>• Bảo vệ khỏi ánh nắng</li>
                <li>• Tránh tiếp xúc hóa chất</li>
                <li>• Ăn uống lành mạnh</li>
                <li>• Uống đủ nước</li>
                <li>• Tránh stress</li>
                <li>• Không hút thuốc</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Khám da định kỳ</li>
                <li>• Sử dụng sản phẩm phù hợp</li>
                <li>• Tránh cào gãi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Skin Diseases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh viêm da</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Chàm</li>
              <li>• Viêm da</li>
              <li>• Viêm da dị ứng</li>
              <li>• Viêm da do ánh nắng</li>
              <li>• Viêm da tiết bã</li>
              <li>• Chàm đồng tiền</li>
              <li>• Chàm môi</li>
              <li>• Lichen phẳng</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh nhiễm trùng da</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Nấm da</li>
              <li>• Hắc lào</li>
              <li>• Nấm móng</li>
              <li>• Nấm da đầu</li>
              <li>• Ghẻ</li>
              <li>• Nhiễm Candida</li>
              <li>• Viêm da mụn mủ truyền nhiễm</li>
              <li>• Nhiễm trùng vết thương</li>
            </ul>
          </Card>
        </div>

        {/* Risk Factors */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Yếu tố nguy cơ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Môi trường</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ánh nắng mặt trời</li>
                <li>• Ô nhiễm không khí</li>
                <li>• Hóa chất</li>
                <li>• Độ ẩm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Lối sống</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hút thuốc</li>
                <li>• Stress</li>
                <li>• Chế độ ăn</li>
                <li>• Vệ sinh cá nhân</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Yếu tố khác</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tuổi tác</li>
                <li>• Di truyền</li>
                <li>• Hệ miễn dịch</li>
                <li>• Hormone</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Treatment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-green-50">
            <h4 className="font-semibold mb-3 text-green-700">Điều trị</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Thuốc bôi ngoài da</li>
              <li>• Thuốc uống</li>
              <li>• Liệu pháp ánh sáng</li>
              <li>• Phẫu thuật</li>
              <li>• Laser trị liệu</li>
            </ul>
          </Card>

          <Card className="p-6 bg-purple-50">
            <h4 className="font-semibold mb-3 text-purple-700">Chăm sóc da</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Làm sạch da</li>
              <li>• Dưỡng ẩm</li>
              <li>• Chống nắng</li>
              <li>• Tẩy tế bào chết</li>
              <li>• Mặt nạ</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
            Tìm hiểu thêm về chăm sóc da
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}