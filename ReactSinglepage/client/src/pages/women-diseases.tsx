import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function WomenDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const womenDiseases = [
    // Cột 1
    "Cúm Mùa",
    "Nhũn não",
    "Suy gan giai đoạn cuối",
    "Viêm màng não lympho bào",
    "Sa tạng chậu",
    "Gan nhiễm mỡ không do rượu",
    "Parkinson thứ phát",
    "Dính buồng tử cung",
    "Thoái hóa cột sống",
    "Hồi hộp, đánh trống ngực",
    "Hội chứng Tourette",
    "Đau cách hồi",
    "Loạn trương lực cơ",
    
    // Cột 2
    "Bệnh phổi tắc nghẽn mạn tính",
    "Viêm não tự miễn",
    "Ung thư gan",
    "Tai biến mạch máu não (Đột quỵ)",
    "Viêm gan B",
    "Rối loạn giấc ngủ",
    "Vỡ tử cung",
    "Nhiễm trùng đường ruột",
    "Suy buồng trứng sớm",
    "Ợ chua",
    "Polyp trực tràng",
    "Rối loạn thần kinh thực vật",
    "Phong tê thấp",
    "Đau khớp",
    
    // Cột 3
    "Sa sút trí tuệ",
    "Sốt bại liệt",
    "Viêm hậu môn",
    "Viêm bàng quang mạn tính",
    "Gan to",
    "Bệnh tự miễn",
    "Nhược cơ",
    "Tắc mạch ối",
    "Bệnh lao ruột",
    "Sảy thai",
    "Sản giật",
    "Rối loạn chức năng tình dục",
    "Đau thắt lưng",
    "Đau vùng thắt lưng"
  ];

  // Chia danh sách thành 3 cột
  const column1 = womenDiseases.slice(0, 13);
  const column2 = womenDiseases.slice(13, 27);
  const column3 = womenDiseases.slice(27, 41);

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
                <BreadcrumbPage>Bệnh Nữ Giới</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-pink-300"></div>
              </div>
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Nữ Giới</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Bệnh nữ giới là một phần quan trọng của sức khỏe phụ nữ, ảnh hưởng đến chất lượng cuộc sống và sức khỏe tổng thể. 
            Làm sao để nhận biết các triệu chứng sớm, đâu là những bệnh lý thường gặp ở phụ nữ, và các biện pháp phòng ngừa, điều trị hiệu quả? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về sức khỏe nữ giới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Chậm kinh</li>
                <li>• Hội chứng buồng trứng đa nang</li>
                <li>• Ung thư vú</li>
                <li>• U nang buồng trứng</li>
                <li>• Nang vú</li>
                <li>• Sa tạng chậu</li>
                <li>• Dính buồng tử cung</li>
                <li>• Vỡ tử cung</li>
                <li>• Suy buồng trứng sớm</li>
                <li>• Tắc mạch ối</li>
                <li>• Sảy thai</li>
                <li>• Sản giật</li>
                <li>• Rối loạn chức năng tình dục</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Khám phụ khoa định kỳ</li>
                <li>• Tầm soát ung thư vú</li>
                <li>• Tầm soát ung thư cổ tử cung</li>
                <li>• Dinh dưỡng cân bằng</li>
                <li>• Tập thể dục thường xuyên</li>
                <li>• Tránh stress</li>
                <li>• Không hút thuốc</li>
                <li>• Hạn chế rượu bia</li>
                <li>• Ngủ đủ giấc</li>
                <li>• Quan hệ tình dục an toàn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Women's Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-pink-600">Sức khỏe sinh sản</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Chu kỳ kinh nguyệt bình thường</li>
              <li>• Các vấn đề về buồng trứng</li>
              <li>• Mang thai và sinh nở</li>
              <li>• Mãn kinh</li>
              <li>• Sức khỏe tình dục</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-pink-600">Sức khỏe tổng quát</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Bệnh tim mạch ở phụ nữ</li>
              <li>• Loãng xương</li>
              <li>• Bệnh tự miễn</li>
              <li>• Rối loạn nội tiết</li>
              <li>• Sức khỏe tâm thần</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-pink-600 hover:bg-pink-700">
            Tìm hiểu thêm về chăm sóc sức khỏe nữ giới
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
