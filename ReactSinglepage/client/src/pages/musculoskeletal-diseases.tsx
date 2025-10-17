import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bone } from "lucide-react";
import { useState } from "react";

export default function MusculoskeletalDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const musculoskeletalDiseases = [
    // Cột 1
    "Viêm cân gan chân",
    "Đau đùi dị cảm",
    "Đau cách hồi",
    "Loạn dưỡng cơ",
    "Đau xương khớp là gì? Những điều cần biết về đa...",
    "Đau xương cụt",
    "Tê chân",
    "Khô khớp",
    "Viêm cơ nhiễm khuẩn",
    "Lou Gehrig",
    "Đau cơ mông",
    "U trong ống sống",
    "Viêm khớp bàn chân",
    "Viêm gân gấp ngón cái",
    
    // Cột 2
    "Hội chứng đường hầm xương quay",
    "Nhược cơ",
    "Phong tê thấp",
    "Đau khớp",
    "Viêm khớp cấp",
    "Tê bàn tay",
    "Đĩa đệm mất nước",
    "U xương",
    "Xẹp đốt sống",
    "Hội chứng mông chết",
    "Xơ cứng xương",
    "Gù lưng",
    "Viêm khớp khuỷu tay",
    "Trật khớp gối",
    
    // Cột 3
    "To các viễn cực",
    "Cơn đau thắt ngực",
    "Đau thắt lưng",
    "Đau vùng thắt lưng",
    "Đau xương chậu",
    "Đau lưng trên",
    "U xương sụn",
    "Rạn xương",
    "Hội chứng Sudeck",
    "Gai xương",
    "Vẹo xương sống tự phát",
    "Bệnh Scheuermann",
    "Bướu hoạt dịch cổ tay",
    "Thoái hoá khớp cổ tay"
  ];

  // Chia danh sách thành 3 cột
  const column1 = musculoskeletalDiseases.slice(0, 14);
  const column2 = musculoskeletalDiseases.slice(14, 28);
  const column3 = musculoskeletalDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Cơ Xương Khớp</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Bone Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
              <Bone className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Cơ Xương Khớp</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Cơ – xương – khớp đóng vai trò quan trọng trong việc duy trì khả năng vận động và sự linh hoạt của cơ thể. 
            Làm sao để bảo vệ hệ cơ xương khớp luôn khỏe mạnh, những bệnh lý nào thường gặp liên quan đến cơ xương khớp, và các phương pháp điều trị hiệu quả là gì? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe cơ xương khớp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Viêm khớp dạng thấp</li>
                <li>• Thoái hóa khớp</li>
                <li>• Loãng xương</li>
                <li>• Viêm cột sống dính khớp</li>
                <li>• Đau lưng</li>
                <li>• Đau cổ vai gáy</li>
                <li>• Viêm gân</li>
                <li>• Co rút Dupuytren</li>
                <li>• Hội chứng đường hầm cổ tay</li>
                <li>• Thoát vị đĩa đệm</li>
                <li>• Viêm cân gan chân</li>
                <li>• Đau cách hồi</li>
                <li>• Loạn dưỡng cơ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tập thể dục thường xuyên</li>
                <li>• Duy trì tư thế đúng</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Bổ sung canxi và vitamin D</li>
                <li>• Tránh mang vác nặng</li>
                <li>• Nghỉ ngơi đầy đủ</li>
                <li>• Massage và vật lý trị liệu</li>
                <li>• Kiểm soát cân nặng</li>
                <li>• Tránh stress</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Tập yoga hoặc pilates</li>
                <li>• Sử dụng giày dép phù hợp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Musculoskeletal Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-orange-600">Bệnh xương</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Loãng xương</li>
              <li>• Viêm xương</li>
              <li>• U xương</li>
              <li>• Gãy xương</li>
              <li>• Biến dạng xương</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-orange-600">Bệnh khớp</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Viêm khớp</li>
              <li>• Thoái hóa khớp</li>
              <li>• Viêm khớp dạng thấp</li>
              <li>• Trật khớp</li>
              <li>• Cứng khớp</li>
            </ul>
          </Card>
        </div>

        {/* Age-specific Information */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-orange-800">Chăm sóc theo độ tuổi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-orange-700">Trẻ em</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Phát triển xương</li>
                <li>• Tập thể dục</li>
                <li>• Dinh dưỡng đầy đủ</li>
                <li>• Tránh chấn thương</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-700">Người trưởng thành</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Duy trì sức mạnh</li>
                <li>• Phòng ngừa chấn thương</li>
                <li>• Quản lý stress</li>
                <li>• Kiểm tra định kỳ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-700">Người cao tuổi</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Phòng ngừa loãng xương</li>
                <li>• Tập thể dục nhẹ</li>
                <li>• Bổ sung canxi</li>
                <li>• Phòng ngã</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700">
            Tìm hiểu thêm về chăm sóc sức khỏe cơ xương khớp
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
