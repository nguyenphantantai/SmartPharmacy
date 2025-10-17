import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ChildrenDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const childrenDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Nhũn não",
    "Sốt phát ban",
    "Viêm hậu môn",
    "Viêm màng não vô khuẩn",
    "Dị dạng bán cầu não",
    "Mộng du",
    "Rối loạn chuyển hóa",
    "Tăng động",
    "Rối loạn thần kinh thực vật",
    "Bệnh lùn tuyến yên",
    "Nhiễm H.pylori",
    "Bụi phổi",
    "Bệnh Crohn",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính",
    "Chấn thương sọ não nặng",
    "Sốt xuất huyết Dengue",
    "Viêm màng não lympho bào",
    "Bệnh viêm não",
    "Thiếu 1 phần não",
    "Rối loạn giấc ngủ",
    "Nhược cơ",
    "Ợ chua",
    "Loạn trương lực cơ",
    "Đau thắt lưng",
    "Loạn dưỡng mỡ",
    "Jet lag",
    "Tê bàn tay",
    
    // Cột 3
    "Cúm A",
    "Sốt bại liệt",
    "Sốt thấp khớp",
    "Rỗ não",
    "Bại não trẻ em",
    "Viêm bàng quang mạn tính",
    "Parkinson thứ phát",
    "Nhiễm trùng đường ruột",
    "Hội chứng Tourette",
    "Phong tê thấp",
    "Loạn dưỡng cơ",
    "Rối loạn trí nhớ",
    "Đau xương chậu",
    "Tê chân"
  ];

  // Chia danh sách thành 3 cột
  const column1 = childrenDiseases.slice(0, 14);
  const column2 = childrenDiseases.slice(14, 28);
  const column3 = childrenDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Trẻ Em</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-yellow-300"></div>
              </div>
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Trẻ Em</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Bài viết cung cấp thông tin chi tiết về các bệnh lý thường gặp ở trẻ em, từ nguyên nhân, triệu chứng đến phương pháp điều trị. 
            Tìm hiểu các bí quyết chăm sóc sức khỏe cho trẻ em để bảo vệ và giúp bé phát triển khỏe mạnh.
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe trẻ em</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tay chân miệng</li>
                <li>• Thủy đậu</li>
                <li>• Tự kỷ</li>
                <li>• Đinh thắng lưỡi</li>
                <li>• Cảm lạnh</li>
                <li>• Sốt phát ban</li>
                <li>• Viêm họng</li>
                <li>• Tiêu chảy</li>
                <li>• Sốt xuất huyết</li>
                <li>• Viêm phổi</li>
                <li>• Hen suyễn</li>
                <li>• Dị ứng</li>
                <li>• Rối loạn phát triển</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tiêm chủng đầy đủ</li>
                <li>• Vệ sinh cá nhân</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Ngủ đủ giấc</li>
                <li>• Tập thể dục</li>
                <li>• Tránh tiếp xúc với người bệnh</li>
                <li>• Rửa tay thường xuyên</li>
                <li>• Môi trường sống sạch sẽ</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Theo dõi phát triển</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Children's Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-orange-600">Sức khỏe phát triển</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Phát triển thể chất</li>
              <li>• Phát triển trí tuệ</li>
              <li>• Phát triển ngôn ngữ</li>
              <li>• Phát triển xã hội</li>
              <li>• Rối loạn phát triển</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-orange-600">Bệnh truyền nhiễm</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Bệnh do virus</li>
              <li>• Bệnh do vi khuẩn</li>
              <li>• Bệnh do ký sinh trùng</li>
              <li>• Bệnh do nấm</li>
              <li>• Phòng ngừa lây nhiễm</li>
            </ul>
          </Card>
        </div>

        {/* Age-specific Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Chăm sóc theo độ tuổi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-blue-700">0-2 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tiêm chủng cơ bản</li>
                <li>• Dinh dưỡng sữa mẹ</li>
                <li>• Theo dõi cân nặng</li>
                <li>• Phát triển vận động</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">3-6 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tiêm chủng bổ sung</li>
                <li>• Dinh dưỡng đa dạng</li>
                <li>• Phát triển ngôn ngữ</li>
                <li>• Chuẩn bị đi học</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">7-12 tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hoạt động thể thao</li>
                <li>• Học tập và tập trung</li>
                <li>• Phát triển xã hội</li>
                <li>• Sức khỏe tâm lý</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700">
            Tìm hiểu thêm về chăm sóc sức khỏe trẻ em
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
