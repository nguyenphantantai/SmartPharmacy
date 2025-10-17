import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function EarNoseThroatDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const entDiseases = [
    // Cột 1
    "Bệnh phổi tắc nghẽn mạn tính (COPD)",
    "Viêm tai",
    "Nghẹt mũi",
    "Liệt dây thanh quản",
    "Viêm thanh quản mạn",
    "Dị vật trong tai",
    "Ù tai",
    "Viêm xoang",
    "Viêm xoang sàng",
    "Ung thư tai",
    "Khô miệng",
    "Viêm lợi",
    "U bạch huyết",
    "Bạch sản",
    // Cột 2
    "Hắt hơi",
    "Sổ mũi",
    "Viêm họng do virus Coxsackie",
    "U nang dây thanh",
    "Viêm Lưỡi",
    "Nấm tai",
    "Viêm mũi vận mạch",
    "Viêm xoang mạn tính",
    "Ung thư khoang miệng",
    "Ung thư Amidan Khẩu Cái",
    "Viêm nha chu",
    "Ung thư tuyến nước bọt",
    "Viêm tai xương chũm",
    "Xốp xơ tai",
    // Cột 3
    "Nhiệt miệng",
    "Đau cổ họng",
    "Chảy máu mũi",
    "Polyp mũi",
    "Viêm xoang hàm",
    "Điếc",
    "Viêm họng hạt",
    "Khàn tiếng",
    "Viêm lưỡi gà",
    "Hôi miệng",
    "Viêm chân răng",
    "Suy giảm thính lực",
    "Viêm tuyến nước bọt",
    "Viêm xoang trán",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(entDiseases.length / 3);
  const column1 = entDiseases.slice(0, diseasesPerColumn);
  const column2 = entDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = entDiseases.slice(diseasesPerColumn * 2);

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
                <BreadcrumbPage>Tai Mũi Họng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                {/* Icon tai mũi họng */}
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-3 bg-white/80 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <div className="w-2 h-3 bg-white/80 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Tai Mũi Họng</h1>
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
            Tai mũi họng là một phần quan trọng của hệ hô hấp, giúp chúng ta thở, ngửi, nghe và nói. 
            Làm thế nào để giữ tai mũi họng luôn khỏe mạnh, nhận biết các triệu chứng và phương pháp điều trị hiệu quả cho các bệnh lý phổ biến? 
            Khám phá thêm về chăm sóc sức khỏe tai mũi họng tại đây.
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
