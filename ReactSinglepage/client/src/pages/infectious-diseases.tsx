import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bug } from "lucide-react";
import { useState } from "react";

export default function InfectiousDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const infectiousDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Cúm A",
    "Sốt phát ban",
    "Nhiễm nấm Coccidioidomycosis",
    "Sốt xuất huyết",
    "Nấm sinh dục",
    "Herpes hậu môn",
    "Nhiễm Balantidium",
    "Sán lá ruột",
    "Ho gà",
    "Nhiễm Toxoplasmosis bẩm sinh",
    "Thương hàn",
    
    // Cột 2
    "Bệnh do Virus Marburg",
    "Cúm H1N1",
    "Sốt xuất huyết Dengue",
    "Herpes môi",
    "Bệnh phong",
    "Mụn cơm sinh dục",
    "Nhiễm vi khuẩn Salmonella",
    "Dịch hạch",
    "Nhiễm giun móc",
    "Sán lợn gạo",
    "Ghẻ cóc do nhiễm Treponema pertenue",
    "Bệnh rubella",
    
    // Cột 3
    "Virus Marburg",
    "Cúm A H3N2",
    "Sốt siêu vi",
    "Viêm gan B",
    "Nhiễm trùng",
    "Nhiễm khuẩn Chlamydia",
    "Nhiễm Cytomegalovirus",
    "Nhiễm ký sinh trùng",
    "Ebola",
    "Bệnh Brucella là gì?",
    "Tả",
    "Quai bị"
  ];

  // Chia danh sách thành 3 cột
  const column1 = infectiousDiseases.slice(0, 12);
  const column2 = infectiousDiseases.slice(12, 24);
  const column3 = infectiousDiseases.slice(24, 36);

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
                <BreadcrumbPage>Bệnh Truyền Nhiễm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Virus Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
              <Bug className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Truyền Nhiễm</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Bệnh truyền nhiễm có thể lây lan nhanh chóng và ảnh hưởng nghiêm trọng đến sức khỏe cộng đồng. 
            Tìm hiểu về cách phòng ngừa, triệu chứng nhận biết, và phương pháp điều trị hiệu quả các bệnh truyền nhiễm phổ biến như cúm, sốt xuất huyết, và viêm gan. 
            <a href="#" className="text-blue-600 hover:underline">Bảo vệ sức khỏe bản thân và gia đình bạn với những thông tin hữu ích tại đây.</a>
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về bệnh truyền nhiễm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Cúm Mùa</li>
                <li>• Cúm A</li>
                <li>• Sốt phát ban</li>
                <li>• Sốt xuất huyết</li>
                <li>• Viêm gan B</li>
                <li>• Ho gà</li>
                <li>• Thương hàn</li>
                <li>• Tả</li>
                <li>• Quai bị</li>
                <li>• Bệnh rubella</li>
                <li>• Ebola</li>
                <li>• Dịch hạch</li>
                <li>• Bệnh phong</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tiêm phòng đầy đủ</li>
                <li>• Rửa tay thường xuyên</li>
                <li>• Đeo khẩu trang khi cần</li>
                <li>• Tránh tiếp xúc gần với người bệnh</li>
                <li>• Vệ sinh môi trường sống</li>
                <li>• Ăn chín uống sôi</li>
                <li>• Tránh nước bẩn</li>
                <li>• Sử dụng thuốc chống muỗi</li>
                <li>• Tránh động vật hoang dã</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Tăng cường hệ miễn dịch</li>
                <li>• Tuân thủ quy định y tế</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Infectious Diseases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-red-600">Bệnh do virus</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Cúm Mùa</li>
              <li>• Cúm A</li>
              <li>• Cúm H1N1</li>
              <li>• Cúm A H3N2</li>
              <li>• Sốt xuất huyết</li>
              <li>• Sốt xuất huyết Dengue</li>
              <li>• Sốt siêu vi</li>
              <li>• Viêm gan B</li>
              <li>• Ebola</li>
              <li>• Virus Marburg</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-red-600">Bệnh do vi khuẩn</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Thương hàn</li>
              <li>• Tả</li>
              <li>• Dịch hạch</li>
              <li>• Bệnh phong</li>
              <li>• Nhiễm vi khuẩn Salmonella</li>
              <li>• Nhiễm khuẩn Chlamydia</li>
              <li>• Ho gà</li>
              <li>• Bệnh Brucella</li>
              <li>• Ghẻ cóc do nhiễm Treponema pertenue</li>
            </ul>
          </Card>
        </div>

        {/* Risk Factors */}
        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-red-800">Yếu tố nguy cơ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-red-700">Môi trường</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ô nhiễm nước</li>
                <li>• Vệ sinh kém</li>
                <li>• Động vật hoang dã</li>
                <li>• Côn trùng truyền bệnh</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">Tiếp xúc</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Người bệnh</li>
                <li>• Vật dụng chung</li>
                <li>• Thực phẩm không an toàn</li>
                <li>• Quan hệ tình dục không an toàn</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">Yếu tố khác</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hệ miễn dịch yếu</li>
                <li>• Tuổi tác</li>
                <li>• Du lịch</li>
                <li>• Nghề nghiệp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prevention Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-green-50">
            <h4 className="font-semibold mb-3 text-green-700">Vaccination</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Tiêm phòng cúm</li>
              <li>• Tiêm phòng viêm gan B</li>
              <li>• Tiêm phòng ho gà</li>
              <li>• Tiêm phòng rubella</li>
              <li>• Tiêm phòng quai bị</li>
            </ul>
          </Card>

          <Card className="p-6 bg-blue-50">
            <h4 className="font-semibold mb-3 text-blue-700">Hygiene Practices</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Rửa tay đúng cách</li>
              <li>• Vệ sinh cá nhân</li>
              <li>• Làm sạch môi trường</li>
              <li>• Xử lý chất thải</li>
              <li>• Khử trùng dụng cụ</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-red-600 hover:bg-red-700">
            Tìm hiểu thêm về phòng chống bệnh truyền nhiễm
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
