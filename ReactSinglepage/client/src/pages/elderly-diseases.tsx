import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ElderlyDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const elderlyDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Sa sút trí tuệ",
    "Viêm não tự miễn",
    "Suy gan giai đoạn cuối",
    "Viêm hậu môn",
    "Viêm bàng quang mạn tính",
    "Rối loạn giấc ngủ",
    "Nhiễm trùng đường ruột",
    "Hồi hộp, đánh trống ngực",
    "Polyp trực tràng",
    "Rối loạn thần kinh thực vật",
    "Đau thắt lưng",
    "Đau khớp",
    "Rối loạn tiền đình",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính",
    "Nhũn não",
    "U não nguyên phát",
    "Ung thư gan",
    "Bệnh viêm não",
    "Viêm gan B",
    "Parkinson thứ phát",
    "Thoái hóa cột sống",
    "Ợ chua",
    "Tăng natri máu",
    "Loạn trương lực cơ",
    "Loạn dưỡng cơ",
    "Đau vùng thắt lưng",
    "Đau xương khớp là gì? Những điều cần biết về đa...",
    
    // Cột 3
    "Cúm A",
    "Chấn thương sọ não nặng",
    "Sốt xuất huyết Dengue",
    "Phù nề",
    "Tai biến mạch máu não (Đột quỵ)",
    "Gan to",
    "Nhược cơ",
    "Bệnh lao ruột",
    "Hội chứng Tourette",
    "Đau cách hồi",
    "Phong tê thấp",
    "Nhiễm H.pylori",
    "Rối loạn trí nhớ",
    "Bụi phổi"
  ];

  // Chia danh sách thành 3 cột
  const column1 = elderlyDiseases.slice(0, 14);
  const column2 = elderlyDiseases.slice(14, 28);
  const column3 = elderlyDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Người Cao Tuổi</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Người Cao Tuổi</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Người cao tuổi thường đối mặt với nhiều vấn đề sức khỏe đặc thù do quá trình lão hóa. 
            Làm sao để nhận biết sớm và quản lý các bệnh lý phổ biến ở người cao tuổi, những phương pháp chăm sóc và phòng ngừa hiệu quả là gì? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe người cao tuổi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tăng huyết áp</li>
                <li>• Alzheimer</li>
                <li>• Tai biến mạch máu não</li>
                <li>• Bệnh tim mạch</li>
                <li>• Loãng xương ở nam</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Nghỉ ngơi đầy đủ</li>
                <li>• Tránh stress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8">
            Tìm hiểu thêm về chăm sóc sức khỏe người cao tuổi
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
