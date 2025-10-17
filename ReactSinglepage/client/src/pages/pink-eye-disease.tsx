import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function PinkEyeDiseasePage() {
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
    "Bệnh Về Mắt",
    "Bệnh Theo Mùa", 
    "Bệnh Trẻ Em",
    "Bệnh Truyền Nhiễm",
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
                <BreadcrumbPage>Đau mắt đỏ</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">11/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh đau mắt đỏ: Triệu chứng, nguyên nhân và lưu ý cần biết
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
                <h2 className="text-2xl font-bold mb-4">Bệnh đau mắt đỏ là gì?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Đau mắt đỏ hay còn được gọi là bệnh viêm kết mạc. Là tình trạng nhiễm trùng mắt, thường do vi khuẩn 
                  hoặc virus gây ra hoặc do phản ứng dị ứng, với triệu chứng đặc trưng là đỏ mắt. Bệnh thường khởi phát 
                  đột ngột, lúc đầu ở một mắt sau lan sang mắt bên kia. Bệnh đau mắt đỏ rất dễ mắc, dễ lây lan trong 
                  cộng đồng và gây thành dịch.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cho đến nay chưa có vắc xin phòng bệnh, chưa có thuốc điều trị đặc hiệu và những người bị đau mắt đỏ 
                  rồi vẫn có thể bị nhiễm lại chỉ sau vài tháng khỏi bệnh.
                </p>               

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Viêm kết mạc (Conjunctivitis)</li>
                  <li><strong>Triệu chứng chính:</strong> Đỏ mắt, ngứa, chảy nước mắt</li>
                  <li><strong>Tính lây lan:</strong> Rất cao, dễ bùng phát thành dịch</li>
                  <li><strong>Thời gian bệnh:</strong> 7-14 ngày</li>
                  <li><strong>Biến chứng:</strong> Hiếm khi nghiêm trọng</li>
                  <li><strong>Tái nhiễm:</strong> Có thể mắc lại nhiều lần</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh đau mắt đỏ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của đau mắt đỏ thường xuất hiện đột ngột và có thể khác nhau tùy theo nguyên nhân gây bệnh. 
                  Bệnh thường bắt đầu ở một mắt và lan sang mắt còn lại trong vòng 1-2 ngày.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đỏ mắt:</strong> Mắt đỏ rõ rệt, có thể đỏ toàn bộ hoặc một phần</li>
                  <li><strong>Ngứa mắt:</strong> Cảm giác ngứa, khó chịu</li>
                  <li><strong>Chảy nước mắt:</strong> Nước mắt chảy nhiều</li>
                  <li><strong>Cảm giác cộm:</strong> Như có vật lạ trong mắt</li>
                  <li><strong>Nhạy cảm với ánh sáng:</strong> Sợ ánh sáng</li>
                  <li><strong>Sưng mí mắt:</strong> Mí mắt có thể sưng nhẹ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo nguyên nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Do virus:</strong> Chảy nước mắt nhiều, ngứa nhẹ</li>
                  <li><strong>Do vi khuẩn:</strong> Có ghèn vàng/xanh, dính mí mắt</li>
                  <li><strong>Do dị ứng:</strong> Ngứa nhiều, chảy nước mắt</li>
                  <li><strong>Do hóa chất:</strong> Đau rát, chảy nước mắt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Đau mắt dữ dội</li>
                  <li>Nhìn mờ hoặc mất thị lực</li>
                  <li>Sốt cao</li>
                  <li>Đau đầu nghiêm trọng</li>
                  <li>Buồn nôn, nôn</li>
                  <li>Triệu chứng không cải thiện sau 3-4 ngày</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh đau mắt đỏ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Đau mắt đỏ có thể do nhiều nguyên nhân khác nhau, từ virus, vi khuẩn đến dị ứng và các tác nhân 
                  hóa học. Hiểu rõ nguyên nhân giúp có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus:</strong> Adenovirus, Enterovirus (phổ biến nhất)</li>
                  <li><strong>Vi khuẩn:</strong> Staphylococcus, Streptococcus, Haemophilus</li>
                  <li><strong>Dị ứng:</strong> Phấn hoa, bụi, lông động vật</li>
                  <li><strong>Hóa chất:</strong> Khói, chất tẩy rửa, mỹ phẩm</li>
                  <li><strong>Ký sinh trùng:</strong> Chlamydia trachomatis</li>
                  <li><strong>Nấm:</strong> Candida, Aspergillus (hiếm)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tiếp xúc trực tiếp:</strong> Với dịch tiết của người bệnh</li>
                  <li><strong>Tiếp xúc gián tiếp:</strong> Qua đồ vật bị nhiễm</li>
                  <li><strong>Đường hô hấp:</strong> Qua giọt bắn khi ho, hắt hơi</li>
                  <li><strong>Nước bị nhiễm:</strong> Bể bơi, nước sinh hoạt</li>
                  <li><strong>Thời gian lây:</strong> Từ 1-2 ngày trước đến 7-14 ngày sau khi có triệu chứng</li>
                  <li><strong>Môi trường:</strong> Không khí, bụi, phấn hoa</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù đau mắt đỏ có thể xảy ra ở mọi lứa tuổi, nhưng một số nhóm đối tượng có nguy cơ cao hơn 
                  và dễ gặp biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nhóm nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 5 tuổi, hệ miễn dịch chưa hoàn thiện</li>
                  <li><strong>Người cao tuổi:</strong> Trên 65 tuổi, hệ miễn dịch suy yếu</li>
                  <li><strong>Người suy giảm miễn dịch:</strong> HIV, ung thư, điều trị ức chế miễn dịch</li>
                  <li><strong>Người có bệnh mắt:</strong> Khô mắt, viêm mí mắt</li>
                  <li><strong>Người đeo kính áp tròng:</strong> Tăng nguy cơ nhiễm trùng</li>
                  <li><strong>Người làm việc trong môi trường ô nhiễm:</strong> Khói, bụi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố làm tăng nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sống trong môi trường đông đúc</li>
                  <li>Tiếp xúc với người bệnh</li>
                  <li>Không rửa tay thường xuyên</li>
                  <li>Sử dụng chung đồ dùng cá nhân</li>
                  <li>Đi bể bơi công cộng</li>
                  <li>Thời tiết thay đổi</li>
                  <li>Ô nhiễm môi trường</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh đau mắt đỏ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán đau mắt đỏ chủ yếu dựa trên lâm sàng. Trong một số trường hợp cần xét nghiệm để 
                  xác định nguyên nhân và có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khám mắt:</strong> Quan sát triệu chứng đỏ mắt, sưng</li>
                  <li><strong>Kiểm tra thị lực:</strong> Đánh giá khả năng nhìn</li>
                  <li><strong>Khám mí mắt:</strong> Kiểm tra sưng, đỏ</li>
                  <li><strong>Kiểm tra đồng tử:</strong> Phản ứng với ánh sáng</li>
                  <li><strong>Tiền sử:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Triệu chứng:</strong> Đỏ mắt, ngứa, chảy nước mắt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nuôi cấy dịch mắt:</strong> Xác định vi khuẩn</li>
                  <li><strong>Xét nghiệm virus:</strong> PCR để phát hiện virus</li>
                  <li><strong>Xét nghiệm dị ứng:</strong> Test da, máu</li>
                  <li><strong>Nhuộm Gram:</strong> Phân biệt vi khuẩn</li>
                  <li><strong>Xét nghiệm kháng thể:</strong> Đánh giá miễn dịch</li>
                  <li><strong>Đo áp lực mắt:</strong> Loại trừ glaucoma</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh đau mắt đỏ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa đau mắt đỏ chủ yếu dựa vào các biện pháp vệ sinh cá nhân và môi trường. 
                  Việc phòng ngừa đúng cách có thể giảm đáng kể nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay thường xuyên:</strong> Với xà phòng, đặc biệt sau khi tiếp xúc</li>
                  <li><strong>Không dụi mắt:</strong> Tránh đưa tay lên mắt</li>
                  <li><strong>Vệ sinh mắt:</strong> Rửa mắt bằng nước sạch</li>
                  <li><strong>Không dùng chung:</strong> Khăn mặt, gối, mỹ phẩm</li>
                  <li><strong>Thay khăn mặt:</strong> Hàng ngày</li>
                  <li><strong>Vệ sinh kính áp tròng:</strong> Đúng cách</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Làm sạch bề mặt thường xuyên</li>
                  <li>Khử trùng đồ dùng cá nhân</li>
                  <li>Giữ môi trường thông thoáng</li>
                  <li>Tránh khói, bụi</li>
                  <li>Cách ly người bệnh</li>
                  <li>Không đi bể bơi khi có dịch</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh đau mắt đỏ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị đau mắt đỏ phụ thuộc vào nguyên nhân gây bệnh. Hầu hết các trường hợp sẽ tự khỏi 
                  trong 7-14 ngày, nhưng điều trị đúng cách có thể giảm triệu chứng và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị theo nguyên nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Do virus:</strong> Điều trị hỗ trợ, nghỉ ngơi</li>
                  <li><strong>Do vi khuẩn:</strong> Kháng sinh nhỏ mắt</li>
                  <li><strong>Do dị ứng:</strong> Thuốc kháng histamine</li>
                  <li><strong>Do hóa chất:</strong> Rửa mắt bằng nước sạch</li>
                  <li><strong>Do ký sinh trùng:</strong> Thuốc đặc hiệu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chườm lạnh:</strong> Giảm sưng, ngứa</li>
                  <li><strong>Nước mắt nhân tạo:</strong> Giảm khô mắt</li>
                  <li><strong>Nghỉ ngơi:</strong> Tránh căng thẳng mắt</li>
                  <li><strong>Tránh ánh sáng:</strong> Đeo kính râm</li>
                  <li><strong>Vệ sinh mắt:</strong> Rửa bằng nước sạch</li>
                  <li><strong>Không trang điểm:</strong> Tránh kích ứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khi nào cần đi khám:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Triệu chứng nghiêm trọng</li>
                  <li>Đau mắt dữ dội</li>
                  <li>Nhìn mờ hoặc mất thị lực</li>
                  <li>Sốt cao</li>
                  <li>Triệu chứng không cải thiện sau 3-4 ngày</li>
                  <li>Trẻ em dưới 2 tuổi</li>
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
