import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function LimbsDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const limbsDiseases = [
    // Cột 1
    "Liệt tứ chi",
    "Hội chứng rung giật cơ lành tính",
    "Viêm khớp liên cầu",
    "Co rút Dupuytren",
    "Bệnh Beriberi",
    "thấp khớp",
    "Thoái hóa khớp ngón tay",
    "Viêm khớp dạng thấp",
    "Giãn tĩnh mạch chi dưới",
    "Đau mắt cá chân",
    "Đau bàn chân",
    "Đau cổ tay",
    "Viêm khớp cổ tay",
    "Viêm khớp cổ chân",
    // Cột 2
    "Đau cách hồi",
    "Bướu hoạt dịch cổ tay",
    "Hội chứng đường hầm cổ tay",
    "Thoát vị đùi",
    "Thoái hóa khớp",
    "Thoái hóa khớp cổ chân",
    "Viêm đa cơ",
    "Chuột rút co cứng",
    "Tê bì chân tay",
    "Đau ngón tay",
    "Đau bắp chân",
    "Viêm khớp tay",
    "Viêm khớp háng",
    "Viêm khớp ngón tay",
    // Cột 3
    "Tê chân",
    "Trật khớp gối",
    "Bệnh Osgood-Schlatter",
    "Giả gút",
    "Run vô căn",
    "Thoái hóa khớp khuỷu tay",
    "Viêm gân",
    "Đau đầu gối",
    "Phù chân",
    "Đau gót chân",
    "Đau chân",
    "Giãn tĩnh mạch",
    "Viêm khớp ngón chân",
    "Hẹp khe khớp háng",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(limbsDiseases.length / 3);
  const column1 = limbsDiseases.slice(0, diseasesPerColumn);
  const column2 = limbsDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = limbsDiseases.slice(diseasesPerColumn * 2);

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
                <BreadcrumbPage>Tứ chi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {/* Icon tứ chi với tay và chân */}
                <div className="relative w-8 h-8">
                  {/* Tay trái */}
                  <div className="absolute top-1 left-0 w-2 h-3 bg-white/80 rounded-sm"></div>
                  {/* Tay phải */}
                  <div className="absolute top-1 right-0 w-2 h-3 bg-white/80 rounded-sm"></div>
                  {/* Chân trái */}
                  <div className="absolute bottom-1 left-0 w-2 h-3 bg-white/80 rounded-sm"></div>
                  {/* Chân phải */}
                  <div className="absolute bottom-1 right-0 w-2 h-3 bg-white/80 rounded-sm"></div>
                  {/* Thân */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Tứ chi</h1>
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
            Bệnh tứ chi ảnh hưởng đến tay và chân, gây khó khăn trong sinh hoạt và vận động hàng ngày. 
            Làm sao để nhận biết các triệu chứng và phòng ngừa các bệnh lý liên quan đến tứ chi? 
            Những phương pháp điều trị hiệu quả giúp duy trì sức khỏe cho tay và chân là gì? 
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
