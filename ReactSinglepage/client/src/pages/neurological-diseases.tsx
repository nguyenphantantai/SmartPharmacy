import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Brain } from "lucide-react";
import { useState } from "react";

export default function NeurologicalDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const neurologicalDiseases = [
    // Cột 1
    "Sa sút trí tuệ",
    "Thiểu năng tuần hoàn não",
    "Phù não",
    "Viêm màng não lympho bào",
    "Đột quỵ não",
    "Xuất huyết não thất",
    "Bệnh viêm não",
    "Viêm màng não",
    "Rối loạn dây thần kinh trụ",
    "Hội chứng Tourette",
    "Loạn trương lực cơ",
    "Rối loạn ngôn ngữ",
    "Xơ cứng rải rác",
    "Viêm đa rễ dây thần kinh",
    
    // Cột 2
    "Chấn thương sọ não nặng",
    "Viêm não tự miễn",
    "Viêm não cấp ở trẻ em",
    "Rỗ não",
    "U nang màng nhện",
    "Thoát vị não",
    "Bại não trẻ em",
    "Bệnh não Wernicke",
    "Parkinson thứ phát",
    "Rối loạn thần kinh thực vật",
    "Rối loạn trí nhớ",
    "Co giật",
    "U tủy sống",
    "Liệt dây thần kinh số 4",
    
    // Cột 3
    "Bại não",
    "Não úng thủy",
    "Thoái hóa tiểu não",
    "U não thứ phát",
    "Sán não",
    "Viêm màng não vô khuẩn",
    "Dị dạng bán cầu não",
    "Thiếu 1 phần não",
    "Tăng động",
    "Hội chứng mất trí nhớ Korsakoff",
    "Rối loạn tiền đình",
    "Viêm tủy cắt ngang",
    "Đau dây thần kinh thiệt hầu",
    "Hội chứng Sudeck"
  ];

  // Chia danh sách thành 3 cột
  const column1 = neurologicalDiseases.slice(0, 14);
  const column2 = neurologicalDiseases.slice(14, 28);
  const column3 = neurologicalDiseases.slice(28, 42);

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
                <BreadcrumbPage>Bệnh Thần Kinh</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          {/* Brain Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Title and Search */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bệnh Thần Kinh</h1>
            <div className="relative w-[400px] max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Hệ thần kinh là trung tâm điều khiển mọi hoạt động của cơ thể, từ cảm giác đến vận động và các chức năng tự động. 
            Làm sao để duy trì sức khỏe hệ thần kinh, những bệnh lý nào thường gặp liên quan đến hệ thần kinh, và các phương pháp điều trị hiệu quả là gì? 
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
          <h3 className="text-xl font-semibold mb-4">Thông tin quan trọng về bệnh thần kinh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Các bệnh phổ biến:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Sa sút trí tuệ</li>
                <li>• Đột quỵ não</li>
                <li>• Viêm màng não</li>
                <li>• Bệnh viêm não</li>
                <li>• Xơ cứng rải rác</li>
                <li>• Parkinson</li>
                <li>• Bại não</li>
                <li>• Co giật</li>
                <li>• Rối loạn trí nhớ</li>
                <li>• Hội chứng Tourette</li>
                <li>• Loạn trương lực cơ</li>
                <li>• Rối loạn ngôn ngữ</li>
                <li>• Viêm đa rễ dây thần kinh</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Phòng ngừa:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tập thể dục thường xuyên</li>
                <li>• Ăn uống lành mạnh</li>
                <li>• Ngủ đủ giấc</li>
                <li>• Quản lý stress</li>
                <li>• Tránh chấn thương đầu</li>
                <li>• Kiểm soát huyết áp</li>
                <li>• Tránh thuốc lá và rượu</li>
                <li>• Tập luyện trí não</li>
                <li>• Khám sức khỏe định kỳ</li>
                <li>• Bảo vệ khỏi nhiễm trùng</li>
                <li>• Duy trì cân nặng hợp lý</li>
                <li>• Tránh độc tố môi trường</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Sections for Neurological Diseases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh não</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Sa sút trí tuệ</li>
              <li>• Đột quỵ não</li>
              <li>• Phù não</li>
              <li>• Viêm não</li>
              <li>• U não</li>
              <li>• Não úng thủy</li>
              <li>• Thoái hóa tiểu não</li>
              <li>• Sán não</li>
              <li>• Dị dạng bán cầu não</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 text-blue-600">Bệnh tủy sống và dây thần kinh</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• U tủy sống</li>
              <li>• Viêm tủy cắt ngang</li>
              <li>• Viêm đa rễ dây thần kinh</li>
              <li>• Rối loạn dây thần kinh trụ</li>
              <li>• Liệt dây thần kinh số 4</li>
              <li>• Đau dây thần kinh thiệt hầu</li>
              <li>• Hội chứng Sudeck</li>
            </ul>
          </Card>
        </div>

        {/* Risk Factors */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Yếu tố nguy cơ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Tuổi tác và di truyền</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tuổi cao</li>
                <li>• Tiền sử gia đình</li>
                <li>• Đột biến gen</li>
                <li>• Giới tính</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Lối sống</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hút thuốc</li>
                <li>• Uống rượu</li>
                <li>• Stress</li>
                <li>• Thiếu ngủ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">Yếu tố khác</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Chấn thương đầu</li>
                <li>• Nhiễm trùng</li>
                <li>• Bệnh tim mạch</li>
                <li>• Tiểu đường</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Treatment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-green-50">
            <h4 className="font-semibold mb-3 text-green-700">Điều trị</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Thuốc điều trị</li>
              <li>• Vật lý trị liệu</li>
              <li>• Phẫu thuật</li>
              <li>• Liệu pháp tâm lý</li>
              <li>• Phục hồi chức năng</li>
            </ul>
          </Card>

          <Card className="p-6 bg-purple-50">
            <h4 className="font-semibold mb-3 text-purple-700">Chăm sóc</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Chế độ ăn uống</li>
              <li>• Tập luyện thể chất</li>
              <li>• Tập luyện trí não</li>
              <li>• Hỗ trợ tâm lý</li>
              <li>• Theo dõi định kỳ</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
            Tìm hiểu thêm về chăm sóc sức khỏe thần kinh
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
