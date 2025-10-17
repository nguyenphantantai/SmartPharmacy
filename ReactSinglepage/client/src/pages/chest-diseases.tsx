import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ChestDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const chestDiseases = [
    // Cột 1
    "Suy gan giai đoạn cuối",
    "Gan nhiễm mỡ",
    "Đau ngực",
    "Vỡ túi ngực",
    "Bụi phổi atbet (amiăng)",
    "Bướu sợi tuyến Birads 3",
    "Ép tim",
    "Khó thở",
    "Viêm tiểu phế quản",
    "Nhịp nhanh nhĩ",
    "U trung thất",
    "Nhiễm Echinococcus",
    "Sốc",
    "Ngoại tâm thu thất",
    // Cột 2
    "Bệnh van tim",
    "Gan to",
    "Viêm tuyến vú",
    "Viêm phổi do Pneumocystis jirovecii",
    "Bụi phổi bông",
    "Bướu sợi tuyến",
    "Phát ban ở ngực",
    "Viêm phế quản cấp tính",
    "Sốc phản vệ",
    "Áp xe vú",
    "Ung thư phế quản",
    "Phình động mạch tạng",
    "Hội chứng lối thoát lồng ngực",
    "Thân chung động mạch là gì?",
    // Cột 3
    "Tim to",
    "Ung thư biểu mô tế bào gan",
    "Ung thư vú tái phát",
    "Áp-xe phổi",
    "Bướu sợi tuyến Birads 4",
    "Ung thư biểu mô ống dẫn sữa tại chỗ",
    "Ho khan",
    "Dị vật đường thở",
    "Nôn ra máu",
    "Ung thư tụy",
    "Ung thư phổi",
    "U hạt mạn tính",
    "Lõm ngực bẩm sinh",
    "Bệnh Kawasaki ở trẻ em",
  ];

  // Chia danh sách thành 3 cột
  const diseasesPerColumn = Math.ceil(chestDiseases.length / 3);
  const column1 = chestDiseases.slice(0, diseasesPerColumn);
  const column2 = chestDiseases.slice(diseasesPerColumn, diseasesPerColumn * 2);
  const column3 = chestDiseases.slice(diseasesPerColumn * 2);

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
                <BreadcrumbPage>Ngực</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                {/* Icon ngực với phổi và tim */}
                <div className="relative w-8 h-8">
                  <div className="absolute top-1 left-1 w-3 h-4 bg-white/80 rounded-full"></div>
                  <div className="absolute top-1 right-1 w-3 h-4 bg-white/80 rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/80 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Ngực</h1>
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
            Bệnh về ngực ảnh hưởng trực tiếp đến hệ hô hấp và tim mạch, đóng vai trò quan trọng trong việc duy trì sức khỏe tổng thể. 
            Làm sao để nhận biết và phòng ngừa các bệnh về ngực hiệu quả? 
            Đâu là những triệu chứng và phương pháp điều trị phổ biến? 
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
