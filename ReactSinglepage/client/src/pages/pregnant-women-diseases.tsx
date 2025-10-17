import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function PregnantWomenDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const pregnantWomenDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Viêm hậu môn",
    "Gan to",
    "Parkinson thứ phát",
    "Nhược cơ",
    "Hồi hộp, đánh trống ngực",
    "Rối loạn thần kinh thực vật",
    "Nhiễm độc thai nghén",
    "Thai chết lưu",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính (COPD)",
    "Thiếu 1 phần não",
    "Tiền sản giật",
    "Chuyển dạ đình trệ",
    "Viêm cổ tử cung",
    "Ợ chua",
    "Loạn trương lực cơ",
    "Đau thắt lưng",
    "Rối loạn trí nhớ",
    
    // Cột 3
    "Nhũn não",
    "Viêm bàng quang mạn tính",
    "Rối loạn giấc ngủ",
    "Vỡ tử cung",
    "Nhiễm trùng đường ruột",
    "Hội chứng Tourette",
    "Phong tê thấp",
    "Loạn dưỡng cơ",
    "Đau vùng thắt lưng"
  ];

  // Chia danh sách thành 3 cột
  const column1 = pregnantWomenDiseases.slice(0, 9);
  const column2 = pregnantWomenDiseases.slice(9, 18);
  const column3 = pregnantWomenDiseases.slice(18, 27);

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
                <BreadcrumbPage>Bệnh Phụ Nữ Mang Thai</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-300"></div>
              </div>
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Phụ Nữ Mang Thai</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Phụ nữ mang thai cần được chăm sóc đặc biệt để đảm bảo sức khỏe cho cả mẹ và bé. 
            Làm sao để nhận biết và phòng ngừa các bệnh thường gặp trong thai kỳ, đâu là những biện pháp chăm sóc sức khỏe hiệu quả cho phụ nữ mang thai? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe phụ nữ mang thai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tiểu đường thai kỳ</li>
                <li>• Chửa trứng</li>
                <li>• Suy thai</li>
                <li>• Bể sản dịch</li>
                <li>• Nha bám thấp</li>
                <li>• Tiền sản giật</li>
                <li>• Chuyển dạ đình trệ</li>
                <li>• Viêm cổ tử cung</li>
                <li>• Nhiễm độc thai nghén</li>
                <li>• Thai chết lưu</li>
                <li>• Vỡ tử cung</li>
                <li>• Nhiễm trùng đường ruột</li>
                <li>• Rối loạn giấc ngủ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Khám thai định kỳ</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Bổ sung vitamin và khoáng chất</li>
                <li>• Tập thể dục nhẹ nhàng</li>
                <li>• Tránh stress</li>
                <li>• Không hút thuốc và uống rượu</li>
                <li>• Nghỉ ngơi đầy đủ</li>
                <li>• Vệ sinh cá nhân</li>
                <li>• Theo dõi cân nặng</li>
                <li>• Kiểm tra đường huyết</li>
                <li>• Tiêm phòng cần thiết</li>
                <li>• Tư vấn bác sĩ khi có triệu chứng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Pregnant Women's Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-green-600">Sức khỏe thai kỳ</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Tam cá nguyệt đầu (0-12 tuần)</li>
              <li>• Tam cá nguyệt giữa (13-26 tuần)</li>
              <li>• Tam cá nguyệt cuối (27-40 tuần)</li>
              <li>• Theo dõi phát triển thai nhi</li>
              <li>• Chuẩn bị sinh nở</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-green-600">Biến chứng thai kỳ</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Tiền sản giật</li>
              <li>• Đái tháo đường thai kỳ</li>
              <li>• Thiếu máu</li>
              <li>• Nhiễm trùng</li>
              <li>• Sinh non</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">
            Tìm hiểu thêm về chăm sóc sức khỏe phụ nữ mang thai
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
