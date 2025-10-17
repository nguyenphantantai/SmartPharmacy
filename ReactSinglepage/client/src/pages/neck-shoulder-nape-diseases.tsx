import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function NeckShoulderNapeDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const neckDiseases = [
    // Cột 1
    "Viêm gân nhị đầu vai",
    "Thoái hóa khớp vai",
    "Viêm khớp dạng thấp",
    "Loạn dưỡng cơ Duchenne",
    "Thoái hóa đốt sống cổ",
    "Viêm khớp cổ",
    "Bướu giáp nhân",
    // Cột 2
    "Trật khớp",
    "Viêm đa cơ",
    "Viêm cột sống dính khớp",
    "Trật khớp vai",
    "Ung thư amidan",
    "Đau cổ vai gáy",
    "Hẹp lỗ liên hợp đốt sống cổ",
    // Cột 3
    "Viêm quanh khớp vai",
    "Viêm gân",
    "Viêm khớp vai",
    "Bướu cổ",
    "Đau cổ",
    "Bướu giáp keo",
    "Bướu giáp đơn thuần",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(neckDiseases.length / 3);
  const column1 = neckDiseases.slice(0, diseasesPerColumn);
  const column2 = neckDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = neckDiseases.slice(diseasesPerColumn * 2);

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
                <BreadcrumbPage>Cổ Vai Gáy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                {/* Icon cổ vai gáy với highlight đỏ */}
                <div className="relative w-8 h-8">
                  {/* Đầu */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/60 rounded-full"></div>
                  {/* Cổ và vai */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-400/80 rounded-sm"></div>
                  {/* Thân trên */}
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-white/40 rounded-sm"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Cổ Vai Gáy</h1>
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
            Làm sao để giữ cổ luôn khỏe mạnh, đâu là những bệnh lý thường gặp ở vùng cổ vai gáy, 
            và các biện pháp phòng ngừa, điều trị hiệu quả là gì? 
            Tìm hiểu thêm tại đây.
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
