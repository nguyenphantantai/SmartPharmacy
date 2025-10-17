import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function COPDDiseasePage() {
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
    "Bệnh Hô Hấp",
    "Bệnh Tai Mũi Họng", 
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì",
    "Tai Mũi Họng",
    "Bệnh Trẻ Em"
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
                <BreadcrumbPage>Bệnh phổi tắc nghẽn mạn tính (COPD)</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">09/10/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh phổi tắc nghẽn mạn tính (COPD): Nguyên nhân và triệu chứng
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan về COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh phổi tắc nghẽn mạn tính (COPD) là một nhóm các bệnh phổi bao gồm khí phế thũng và viêm phế quản mạn tính. 
                  COPD làm cho việc thở trở nên khó khăn hơn theo thời gian và có thể dẫn đến các biến chứng nghiêm trọng.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  COPD là nguyên nhân gây tử vong đứng hàng thứ 3 trên thế giới và là nguyên nhân chính gây tàn tật ở người trưởng thành. 
                  Bệnh thường phát triển ở những người hút thuốc lá lâu năm hoặc tiếp xúc với các chất kích thích phổi khác.
                </p>
                <h3 className="text-xl font-semibold mb-3">Các loại COPD chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Khí phế thũng:</strong> Phá hủy các túi khí nhỏ trong phổi, làm giảm khả năng trao đổi oxy</li>
                  <li><strong>Viêm phế quản mạn tính:</strong> Viêm và thu hẹp đường thở, gây ho và khó thở</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Các triệu chứng của COPD thường phát triển từ từ và có thể không được chú ý trong giai đoạn đầu. 
                  Triệu chứng có xu hướng xấu đi theo thời gian, đặc biệt là khi tiếp tục hút thuốc.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khó thở:</strong> Đặc biệt khi hoạt động thể chất</li>
                  <li><strong>Ho mạn tính:</strong> Thường có đờm</li>
                  <li><strong>Thở khò khè:</strong> Tiếng rít khi thở</li>
                  <li><strong>Tức ngực:</strong> Cảm giác nặng nề ở ngực</li>
                  <li><strong>Mệt mỏi:</strong> Thiếu năng lượng</li>
                  <li><strong>Nhiễm trùng đường hô hấp thường xuyên:</strong> Cảm lạnh, cúm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nặng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sụt cân không rõ nguyên nhân</li>
                  <li>Sưng mắt cá chân, bàn chân hoặc chân</li>
                  <li>Môi hoặc móng tay có màu xanh (thiếu oxy)</li>
                  <li>Khó thở ngay cả khi nghỉ ngơi</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  COPD chủ yếu do tổn thương phổi lâu dài từ các chất kích thích. 
                  Nguyên nhân phổ biến nhất là hút thuốc lá, nhưng cũng có các yếu tố khác.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hút thuốc lá:</strong> Nguyên nhân phổ biến nhất (80-90% trường hợp)</li>
                  <li><strong>Hút thuốc thụ động:</strong> Tiếp xúc với khói thuốc</li>
                  <li><strong>Ô nhiễm không khí:</strong> Khói bụi, hóa chất công nghiệp</li>
                  <li><strong>Tiếp xúc nghề nghiệp:</strong> Bụi than, silica, amiăng</li>
                  <li><strong>Nhiễm trùng đường hô hấp:</strong> Viêm phổi, viêm phế quản tái phát</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố di truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Thiếu hụt alpha-1 antitrypsin:</strong> Protein bảo vệ phổi</li>
                  <li><strong>Tiền sử gia đình:</strong> COPD có thể có yếu tố di truyền</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao hơn phát triển COPD. 
                  Hiểu biết về các yếu tố nguy cơ có thể giúp phòng ngừa và phát hiện sớm.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Thường phát triển sau 40 tuổi</li>
                  <li><strong>Giới tính:</strong> Nam giới có nguy cơ cao hơn</li>
                  <li><strong>Hút thuốc:</strong> Nguy cơ tăng theo số năm hút thuốc</li>
                  <li><strong>Tiếp xúc nghề nghiệp:</strong> Công nhân mỏ, xây dựng</li>
                  <li><strong>Ô nhiễm môi trường:</strong> Sống ở khu vực ô nhiễm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tiền sử hen suyễn</li>
                  <li>Nhiễm trùng đường hô hấp thường xuyên</li>
                  <li>Sinh non hoặc nhẹ cân</li>
                  <li>Tiền sử gia đình có COPD</li>
                  <li>Suy dinh dưỡng</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán COPD dựa trên triệu chứng, tiền sử tiếp xúc với các yếu tố nguy cơ và các xét nghiệm chức năng phổi. 
                  Chẩn đoán sớm rất quan trọng để điều trị hiệu quả.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Các xét nghiệm chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đo chức năng phổi (Spirometry):</strong> Xét nghiệm chính để chẩn đoán COPD</li>
                  <li><strong>X-quang ngực:</strong> Loại trừ các bệnh phổi khác</li>
                  <li><strong>CT scan:</strong> Đánh giá chi tiết cấu trúc phổi</li>
                  <li><strong>Xét nghiệm máu:</strong> Kiểm tra nồng độ oxy và CO2</li>
                  <li><strong>Đo nồng độ alpha-1 antitrypsin:</strong> Xét nghiệm di truyền</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phân độ COPD:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Giai đoạn 1 (Nhẹ):</strong> FEV1 ≥ 80% giá trị dự đoán</li>
                  <li><strong>Giai đoạn 2 (Trung bình):</strong> FEV1 50-79% giá trị dự đoán</li>
                  <li><strong>Giai đoạn 3 (Nặng):</strong> FEV1 30-49% giá trị dự đoán</li>
                  <li><strong>Giai đoạn 4 (Rất nặng):</strong> FEV1 &lt; 30% giá trị dự đoán</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  COPD có thể phòng ngừa được bằng cách tránh các yếu tố nguy cơ chính. 
                  Phòng ngừa là cách tốt nhất để bảo vệ sức khỏe phổi.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Các biện pháp phòng ngừa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bỏ hút thuốc:</strong> Biện pháp quan trọng nhất</li>
                  <li><strong>Tránh hút thuốc thụ động:</strong> Không ở gần người hút thuốc</li>
                  <li><strong>Bảo vệ tại nơi làm việc:</strong> Sử dụng thiết bị bảo hộ</li>
                  <li><strong>Tránh ô nhiễm không khí:</strong> Kiểm tra chất lượng không khí</li>
                  <li><strong>Tiêm phòng:</strong> Cúm và viêm phổi</li>
                  <li><strong>Tập thể dục thường xuyên:</strong> Cải thiện chức năng phổi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Lời khuyên cho người có nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kiểm tra sức khỏe định kỳ</li>
                  <li>Đo chức năng phổi hàng năm</li>
                  <li>Tránh các chất kích thích</li>
                  <li>Duy trì lối sống lành mạnh</li>
                  <li>Quản lý stress</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị COPD</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù COPD không thể chữa khỏi hoàn toàn, nhưng điều trị có thể giúp kiểm soát triệu chứng, 
                  làm chậm tiến triển bệnh và cải thiện chất lượng cuộc sống.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị bằng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc giãn phế quản:</strong> Cải thiện luồng không khí</li>
                  <li><strong>Thuốc corticosteroid:</strong> Giảm viêm đường thở</li>
                  <li><strong>Thuốc kết hợp:</strong> Phối hợp nhiều loại thuốc</li>
                  <li><strong>Thuốc kháng sinh:</strong> Điều trị nhiễm trùng</li>
                  <li><strong>Vaccine:</strong> Phòng ngừa cúm và viêm phổi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị không dùng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Liệu pháp oxy:</strong> Cung cấp oxy bổ sung</li>
                  <li><strong>Phục hồi chức năng phổi:</strong> Tập thể dục và giáo dục</li>
                  <li><strong>Phẫu thuật:</strong> Trong trường hợp nặng</li>
                  <li><strong>Thay đổi lối sống:</strong> Bỏ thuốc, tập thể dục</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Quản lý tại nhà:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tuân thủ điều trị</li>
                  <li>Theo dõi triệu chứng</li>
                  <li>Tránh các yếu tố kích thích</li>
                  <li>Duy trì hoạt động thể chất</li>
                  <li>Chế độ ăn uống lành mạnh</li>
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
