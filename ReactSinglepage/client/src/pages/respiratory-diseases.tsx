import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Activity } from "lucide-react";
import { useState } from "react";

export default function RespiratoryDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const respiratoryDiseases = [
    // Cột 1
    "Cúm RSV",
    "U phổi",
    "Bụi phổi silic",
    "Beryllium",
    "Khí phế thũng",
    "Xuất huyết phế nang vô căn",
    "Viêm phổi do Mycoplasma pneumoniae",
    "Áp-xe phổi",
    "Bụi phổi atbet (amiăng)",
    "Phổi kẽ",
    "Suy hô hấp cấp",
    "Viêm đường hô hấp trên",
    "Suy hô hấp",
    "Viêm màng phổi",
    
    // Cột 2
    "Bệnh Covid-19",
    "Giãn phế quản",
    "Bụi phổi",
    "MERS",
    "Chấn thương khí quản",
    "Ngưng thở khi ngủ do tắc nghẽn",
    "Viêm phổi do nấm",
    "Phổi kẽ",
    "Xơ phổi vô căn",
    "Viêm phổi kẽ lympho bào",
    "Tràn dịch màng phổi",
    "Bỏng hô hấp",
    "Ho",
    "Viêm phế quản mạn tính",
    
    // Cột 3
    "Bệnh phổi tắc nghẽn mạn tính",
    "Chứng tạo đờm do virus",
    "Xuất huyết phế nang lan tỏa",
    "Viêm phổi do Metapneumovirus",
    "Tăng áp phổi",
    "Viêm phổi do Pneumocystis jirovecii",
    "Viêm phổi do tụ cầu",
    "Viêm phổi tăng bạch cầu ái toan",
    "Bụi phổi bông",
    "Suy hô hấp mạn",
    "Tắc động mạch phổi",
    "Tràn khí màng phổi",
    "Xẹp phổi là gì? Những điều cần biết về xẹp phổi",
    "Xơ phổi là gì? Những điều cần biết về xơ phổi"
  ];

  // Chia danh sách thành 3 cột
  const column1 = respiratoryDiseases.slice(0, 14);
  const column2 = respiratoryDiseases.slice(14, 28);
  const column3 = respiratoryDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Hô Hấp</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Lungs Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Hô Hấp</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Hệ hô hấp đóng vai trò quan trọng trong việc cung cấp oxy cho cơ thể và loại bỏ CO2. 
            Làm sao để duy trì sức khỏe hô hấp tốt, những bệnh lý hô hấp thường gặp và cách phòng ngừa hiệu quả là gì? 
            <a href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm về các biện pháp chăm sóc và bảo vệ sức khỏe hô hấp của bạn tại đây.</a>
          </p>
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe hô hấp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Cúm RSV</li>
                <li>• U phổi</li>
                <li>• Bụi phổi silic</li>
                <li>• Khí phế thũng</li>
                <li>• Viêm phổi</li>
                <li>• Áp-xe phổi</li>
                <li>• Bụi phổi atbet</li>
                <li>• Phổi kẽ</li>
                <li>• Suy hô hấp</li>
                <li>• Viêm màng phổi</li>
                <li>• Bệnh Covid-19</li>
                <li>• Giãn phế quản</li>
                <li>• MERS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Không hút thuốc</li>
                <li>• Tránh khói thuốc thụ động</li>
                <li>• Đeo khẩu trang khi cần</li>
                <li>• Rửa tay thường xuyên</li>
                <li>• Tiêm phòng cúm</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Tránh ô nhiễm không khí</li>
                <li>• Sử dụng máy lọc không khí</li>
                <li>• Tránh tiếp xúc với hóa chất</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Duy trì cân nặng hợp lý</li>
                <li>• Tránh stress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Respiratory Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh phổi</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Viêm phổi</li>
              <li>• Áp-xe phổi</li>
              <li>• U phổi</li>
              <li>• Xơ phổi</li>
              <li>• Phổi kẽ</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh đường hô hấp</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Viêm phế quản</li>
              <li>• Hen suyễn</li>
              <li>• COPD</li>
              <li>• Giãn phế quản</li>
              <li>• Viêm đường hô hấp trên</li>
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
                <li>• Ô nhiễm không khí</li>
                <li>• Khói thuốc lá</li>
                <li>• Bụi công nghiệp</li>
                <li>• Hóa chất độc hại</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Lối sống</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hút thuốc</li>
                <li>• Ít vận động</li>
                <li>• Stress</li>
                <li>• Chế độ ăn không lành mạnh</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Yếu tố khác</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tuổi tác</li>
                <li>• Tiền sử gia đình</li>
                <li>• Nhiễm trùng</li>
                <li>• Bệnh nền</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
            Tìm hiểu thêm về chăm sóc sức khỏe hô hấp
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
