import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function MenDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const menDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Nhũn não",
    "Phình động mạch gan",
    "Viêm hậu môn",
    "Tai biến mạch máu não (Đột quỵ)",
    "Gan to",
    "Đau tinh hoàn",
    "Nhược cơ",
    "Bệnh lao ruột",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính",
    "Chấn thương sọ não nặng",
    "Suy gan giai đoạn cuối",
    "Viêm màng não lympho bào",
    "Viêm bàng quang mạn tính",
    "Gan nhiễm mỡ không do rượu",
    "Tinh trùng loãng",
    "Nhiễm trùng đường ruột",
    "Hồi hộp, đánh trống ngực",
    
    // Cột 3
    "Sa sút trí tuệ",
    "Sốt bại liệt",
    "Ung thư gan",
    "Viêm màng não vô khuẩn",
    "Viêm gan B",
    "Rối loạn giấc ngủ",
    "Parkinson thứ phát",
    "Thoái hóa cột sống",
    "Ợ chua"
  ];

  // Chia danh sách thành 3 cột
  const column1 = menDiseases.slice(0, 9);
  const column2 = menDiseases.slice(9, 18);
  const column3 = menDiseases.slice(18, 27);

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
                <BreadcrumbPage>Bệnh Nam Giới</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-300"></div>
              </div>
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Nam Giới</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Bệnh nam giới bao gồm các vấn đề sức khỏe đặc trưng và quan trọng đối với phái mạnh. 
            Làm sao để nhận biết sớm các triệu chứng, nguyên nhân gây bệnh, và các phương pháp điều trị hiệu quả cho các bệnh thường gặp ở nam giới? 
            <a href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm tại đây.</a>
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe nam giới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Mãn dục nam</li>
                <li>• Yếu sinh lý</li>
                <li>• Rối loạn cương dương</li>
                <li>• Liệt dương</li>
                <li>• Xuất tinh sớm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Tránh stress</li>
                <li>• Không hút thuốc</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8">
            Tìm hiểu thêm về chăm sóc sức khỏe nam giới
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
