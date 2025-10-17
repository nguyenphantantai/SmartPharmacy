import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ReproductiveDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const reproductiveDiseases = [
    // Cột 1
    "Sa tạng chậu",
    "Dính buồng tử cung",
    "Viêm buồng trứng",
    "Viêm âm đạo do Trichomoniasis",
    "Ngứa hậu môn",
    "Ung thư cổ tử cung giai đoạn cuối",
    "Sa sinh dục",
    "Trùng roi sinh dục nữ",
    "Khô âm đạo",
    "Bán hẹp bao quy đầu",
    "Tinh hoàn lạc chỗ",
    "Loạn sản cổ tử cung",
    "Ung thư dương vật",
    "Viêm tuyến tiền liệt mạn tính",
    // Cột 2
    "Đau tinh hoàn",
    "Viêm cổ tử cung",
    "Sa tử cung",
    "U tinh hoàn",
    "Ung thư cổ tử cung",
    "Nấm sinh dục",
    "Ung thư âm hộ",
    "Nhiễm khuẩn Chlamydia",
    "Tinh hoàn ẩn",
    "Không có tinh trùng",
    "Rối loạn phóng noãn",
    "Polyp tử cung",
    "Nhiễm Candida",
    "Rối loạn cương dương",
    // Cột 3
    "Tinh trùng loãng",
    "U nang tuyến Bartholin",
    "Bệnh hột xoài",
    "Teo tinh hoàn",
    "Ung thư đại tràng",
    "Mụn cơm sinh dục",
    "Lao hệ tiết niệu-sinh dục",
    "Nhiễm lậu cầu",
    "Lỗ tiểu lệch thấp",
    "Herpes hậu môn",
    "Nang âm hộ",
    "Bệnh huyết trắng",
    "Viêm tuyến tiền liệt cấp tính",
    "Hạ cam mềm",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(reproductiveDiseases.length / 3);
  const column1 = reproductiveDiseases.slice(0, diseasesPerColumn);
  const column2 = reproductiveDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = reproductiveDiseases.slice(diseasesPerColumn * 2);

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
                <BreadcrumbPage>Sinh dục</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                {/* Icon sinh dục với tử cung */}
                <div className="relative w-8 h-8">
                  {/* Tử cung */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white/80 rounded-sm"></div>
                  {/* Buồng trứng */}
                  <div className="absolute top-2 left-0 w-1 h-1 bg-white/80 rounded-full"></div>
                  <div className="absolute top-2 right-0 w-1 h-1 bg-white/80 rounded-full"></div>
                  {/* Âm đạo */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white/80 rounded-sm"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Sinh dục</h1>
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
            Bệnh sinh dục ảnh hưởng lớn đến sức khỏe và chất lượng cuộc sống của cả nam và nữ. 
            Làm thế nào để nhận biết sớm các triệu chứng, phòng ngừa và điều trị hiệu quả các bệnh sinh dục phổ biến? 
            Tìm hiểu thêm về cách bảo vệ sức khỏe sinh sản của bạn tại đây.
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
