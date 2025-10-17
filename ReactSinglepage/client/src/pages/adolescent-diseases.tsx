import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function AdolescentDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const adolescentDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Viêm hậu môn",
    "Rối loạn giấc ngủ",
    "Nhiễm trùng đường ruột",
    "Hội chứng Tourette",
    "Phong tê thấp",
    "Rối loạn trí nhớ",
    "Đau xương chậu",
    "Tê bàn tay",
    "Co giật",
    "Mất trí nhớ",
    "Xơ cứng rải rác",
    "Viêm dây thần kinh",
    "Sa dạ dày",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính",
    "Viêm bàng quang mạn tính",
    "Parkinson thứ phát",
    "Tăng động",
    "Rối loạn thần kinh thực vật",
    "Loạn dưỡng cơ",
    "Bụi phổi",
    "Đau xương cụt",
    "Tê chân",
    "Chóng mặt",
    "Són phân",
    "Bệnh thần kinh",
    "Sa trực tràng",
    "Viêm hang vị dạ dày",
    
    // Cột 3
    "Nhũn não",
    "Gan to",
    "Nhược cơ",
    "Ợ chua",
    "Loạn trương lực cơ",
    "Đau thắt lưng",
    "Jet lag",
    "Bệnh Crohn",
    "Run rẩy",
    "Hội chứng cơ nâng hậu môn",
    "Viêm tủy cắt ngang",
    "Ung thư gan",
    "Bệnh thần kinh quay",
    "Sốt xuất huyết"
  ];

  // Chia danh sách thành 3 cột
  const column1 = adolescentDiseases.slice(0, 14);
  const column2 = adolescentDiseases.slice(14, 28);
  const column3 = adolescentDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Tuổi Dậy Thì</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-purple-300"></div>
              </div>
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Tuổi Dậy Thì</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Tuổi dậy thì là giai đoạn phát triển quan trọng, có thể gặp nhiều vấn đề sức khỏe đặc thù. 
            Làm sao để nhận biết và phòng ngừa các bệnh thường gặp ở tuổi dậy thì? 
            Những biện pháp nào giúp bảo vệ sức khỏe cho tuổi teen một cách hiệu quả nhất? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe tuổi dậy thì</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Mụn trứng cá</li>
                <li>• Chàm</li>
                <li>• Viêm họng</li>
                <li>• Mụn ẩn</li>
                <li>• Rối loạn kinh nguyệt</li>
                <li>• Rối loạn giấc ngủ</li>
                <li>• Tăng động</li>
                <li>• Rối loạn thần kinh thực vật</li>
                <li>• Loạn dưỡng cơ</li>
                <li>• Rối loạn trí nhớ</li>
                <li>• Co giật</li>
                <li>• Mất trí nhớ</li>
                <li>• Chóng mặt</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Chăm sóc da đúng cách</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Ngủ đủ giấc</li>
                <li>• Quản lý stress</li>
                <li>• Vệ sinh cá nhân</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Tránh thuốc lá và rượu</li>
                <li>• Tư vấn tâm lý khi cần</li>
                <li>• Giáo dục giới tính</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Adolescent Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-purple-600">Sức khỏe thể chất</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Phát triển cơ thể</li>
              <li>• Thay đổi hormone</li>
              <li>• Vấn đề về da</li>
              <li>• Rối loạn ăn uống</li>
              <li>• Vấn đề về cân nặng</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-purple-600">Sức khỏe tâm lý</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Rối loạn cảm xúc</li>
              <li>• Trầm cảm</li>
              <li>• Lo âu</li>
              <li>• Rối loạn hành vi</li>
              <li>• Áp lực học tập</li>
            </ul>
          </Card>
        </div>

        {/* Age-specific Information */}
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-800">Chăm sóc theo giai đoạn</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-purple-700">10-13 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Bắt đầu dậy thì</li>
                <li>• Thay đổi cơ thể</li>
                <li>• Chăm sóc da cơ bản</li>
                <li>• Giáo dục giới tính</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-purple-700">14-16 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Phát triển mạnh mẽ</li>
                <li>• Vấn đề về mụn</li>
                <li>• Rối loạn kinh nguyệt</li>
                <li>• Áp lực học tập</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-purple-700">17-19 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hoàn thiện phát triển</li>
                <li>• Chuẩn bị trưởng thành</li>
                <li>• Quan hệ tình cảm</li>
                <li>• Lựa chọn nghề nghiệp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
            Tìm hiểu thêm về chăm sóc sức khỏe tuổi dậy thì
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
