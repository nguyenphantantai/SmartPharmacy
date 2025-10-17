import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function HeadDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const headDiseases = [
    // Cột 1
    "Rối loạn tuần hoàn não",
    "Xuất huyết não",
    "Viêm não tự miễn",
    "Phù não",
    "Viêm màng não lympho bào",
    "Đột quỵ não",
    "Sán não",
    "Viêm màng não vô khuẩn",
    "Dị dạng bán cầu não",
    "Hội chứng mất trí nhớ Korsakoff",
    "Tóc bạc sớm",
    "Xuất huyết dưới kết mạc",
    "Liệt dây thần kinh số III",
    "U tuyến tùng",
    // Cột 2
    "Chấn thương sọ não nặng",
    "Nhồi máu não",
    "U não nguyên phát",
    "Viêm não cấp ở trẻ em",
    "Rỗ não",
    "U nang màng nhện",
    "Xuất huyết não thất",
    "Bệnh viêm não",
    "Viêm màng não",
    "Chóng mặt",
    "Sưng môi",
    "Cườm nước",
    "Liệt dây thần kinh số VI",
    "Nhức đầu chóng mặt",
    // Cột 3
    "U não",
    "Phình động mạch não",
    "Não úng thủy",
    "Thoái hóa tiểu não",
    "U não thứ phát",
    "Rối loạn chức năng não sau hóa trị",
    "Thoát vị não",
    "Bại não trẻ em",
    "Bệnh não Wernicke",
    "Đau dây thần kinh thiệt hầu",
    "Suy giảm nhận thức",
    "Dị ứng mắt",
    "Moyamoya",
    "U dây thần kinh Morton",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(headDiseases.length / 3);
  const column1 = headDiseases.slice(0, diseasesPerColumn);
  const column2 = headDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = headDiseases.slice(diseasesPerColumn * 2);

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-screen-2xl px-6 py-8">
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
                <BreadcrumbPage>Đầu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-white/20"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Đầu</h1>
          </div>
          <div className="relative w-[400px] max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm thông tin về bệnh..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            Bệnh về đầu ảnh hưởng đến nhiều khía cạnh của sức khỏe, từ đau đầu, chóng mặt đến các vấn đề nghiêm trọng như đột quỵ. 
            Làm sao để nhận biết triệu chứng sớm, phòng ngừa hiệu quả và điều trị đúng cách? 
            Khám phá các thông tin hữu ích về bệnh về đầu và cách chăm sóc sức khỏe của bạn tại đây.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Tổng hợp các bệnh liên quan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột 1 */}
            <div className="space-y-3">
              {column1.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm leading-relaxed"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>

            {/* Cột 2 */}
            <div className="space-y-3">
              {column2.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm leading-relaxed"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>

            {/* Cột 3 */}
            <div className="space-y-3">
              {column3.map((disease, index) => (
                <div key={index}>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm leading-relaxed"
                  >
                    {disease}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
