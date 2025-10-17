import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function FluDiseasePage() {
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
                <BreadcrumbPage>Bệnh cúm</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">25/04/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh cúm là gì? Nguyên nhân, triệu chứng và cách điều trị
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung về bệnh cúm</h2>
                <h3 className="text-xl font-semibold mb-3">Bệnh cúm là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cúm là bệnh nhiễm trùng đường hô hấp gây ra do virus cúm (Influenza virus) với các biểu hiện sốt, 
                  đau đầu, đau cơ, mệt mỏi, sổ mũi, đau họng và ho. Bệnh cúm nguy hiểm là do tính lây lan nhanh 
                  và gây thành dịch. Bệnh có thể xảy ra dưới nhiều mức độ khác nhau: đại dịch, dịch, dịch nhỏ 
                  địa phương và các trường hợp tản phát.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Thống kê của Tổ chức Y tế Thế giới (WHO) cho thấy, hàng năm thế giới có khoảng 5-10% người lớn 
                  và 20-30% trẻ em bị nhiễm cúm, trong đó, có khoảng nửa triệu người tử vong do những vấn đề sức 
                  khỏe liên quan đến bệnh cúm.
                </p>
                <h3 className="text-xl font-semibold mb-3">Các loại virus cúm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Cúm A:</strong> Gây đại dịch, có nhiều chủng phụ (H1N1, H3N2, H5N1)</li>
                  <li><strong>Cúm B:</strong> Gây dịch theo mùa, ít biến đổi hơn</li>
                  <li><strong>Cúm C:</strong> Triệu chứng nhẹ, ít phổ biến</li>
                  <li><strong>Cúm D:</strong> Chủ yếu ảnh hưởng đến gia súc</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh cúm</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của cúm thường xuất hiện đột ngột và nghiêm trọng hơn cảm lạnh thông thường. 
                  Thời gian ủ bệnh từ 1-4 ngày, trung bình 2 ngày.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng điển hình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> 38-40°C, có thể kéo dài 3-4 ngày</li>
                  <li><strong>Ớn lạnh:</strong> Cảm giác lạnh run</li>
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Đau cơ:</strong> Đau toàn thân, đặc biệt ở lưng và chân</li>
                  <li><strong>Mệt mỏi:</strong> Suy nhược nghiêm trọng</li>
                  <li><strong>Ho khan:</strong> Ho liên tục</li>
                  <li><strong>Đau họng:</strong> Cảm giác đau rát</li>
                  <li><strong>Sổ mũi:</strong> Chảy nước mũi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở trẻ em:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Sốt cao hơn người lớn</li>
                  <li>Buồn nôn, nôn</li>
                  <li>Tiêu chảy</li>
                  <li>Quấy khóc, bỏ ăn</li>
                  <li>Khó thở</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khó thở, thở nhanh</li>
                  <li>Đau ngực</li>
                  <li>Chóng mặt đột ngột</li>
                  <li>Lú lẫn</li>
                  <li>Nôn mửa nghiêm trọng</li>
                  <li>Sốt cao không hạ</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh cúm</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh cúm do virus cúm (Influenza virus) gây ra. Virus này có khả năng biến đổi nhanh chóng, 
                  tạo ra các chủng mới và gây ra các đợt dịch theo mùa hoặc đại dịch.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Đặc điểm virus cúm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cấu trúc:</strong> Virus RNA sợi đơn, có vỏ bọc</li>
                  <li><strong>Kích thước:</strong> 80-120 nm</li>
                  <li><strong>Khả năng biến đổi:</strong> Antigenic drift và shift</li>
                  <li><strong>Khả năng sống:</strong> Có thể sống trên bề mặt vài giờ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đường hô hấp:</strong> Qua giọt bắn khi ho, hắt hơi</li>
                  <li><strong>Tiếp xúc trực tiếp:</strong> Với dịch tiết của người bệnh</li>
                  <li><strong>Tiếp xúc gián tiếp:</strong> Qua đồ vật bị nhiễm</li>
                  <li><strong>Thời gian lây:</strong> Từ 1 ngày trước đến 5-7 ngày sau khi có triệu chứng</li>
                  <li><strong>Trẻ em:</strong> Có thể lây lâu hơn (10 ngày)</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số nhóm đối tượng có nguy cơ cao mắc cúm và gặp biến chứng nghiêm trọng. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nhóm nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 5 tuổi, đặc biệt dưới 2 tuổi</li>
                  <li><strong>Người cao tuổi:</strong> Trên 65 tuổi</li>
                  <li><strong>Phụ nữ mang thai:</strong> Nguy cơ biến chứng cao</li>
                  <li><strong>Người suy giảm miễn dịch:</strong> HIV, ung thư, điều trị ức chế miễn dịch</li>
                  <li><strong>Bệnh mạn tính:</strong> Tim mạch, phổi, tiểu đường, thận</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố làm tăng nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sống trong môi trường đông đúc</li>
                  <li>Làm việc trong môi trường y tế</li>
                  <li>Du lịch đến vùng có dịch</li>
                  <li>Tiếp xúc với người bệnh</li>
                  <li>Không tiêm vaccine</li>
                  <li>Hút thuốc lá</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh cúm</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán cúm chủ yếu dựa trên lâm sàng, đặc biệt trong mùa dịch. Tuy nhiên, trong một số 
                  trường hợp cần xét nghiệm để xác định chính xác loại virus và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Triệu chứng điển hình:</strong> Sốt cao, đau đầu, đau cơ, mệt mỏi</li>
                  <li><strong>Khởi phát đột ngột:</strong> Triệu chứng xuất hiện nhanh</li>
                  <li><strong>Thời gian:</strong> Trong mùa dịch cúm</li>
                  <li><strong>Tiền sử:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Phân biệt:</strong> Khác với cảm lạnh thông thường</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Rapid influenza test:</strong> Kết quả trong 15-30 phút</li>
                  <li><strong>RT-PCR:</strong> Xét nghiệm chính xác nhất</li>
                  <li><strong>Nuôi cấy virus:</strong> Xác định chủng virus</li>
                  <li><strong>Xét nghiệm kháng thể:</strong> Đánh giá miễn dịch</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu, CRP</li>
                  <li><strong>X-quang ngực:</strong> Phát hiện biến chứng phổi</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh cúm</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vaccine là biện pháp phòng ngừa hiệu quả nhất cho cúm. Ngoài ra, các biện pháp vệ sinh 
                  và cách ly cũng quan trọng trong việc ngăn chặn sự lây lan của bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêm vaccine:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vaccine cúm theo mùa:</strong> Tiêm hàng năm</li>
                  <li><strong>Thời gian tiêm:</strong> Trước mùa dịch (tháng 9-11)</li>
                  <li><strong>Hiệu quả:</strong> 40-60% giảm nguy cơ mắc bệnh</li>
                  <li><strong>Đối tượng:</strong> Tất cả từ 6 tháng tuổi trở lên</li>
                  <li><strong>Loại vaccine:</strong> Tiêm hoặc xịt mũi</li>
                  <li><strong>An toàn:</strong> Rất ít tác dụng phụ nghiêm trọng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh tay thường xuyên với xà phòng</li>
                  <li>Tránh tiếp xúc gần với người bệnh</li>
                  <li>Đeo khẩu trang khi cần thiết</li>
                  <li>Che miệng khi ho hoặc hắt hơi</li>
                  <li>Tránh chạm tay vào mắt, mũi, miệng</li>
                  <li>Làm sạch và khử trùng bề mặt</li>
                  <li>Nghỉ ở nhà khi bị bệnh</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh cúm</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị cúm chủ yếu là hỗ trợ triệu chứng và nghỉ ngơi. Trong một số trường hợp có thể 
                  sử dụng thuốc kháng virus để giảm thời gian bệnh và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nhiều nước:</strong> Tránh mất nước</li>
                  <li><strong>Hạ sốt:</strong> Paracetamol, ibuprofen</li>
                  <li><strong>Giảm đau:</strong> Thuốc giảm đau không kê đơn</li>
                  <li><strong>Giảm ho:</strong> Thuốc ho, mật ong</li>
                  <li><strong>Thông mũi:</strong> Thuốc thông mũi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc kháng virus:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Oseltamivir (Tamiflu):</strong> Thuốc uống</li>
                  <li><strong>Zanamivir (Relenza):</strong> Thuốc hít</li>
                  <li><strong>Peramivir:</strong> Thuốc tiêm</li>
                  <li><strong>Baloxavir:</strong> Thuốc uống một liều</li>
                  <li><strong>Thời gian:</strong> Bắt đầu trong 48 giờ đầu</li>
                  <li><strong>Hiệu quả:</strong> Giảm thời gian bệnh 1-2 ngày</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khi nào cần đi khám:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Triệu chứng nghiêm trọng</li>
                  <li>Sốt cao không hạ</li>
                  <li>Khó thở</li>
                  <li>Đau ngực</li>
                  <li>Chóng mặt đột ngột</li>
                  <li>Lú lẫn</li>
                  <li>Nôn mửa nghiêm trọng</li>
                  <li>Triệu chứng cải thiện rồi tái phát</li>
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
