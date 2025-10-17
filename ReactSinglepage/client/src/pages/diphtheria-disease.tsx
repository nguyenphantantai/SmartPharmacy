import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function DiphtheriaDiseasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: "overview", label: "Tổng quan chung" },
    { id: "symptoms", label: "Triệu chứng" },
    { id: "causes", label: "Nguyên nhân" },
    { id: "risk-factors", label: "Đối tượng nguy cơ" },
    { id: "diagnosis", label: "Chẩn đoán" },
    { id: "prevention", label: "Phòng ngừa bệnh" },
    { id: "treatment", label: "Cách điều trị" },
  ];

  const relatedTags = [
    "Bệnh Tai Mũi Họng",
    "Bệnh Trẻ Em", 
    "Bệnh Truyền Nhiễm",
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì"
  ];

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
                <BreadcrumbPage>Bạch hầu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-blue-700"
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Article Header */}
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">26/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bạch hầu là gì? Những điều cần biết về bạch hầu
              </h1>
              
              {/* Related Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {relatedTags.map((tag, index) => (
                  <span key={index} className="text-blue-600 hover:underline cursor-pointer text-sm">
                    {tag}
                    {index < relatedTags.length - 1 && <span className="mx-2">•</span>}
                  </span>
                ))}
              </div>

              {/* Social Sharing */}
              <div className="flex gap-4 mb-8">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Facebook className="h-5 w-5" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Zalo</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">Chia sẻ</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose max-w-none">
              {/* Tổng quan chung */}
              <div id="overview" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Tổng quan về Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh bạch hầu là một bệnh nhiễm trùng cấp tính ảnh hưởng đến cổ họng và các phần của đường hô hấp trên 
                  như mũi, xoang cạnh mũi, đường mũi và hầu họng. Nguyên nhân của bệnh là do ngoại độc tố từ vi khuẩn 
                  bạch hầu tiết ra, tác động đến tim, thận và hệ thần kinh, gây ra nhiễm trùng và nhiễm độc toàn thân.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh bạch hầu (tên tiếng anh là Diphtheria) là bệnh nhiễm trùng cấp tính làm xuất hiện giả mạc dày dai, 
                  trắng ngà, bám chặt và lan nhanh bao phủ toàn bộ vòm họng, mũi, tuyến hạnh nhân, thanh quản. Bệnh còn 
                  có thể xuất hiện ở da, các màng niêm mạc khác (kết mạc mắt, bộ phận sinh dục,...).
                </p>
                <h3 className="text-xl font-semibold mb-3">Đặc điểm của vi khuẩn bạch hầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Corynebacterium diphtheriae:</strong> Vi khuẩn Gram dương, hình que</li>
                  <li><strong>Ngoại độc tố:</strong> Độc tố mạnh gây tổn thương tim, thần kinh</li>
                  <li><strong>Giả mạc:</strong> Màng dày, dai, màu trắng ngà đặc trưng</li>
                  <li><strong>Khả năng sống:</strong> Có thể sống trên đồ vật vài giờ đến vài ngày</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của bạch hầu thường xuất hiện sau 2-5 ngày kể từ khi nhiễm vi khuẩn. 
                  Bệnh có thể biểu hiện ở nhiều vị trí khác nhau trên cơ thể.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng đường hô hấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giả mạc:</strong> Màng dày, trắng ngà bám chặt vào niêm mạc</li>
                  <li><strong>Đau họng:</strong> Đau nhẹ đến trung bình</li>
                  <li><strong>Sốt nhẹ:</strong> Thường dưới 38.5°C</li>
                  <li><strong>Sưng hạch cổ:</strong> Hạch lympho sưng to</li>
                  <li><strong>Khó thở:</strong> Do giả mạc che lấp đường thở</li>
                  <li><strong>Khàn giọng:</strong> Khi thanh quản bị ảnh hưởng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng toàn thân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Mệt mỏi, suy nhược</li>
                  <li>Chán ăn</li>
                  <li>Nhịp tim nhanh</li>
                  <li>Huyết áp thấp</li>
                  <li>Da xanh xao</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng biến chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Viêm cơ tim:</strong> Đau ngực, khó thở, suy tim</li>
                  <li><strong>Liệt thần kinh:</strong> Liệt cơ mắt, nuốt, hô hấp</li>
                  <li><strong>Suy thận:</strong> Giảm lượng nước tiểu</li>
                  <li><strong>Tắc nghẽn đường thở:</strong> Khó thở nặng, tím tái</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bạch hầu do vi khuẩn Corynebacterium diphtheriae gây ra. Vi khuẩn này sản xuất ngoại độc tố 
                  mạnh có thể gây tổn thương nghiêm trọng đến các cơ quan quan trọng của cơ thể.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vi khuẩn gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Corynebacterium diphtheriae:</strong> Vi khuẩn Gram dương</li>
                  <li><strong>Hình dạng:</strong> Hình que, không di động</li>
                  <li><strong>Khả năng sản xuất độc tố:</strong> Chỉ một số chủng có khả năng này</li>
                  <li><strong>Điều kiện sống:</strong> Ưa khí, nhiệt độ 37°C</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ngoại độc tố:</strong> Độc tố mạnh nhất được biết đến</li>
                  <li><strong>Tác động lên tim:</strong> Gây viêm cơ tim, suy tim</li>
                  <li><strong>Tác động lên thần kinh:</strong> Gây liệt các dây thần kinh</li>
                  <li><strong>Tác động lên thận:</strong> Gây suy thận</li>
                  <li><strong>Giả mạc:</strong> Ngăn cản hô hấp và nuốt</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số nhóm đối tượng có nguy cơ cao mắc bạch hầu và gặp biến chứng nặng. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nhóm nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em chưa tiêm vaccine:</strong> Dưới 5 tuổi</li>
                  <li><strong>Người chưa tiêm đủ liều:</strong> Vaccine không đầy đủ</li>
                  <li><strong>Người suy giảm miễn dịch:</strong> HIV, ung thư</li>
                  <li><strong>Người cao tuổi:</strong> Hệ miễn dịch suy yếu</li>
                  <li><strong>Phụ nữ mang thai:</strong> Nguy cơ biến chứng cao</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố làm tăng nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sống trong môi trường đông đúc</li>
                  <li>Điều kiện vệ sinh kém</li>
                  <li>Suy dinh dưỡng</li>
                  <li>Tiếp xúc với người bệnh</li>
                  <li>Du lịch đến vùng có dịch</li>
                  <li>Không có miễn dịch tự nhiên</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bạch hầu dựa trên lâm sàng và xét nghiệm vi sinh. Việc chẩn đoán sớm rất quan trọng 
                  để điều trị kịp thời và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giả mạc đặc trưng:</strong> Màng dày, trắng ngà, bám chặt</li>
                  <li><strong>Vị trí:</strong> Họng, amidan, thanh quản, mũi</li>
                  <li><strong>Sưng hạch cổ:</strong> Hạch lympho sưng to</li>
                  <li><strong>Triệu chứng toàn thân:</strong> Sốt nhẹ, mệt mỏi</li>
                  <li><strong>Tiền sử:</strong> Tiếp xúc với người bệnh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nuôi cấy vi khuẩn:</strong> Xét nghiệm quan trọng nhất</li>
                  <li><strong>Nhuộm Gram:</strong> Phát hiện vi khuẩn Gram dương</li>
                  <li><strong>Xét nghiệm độc tố:</strong> Phát hiện ngoại độc tố</li>
                  <li><strong>PCR:</strong> Phát hiện DNA vi khuẩn</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu, CRP</li>
                  <li><strong>Điện tâm đồ:</strong> Phát hiện viêm cơ tim</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vaccine là biện pháp phòng ngừa hiệu quả nhất cho bạch hầu. Ngoài ra, các biện pháp 
                  vệ sinh và cách ly cũng quan trọng trong việc ngăn chặn sự lây lan của bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêm vaccine:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>DPT vaccine:</strong> Phòng bạch hầu, ho gà, uốn ván</li>
                  <li><strong>DT vaccine:</strong> Chỉ phòng bạch hầu và uốn ván</li>
                  <li><strong>Lịch tiêm:</strong> 2, 3, 4 tháng và 16-18 tháng tuổi</li>
                  <li><strong>Tiêm nhắc lại:</strong> 4-6 tuổi và 11-12 tuổi</li>
                  <li><strong>Hiệu quả:</strong> 95% sau tiêm đủ liều</li>
                  <li><strong>Miễn dịch:</strong> Kéo dài 10 năm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Cách ly người bệnh trong thời gian lây nhiễm</li>
                  <li>Vệ sinh tay thường xuyên</li>
                  <li>Đeo khẩu trang khi tiếp xúc</li>
                  <li>Tránh tiếp xúc với người bệnh</li>
                  <li>Khử trùng đồ vật và môi trường</li>
                  <li>Giữ môi trường sạch sẽ, thông thoáng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bạch hầu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị bạch hầu cần được thực hiện ngay lập tức để ngăn ngừa biến chứng nghiêm trọng. 
                  Điều trị bao gồm kháng độc tố, kháng sinh và hỗ trợ triệu chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị đặc hiệu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng độc tố:</strong> Trung hòa ngoại độc tố</li>
                  <li><strong>Kháng sinh:</strong> Penicillin hoặc erythromycin</li>
                  <li><strong>Thời gian:</strong> 14 ngày điều trị kháng sinh</li>
                  <li><strong>Liều lượng:</strong> Theo cân nặng và độ tuổi</li>
                  <li><strong>Đường dùng:</strong> Tiêm tĩnh mạch hoặc uống</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hô hấp:</strong> Thở oxy, đặt nội khí quản nếu cần</li>
                  <li><strong>Tim mạch:</strong> Theo dõi điện tâm đồ, điều trị suy tim</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn qua ống thông nếu cần</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi tuyệt đối</li>
                  <li><strong>Theo dõi:</strong> Theo dõi các biến chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khi nào cần nhập viện:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Có giả mạc ở đường thở</li>
                  <li>Khó thở, tím tái</li>
                  <li>Biến chứng tim mạch</li>
                  <li>Biến chứng thần kinh</li>
                  <li>Trẻ em dưới 5 tuổi</li>
                  <li>Người suy giảm miễn dịch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
