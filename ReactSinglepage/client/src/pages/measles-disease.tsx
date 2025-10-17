import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function MeaslesDiseasePage() {
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
    "Bệnh Truyền Nhiễm",
    "Bệnh Trẻ Em", 
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Theo Bộ Phận Cơ Thể"
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
                <BreadcrumbPage>Bệnh sởi</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">15/03/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh sởi là gì? Nguyên nhân, triệu chứng và cách phòng ngừa
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan về Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh sởi là một bệnh truyền nhiễm cấp tính do virus sởi (Measles virus) gây ra, 
                  đặc trưng bởi sốt cao, phát ban và viêm đường hô hấp. Đây là một trong những bệnh 
                  truyền nhiễm có tính lây lan cao nhất.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù đã có vaccine phòng ngừa hiệu quả, bệnh sởi vẫn là nguyên nhân gây tử vong 
                  hàng đầu ở trẻ em dưới 5 tuổi tại nhiều quốc gia đang phát triển. Bệnh có thể gây 
                  ra các biến chứng nghiêm trọng như viêm phổi, viêm não và tử vong.
                </p>
                <h3 className="text-xl font-semibold mb-3">Đặc điểm của virus sởi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Thuộc họ Paramyxoviridae:</strong> Virus RNA sợi đơn</li>
                  <li><strong>Tính lây lan cao:</strong> R0 = 12-18 (cao nhất trong các bệnh truyền nhiễm)</li>
                  <li><strong>Khả năng sống:</strong> Có thể sống trong không khí đến 2 giờ</li>
                  <li><strong>Miễn dịch:</strong> Sau khi mắc bệnh sẽ có miễn dịch suốt đời</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh sởi có thời gian ủ bệnh từ 7-14 ngày và tiến triển qua các giai đoạn rõ rệt. 
                  Triệu chứng có thể khác nhau tùy theo độ tuổi và tình trạng miễn dịch của người bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Giai đoạn tiền triệu (2-4 ngày):</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> 38-40°C, có thể kéo dài</li>
                  <li><strong>Ho khan:</strong> Ho liên tục, có thể nặng</li>
                  <li><strong>Chảy nước mũi:</strong> Nước mũi trong, nhiều</li>
                  <li><strong>Viêm kết mạc:</strong> Mắt đỏ, sợ ánh sáng</li>
                  <li><strong>Đốm Koplik:</strong> Đốm trắng nhỏ trong miệng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Giai đoạn phát ban (3-5 ngày):</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ban đỏ:</strong> Bắt đầu từ mặt, lan xuống toàn thân</li>
                  <li><strong>Ban không ngứa:</strong> Khác với các bệnh da khác</li>
                  <li><strong>Ban hợp lại:</strong> Các đốm ban có thể hợp thành mảng lớn</li>
                  <li><strong>Sốt tiếp tục:</strong> Sốt có thể tăng cao hơn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Giai đoạn hồi phục:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ban bắt đầu mờ dần từ mặt</li>
                  <li>Sốt giảm dần</li>
                  <li>Ho và các triệu chứng khác cải thiện</li>
                  <li>Da có thể bong vảy nhẹ</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh sởi do virus sởi (Measles virus) gây ra, thuộc chi Morbillivirus trong họ Paramyxoviridae. 
                  Virus này chỉ lây nhiễm ở người và không có vật chủ trung gian.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Đặc điểm virus:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cấu trúc:</strong> Virus RNA sợi đơn, có vỏ bọc</li>
                  <li><strong>Kích thước:</strong> 120-250 nm</li>
                  <li><strong>Khả năng sống:</strong> Chết ở nhiệt độ cao, ánh sáng mặt trời</li>
                  <li><strong>Kháng thuốc:</strong> Không có thuốc kháng virus đặc hiệu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đường hô hấp:</strong> Qua giọt bắn khi ho, hắt hơi</li>
                  <li><strong>Tiếp xúc trực tiếp:</strong> Với dịch tiết của người bệnh</li>
                  <li><strong>Không khí:</strong> Virus có thể tồn tại trong không khí</li>
                  <li><strong>Thời gian lây:</strong> Từ 4 ngày trước đến 4 ngày sau phát ban</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số nhóm đối tượng có nguy cơ cao mắc bệnh sởi và gặp biến chứng nặng. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nhóm nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em chưa tiêm vaccine:</strong> Dưới 12 tháng tuổi</li>
                  <li><strong>Người chưa từng mắc sởi:</strong> Không có miễn dịch tự nhiên</li>
                  <li><strong>Người suy giảm miễn dịch:</strong> HIV, ung thư, điều trị ức chế miễn dịch</li>
                  <li><strong>Phụ nữ mang thai:</strong> Nguy cơ biến chứng cao</li>
                  <li><strong>Người cao tuổi:</strong> Hệ miễn dịch suy yếu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố làm tăng nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sống trong môi trường đông đúc</li>
                  <li>Điều kiện vệ sinh kém</li>
                  <li>Suy dinh dưỡng</li>
                  <li>Thiếu vitamin A</li>
                  <li>Du lịch đến vùng có dịch</li>
                  <li>Tiếp xúc với người bệnh</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bệnh sởi chủ yếu dựa trên lâm sàng, nhưng trong một số trường hợp cần 
                  xét nghiệm để xác định chính xác và loại trừ các bệnh khác.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Triệu chứng điển hình:</strong> Sốt cao, ho, chảy nước mũi, viêm kết mạc</li>
                  <li><strong>Đốm Koplik:</strong> Dấu hiệu đặc trưng trong miệng</li>
                  <li><strong>Ban đỏ:</strong> Phát ban từ mặt lan xuống toàn thân</li>
                  <li><strong>Tiền sử tiếp xúc:</strong> Có tiếp xúc với người bệnh sởi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Xét nghiệm IgM:</strong> Kháng thể đặc hiệu với virus sởi</li>
                  <li><strong>Xét nghiệm IgG:</strong> Đánh giá miễn dịch</li>
                  <li><strong>PCR:</strong> Phát hiện RNA virus</li>
                  <li><strong>Nuôi cấy virus:</strong> Trong phòng thí nghiệm chuyên biệt</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu, CRP</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vaccine là biện pháp phòng ngừa hiệu quả nhất cho bệnh sởi. Ngoài ra, các biện pháp 
                  vệ sinh và cách ly cũng quan trọng trong việc ngăn chặn sự lây lan của bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêm vaccine:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>MMR vaccine:</strong> Phòng sởi, quai bị, rubella</li>
                  <li><strong>Lịch tiêm:</strong> 12-15 tháng tuổi và 4-6 tuổi</li>
                  <li><strong>Hiệu quả:</strong> 95-98% sau 2 liều</li>
                  <li><strong>Miễn dịch:</strong> Suốt đời sau tiêm đủ liều</li>
                  <li><strong>An toàn:</strong> Rất ít tác dụng phụ nghiêm trọng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Cách ly người bệnh trong thời gian lây nhiễm</li>
                  <li>Vệ sinh tay thường xuyên</li>
                  <li>Đeo khẩu trang khi tiếp xúc</li>
                  <li>Tránh tiếp xúc với người bệnh</li>
                  <li>Bổ sung vitamin A cho trẻ em</li>
                  <li>Giữ môi trường sạch sẽ, thông thoáng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh sởi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại chưa có thuốc kháng virus đặc hiệu cho bệnh sởi. Điều trị chủ yếu là 
                  hỗ trợ triệu chứng và ngăn ngừa biến chứng. Việc chăm sóc đúng cách rất quan trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hạ sốt:</strong> Paracetamol, ibuprofen</li>
                  <li><strong>Giảm ho:</strong> Thuốc ho, mật ong (trẻ &gt; 1 tuổi)</li>
                  <li><strong>Bổ sung nước:</strong> Uống đủ nước, điện giải</li>
                  <li><strong>Vitamin A:</strong> Giảm nguy cơ biến chứng</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc tại nhà:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Cách ly trong phòng riêng</li>
                  <li>Giữ môi trường sạch sẽ</li>
                  <li>Ăn uống đầy đủ dinh dưỡng</li>
                  <li>Theo dõi nhiệt độ thường xuyên</li>
                  <li>Vệ sinh mắt, mũi, miệng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khi nào cần nhập viện:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sốt cao không hạ</li>
                  <li>Khó thở, tím tái</li>
                  <li>Co giật</li>
                  <li>Mất nước nặng</li>
                  <li>Biến chứng nghiêm trọng</li>
                  <li>Trẻ em dưới 6 tháng tuổi</li>
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
