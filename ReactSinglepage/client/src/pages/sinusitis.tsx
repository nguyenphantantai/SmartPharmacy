import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function SinusitisPage() {
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
    "Tai Mũi Họng"
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
                <BreadcrumbPage>Viêm xoang</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">30/07/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Viêm xoang là gì? Dấu hiệu, nguyên nhân, chẩn đoán và điều trị
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm xoang là tình trạng viêm của các xoang cạnh mũi, là những khoang chứa không khí 
                  nằm phía sau xương gò má và trán. Đây là một bệnh lý phổ biến và ngày càng gia tăng 
                  do ô nhiễm môi trường và thay đổi thời tiết. Nếu không được điều trị đúng cách, viêm xoang 
                  có thể dẫn đến các biến chứng nghiêm trọng.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Bài viết dưới đây sẽ cung cấp thông tin chi tiết về triệu chứng, nguyên nhân, 
                  chẩn đoán và cách điều trị hiệu quả bệnh viêm xoang.
                </p>

                <h3 className="text-xl font-semibold mb-3">Định nghĩa viêm xoang:</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm xoang là tình trạng viêm của các xoang cạnh mũi, là những khoang rỗng chứa không khí 
                  nằm phía sau xương gò má và trán. Có 4 loại xoang chính: xoang trán, xoang sàng, xoang bướm 
                  và xoang hàm trên. Các xoang này được lót bởi niêm mạc và khi bị viêm, niêm mạc này sẽ sưng lên, 
                  dẫn đến tích tụ dịch hoặc chất nhầy, tạo môi trường thuận lợi cho vi khuẩn phát triển và gây nhiễm trùng.
                </p>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Viêm xoang</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của viêm xoang có thể khác nhau tùy thuộc vào loại xoang bị ảnh hưởng và 
                  mức độ nghiêm trọng của tình trạng viêm. Các triệu chứng thường xuất hiện đột ngột và 
                  có thể kéo dài từ vài ngày đến vài tuần.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghẹt mũi:</strong> Nghẹt mũi, khó thở bằng mũi</li>
                  <li><strong>Chảy nước mũi:</strong> Chảy nước mũi đặc, có màu</li>
                  <li><strong>Đau đầu:</strong> Đau đầu, đau mặt</li>
                  <li><strong>Đau mặt:</strong> Đau vùng mặt, đặc biệt là vùng xoang</li>
                  <li><strong>Giảm khứu giác:</strong> Giảm hoặc mất khứu giác</li>
                  <li><strong>Ho:</strong> Ho, đặc biệt vào ban đêm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo vị trí xoang:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Xoang trán:</strong> Đau trán, đau đầu</li>
                  <li><strong>Xoang hàm:</strong> Đau má, đau răng</li>
                  <li><strong>Xoang sàng:</strong> Đau giữa mắt, đau đầu</li>
                  <li><strong>Xoang bướm:</strong> Đau sau đầu, đau cổ</li>
                  <li><strong>Xoang đa:</strong> Đau nhiều vùng</li>
                  <li><strong>Xoang toàn:</strong> Đau toàn bộ mặt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sốt:</strong> Sốt nhẹ đến sốt cao</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi, khó chịu</li>
                  <li><strong>Hơi thở:</strong> Hơi thở hôi</li>
                  <li><strong>Đau tai:</strong> Đau tai, ù tai</li>
                  <li><strong>Đau họng:</strong> Đau họng</li>
                  <li><strong>Buồn nôn:</strong> Buồn nôn</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Viêm xoang</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm xoang có thể do nhiều nguyên nhân khác nhau, từ nhiễm trùng đến các yếu tố môi trường. 
                  Hiểu biết về nguyên nhân giúp có biện pháp điều trị và phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân nhiễm trùng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus:</strong> Virus cảm lạnh, virus cúm</li>
                  <li><strong>Vi khuẩn:</strong> Streptococcus, Staphylococcus</li>
                  <li><strong>Nấm:</strong> Nấm Aspergillus, Candida</li>
                  <li><strong>Ký sinh trùng:</strong> Ký sinh trùng (hiếm)</li>
                  <li><strong>Vi khuẩn kháng thuốc:</strong> Vi khuẩn kháng thuốc</li>
                  <li><strong>Nhiễm trùng hỗn hợp:</strong> Nhiễm trùng hỗn hợp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân cơ học:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Polyp mũi:</strong> Polyp mũi</li>
                  <li><strong>Lệch vách ngăn:</strong> Lệch vách ngăn mũi</li>
                  <li><strong>Dị vật:</strong> Dị vật trong mũi</li>
                  <li><strong>Khối u:</strong> Khối u trong mũi</li>
                  <li><strong>Chấn thương:</strong> Chấn thương mũi</li>
                  <li><strong>Phẫu thuật:</strong> Phẫu thuật mũi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Dị ứng</li>
                  <li>Hen suyễn</li>
                  <li>Hút thuốc</li>
                  <li>Ô nhiễm môi trường</li>
                  <li>Thay đổi thời tiết</li>
                  <li>Hệ miễn dịch yếu</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc viêm xoang hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dị ứng:</strong> Dị ứng mũi, dị ứng thức ăn</li>
                  <li><strong>Hen suyễn:</strong> Hen suyễn</li>
                  <li><strong>Polyp mũi:</strong> Polyp mũi</li>
                  <li><strong>Lệch vách ngăn:</strong> Lệch vách ngăn mũi</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc</li>
                  <li><strong>Ô nhiễm:</strong> Ô nhiễm môi trường</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ em, người cao tuổi</li>
                  <li><strong>Giới tính:</strong> Nữ giới</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Thiếu ngủ:</strong> Thiếu ngủ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh mũi thường xuyên</li>
                  <li>Tránh dị ứng</li>
                  <li>Không hút thuốc</li>
                  <li>Tránh ô nhiễm</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Tập thể dục</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Viêm xoang</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán viêm xoang dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử bệnh</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám mũi:</strong> Khám mũi</li>
                  <li><strong>Khám họng:</strong> Khám họng</li>
                  <li><strong>Khám tai:</strong> Khám tai</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nội soi mũi:</strong> Nội soi mũi</li>
                  <li><strong>CT scan:</strong> Chụp cắt lớp</li>
                  <li><strong>MRI:</strong> Chụp cộng hưởng từ</li>
                  <li><strong>X-quang:</strong> Chụp X-quang</li>
                  <li><strong>Cấy dịch:</strong> Cấy dịch mũi</li>
                  <li><strong>Xét nghiệm máu:</strong> Xét nghiệm máu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Triệu chứng điển hình</li>
                  <li><strong>Khám:</strong> Khám lâm sàng</li>
                  <li><strong>Xét nghiệm:</strong> Xét nghiệm hỗ trợ</li>
                  <li><strong>Loại trừ:</strong> Loại trừ bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Viêm xoang</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa viêm xoang tập trung vào việc vệ sinh mũi và tránh các yếu tố nguy cơ. 
                  Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh mũi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa mũi:</strong> Rửa mũi bằng nước muối</li>
                  <li><strong>Xịt mũi:</strong> Xịt mũi thường xuyên</li>
                  <li><strong>Hút mũi:</strong> Hút mũi cho trẻ em</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh mũi hàng ngày</li>
                  <li><strong>Tránh:</strong> Tránh kích thích mũi</li>
                  <li><strong>Bảo vệ:</strong> Bảo vệ mũi khỏi ô nhiễm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tránh yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dị ứng:</strong> Tránh dị ứng</li>
                  <li><strong>Hút thuốc:</strong> Không hút thuốc</li>
                  <li><strong>Ô nhiễm:</strong> Tránh ô nhiễm</li>
                  <li><strong>Thời tiết:</strong> Bảo vệ khỏi thay đổi thời tiết</li>
                  <li><strong>Stress:</strong> Giảm stress</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng tốt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tập thể dục thường xuyên</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Uống nhiều nước</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Điều trị dị ứng</li>
                  <li>Tiêm phòng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Viêm xoang</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị viêm xoang bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm triệu chứng, loại bỏ nhiễm trùng và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc giảm đau:</strong> Paracetamol, ibuprofen</li>
                  <li><strong>Thuốc kháng viêm:</strong> NSAIDs</li>
                  <li><strong>Thuốc thông mũi:</strong> Thuốc thông mũi</li>
                  <li><strong>Thuốc kháng histamine:</strong> Thuốc kháng histamine</li>
                  <li><strong>Thuốc xịt mũi:</strong> Thuốc xịt mũi</li>
                  <li><strong>Thuốc khác:</strong> Thuốc hỗ trợ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị căn nguyên:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng sinh:</strong> Kháng sinh (nếu do vi khuẩn)</li>
                  <li><strong>Kháng virus:</strong> Kháng virus (nếu do virus)</li>
                  <li><strong>Kháng nấm:</strong> Kháng nấm (nếu do nấm)</li>
                  <li><strong>Thuốc khác:</strong> Thuốc đặc hiệu</li>
                  <li><strong>Liệu pháp:</strong> Liệu pháp hỗ trợ</li>
                  <li><strong>Điều trị:</strong> Điều trị biến chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị phẫu thuật:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nội soi:</strong> Phẫu thuật nội soi xoang</li>
                  <li><strong>Cắt polyp:</strong> Cắt polyp mũi</li>
                  <li><strong>Sửa vách ngăn:</strong> Sửa vách ngăn mũi</li>
                  <li><strong>Mở thông:</strong> Mở thông xoang</li>
                  <li><strong>Cắt bỏ:</strong> Cắt bỏ phần bị tổn thương</li>
                  <li><strong>Hỗ trợ:</strong> Hỗ trợ sau phẫu thuật</li>
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
