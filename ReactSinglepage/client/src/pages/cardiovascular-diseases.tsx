import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import { useState } from "react";

export default function CardiovascularDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const cardiovascularDiseases = [
    // Cột 1
    "Rối loạn nhịp tim",
    "Giảm tiểu cầu miễn dịch",
    "Cơ tim phì đại",
    "Giãn cơ tim",
    "Hồi hộp, đánh trống ngực",
    "Tứ chứng Fallot",
    "Cơ tim xốp",
    "Ngất",
    "Giãn tĩnh mạch chi dưới",
    "Huyết khối tĩnh mạch sâu chi dưới",
    "Bệnh mạch máu ngoại vi",
    "Hội chứng lối thoát lồng ngực",
    "Thân chung động mạch là gì?",
    "Tim bẩm sinh",
    
    // Cột 2
    "Sốt thấp khớp",
    "Bệnh van tim",
    "Bệnh cơ tim",
    "Nhồi máu cơ tim",
    "Giãn tĩnh mạch thực quản",
    "Tái cực sớm",
    "Ép tim",
    "Cơn thiếu máu não cục bộ thoáng qua",
    "Huyết khối tĩnh mạch sâu",
    "Hẹp động mạch chi dưới",
    "Sốc",
    "Ngoại tâm thu thất",
    "Bệnh Kawasaki ở trẻ em",
    "Xơ vữa động mạch",
    
    // Cột 3
    "Thiếu máu tan máu",
    "Tim to",
    "Cơ tim hạn chế",
    "Bệnh tim mạch",
    "Tức ngực",
    "Bướu tim",
    "Nhịp nhanh nhĩ",
    "Block nhĩ thất",
    "Giãn tĩnh mạch",
    "Phình động mạch tạng",
    "Còn ống động mạch",
    "Nhồi máu cơ tim không ST",
    "Tăng huyết áp",
    "Bệnh Pompe"
  ];

  // Chia danh sách thành 3 cột
  const column1 = cardiovascularDiseases.slice(0, 14);
  const column2 = cardiovascularDiseases.slice(14, 28);
  const column3 = cardiovascularDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Tim Mạch</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Heart Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Tim Mạch</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Tim mạch là hệ thống quan trọng giúp duy trì sự sống và hoạt động bình thường của cơ thể. 
            Làm sao để giữ trái tim khỏe mạnh, những bệnh lý tim mạch thường gặp và cách phòng ngừa hiệu quả là gì? 
            <a href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm về các biện pháp chăm sóc và bảo vệ sức khỏe tim mạch của bạn tại đây.</a>
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe tim mạch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tăng huyết áp</li>
                <li>• Suy tim</li>
                <li>• Nhồi máu cơ tim</li>
                <li>• Rối loạn nhịp tim</li>
                <li>• Viêm cơ tim</li>
                <li>• Bệnh van tim</li>
                <li>• Xơ vữa động mạch</li>
                <li>• Đột quỵ</li>
                <li>• Thiếu máu cơ tim</li>
                <li>• Hẹp động mạch vành</li>
                <li>• Bệnh cơ tim</li>
                <li>• Giãn tĩnh mạch</li>
                <li>• Huyết khối tĩnh mạch sâu</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tập thể dục thường xuyên</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Không hút thuốc</li>
                <li>• Hạn chế rượu bia</li>
                <li>• Kiểm soát cân nặng</li>
                <li>• Quản lý stress</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Kiểm tra huyết áp</li>
                <li>• Kiểm tra cholesterol</li>
                <li>• Ngủ đủ giấc</li>
                <li>• Tránh thức ăn nhiều muối</li>
                <li>• Kiểm soát đường huyết</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Cardiovascular Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-red-600">Bệnh tim</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Bệnh động mạch vành</li>
              <li>• Suy tim</li>
              <li>• Rối loạn nhịp tim</li>
              <li>• Bệnh van tim</li>
              <li>• Bệnh cơ tim</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-red-600">Bệnh mạch máu</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Xơ vữa động mạch</li>
              <li>• Tăng huyết áp</li>
              <li>• Đột quỵ</li>
              <li>• Bệnh động mạch ngoại vi</li>
              <li>• Giãn tĩnh mạch</li>
            </ul>
          </Card>
        </div>

        {/* Risk Factors */}
        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-red-800">Yếu tố nguy cơ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-red-700">Không thể thay đổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tuổi tác</li>
                <li>• Giới tính</li>
                <li>• Tiền sử gia đình</li>
                <li>• Chủng tộc</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">Có thể thay đổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hút thuốc</li>
                <li>• Tăng huyết áp</li>
                <li>• Cholesterol cao</li>
                <li>• Tiểu đường</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">Lối sống</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ít vận động</li>
                <li>• Béo phì</li>
                <li>• Stress</li>
                <li>• Chế độ ăn không lành mạnh</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-red-600 hover:bg-red-700">
            Tìm hiểu thêm về chăm sóc sức khỏe tim mạch
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
