import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function BronchitisPage() {
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
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Tai Mũi Họng",
    "Bệnh Trẻ Em",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
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
                <BreadcrumbPage>Viêm phế quản</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">03/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Viêm phế quản là gì? Những điều cần biết về viêm phế quản
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
                  Viêm phế quản là một bệnh lý gặp ở mọi lứa tuổi. Do niêm mạc phế quản bị kích thích sẽ dày lên, 
                  làm hẹp hoặc tắc nghẽn các tiểu phế quản, tăng tiết dịch gây ra ho, có thể kèm theo đờm đặc... 
                  khiến bệnh nhân khó thở. Cùng tìm hiểu về bệnh lý này qua bài viết dưới đây nhé.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm phế quản có thể là cấp tính hoặc mạn tính. Viêm phế quản cấp tính thường do nhiễm virus 
                  và có thể tự khỏi trong vài ngày đến vài tuần. Viêm phế quản mạn tính là một phần của bệnh phổi tắc nghẽn mạn tính (COPD) 
                  và cần điều trị lâu dài.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Bronchitis</li>
                  <li><strong>Tính chất:</strong> Cấp tính hoặc mạn tính</li>
                  <li><strong>Triệu chứng chính:</strong> Ho, đờm, khó thở</li>
                  <li><strong>Thời gian:</strong> Vài ngày đến vài tuần</li>
                  <li><strong>Điều trị:</strong> Hỗ trợ, thuốc</li>
                  <li><strong>Phòng ngừa:</strong> Tránh kích thích</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Viêm phế quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của viêm phế quản có thể khác nhau tùy thuộc vào loại (cấp tính hay mạn tính) và nguyên nhân gây bệnh. 
                  Triệu chứng thường bắt đầu với các dấu hiệu giống cảm lạnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng ban đầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ho:</strong> Ho khan hoặc có đờm</li>
                  <li><strong>Đờm:</strong> Đờm trong hoặc vàng</li>
                  <li><strong>Khó thở:</strong> Thở gấp, thở khò khè</li>
                  <li><strong>Sốt:</strong> Sốt nhẹ</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Đau ngực:</strong> Đau khi ho</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng viêm phế quản cấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ho khan:</strong> Ho không có đờm</li>
                  <li><strong>Ho có đờm:</strong> Đờm trong hoặc vàng</li>
                  <li><strong>Khó thở:</strong> Thở gấp</li>
                  <li><strong>Sốt:</strong> Sốt nhẹ đến vừa</li>
                  <li><strong>Đau họng:</strong> Đau rát họng</li>
                  <li><strong>Nghẹt mũi:</strong> Nghẹt mũi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng viêm phế quản mạn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ho kéo dài:</strong> Ho trên 3 tháng</li>
                  <li><strong>Đờm nhiều:</strong> Đờm đặc, màu vàng</li>
                  <li><strong>Khó thở:</strong> Khó thở khi vận động</li>
                  <li><strong>Thở khò khè:</strong> Tiếng thở bất thường</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi kéo dài</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng tái phát</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Viêm phế quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm phế quản có thể do nhiều nguyên nhân khác nhau, từ nhiễm trùng đến các yếu tố môi trường. 
                  Hiểu rõ nguyên nhân giúp có phương pháp điều trị và phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân viêm phế quản cấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus:</strong> Rhinovirus, coronavirus</li>
                  <li><strong>Vi khuẩn:</strong> Streptococcus pneumoniae</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng đường hô hấp</li>
                  <li><strong>Cảm lạnh:</strong> Cảm lạnh thông thường</li>
                  <li><strong>Cúm:</strong> Virus cúm</li>
                  <li><strong>Kích thích:</strong> Khói, bụi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân viêm phế quản mạn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Ô nhiễm:</strong> Ô nhiễm không khí</li>
                  <li><strong>Bụi:</strong> Bụi nghề nghiệp</li>
                  <li><strong>Khí độc:</strong> Khí độc hại</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng tái phát</li>
                  <li><strong>Di truyền:</strong> Yếu tố di truyền</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hút thuốc lá</li>
                  <li>Ô nhiễm không khí</li>
                  <li>Nghề nghiệp tiếp xúc bụi</li>
                  <li>Hệ miễn dịch yếu</li>
                  <li>Tuổi già</li>
                  <li>Bệnh phổi mạn tính</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc viêm phế quản hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Tuổi già:</strong> Trên 65 tuổi</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc bụi</li>
                  <li><strong>Ô nhiễm:</strong> Sống nơi ô nhiễm</li>
                  <li><strong>Hệ miễn dịch:</strong> Hệ miễn dịch yếu</li>
                  <li><strong>Bệnh phổi:</strong> Bệnh phổi mạn tính</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 5 tuổi</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng tái phát</li>
                  <li><strong>Dị ứng:</strong> Dị ứng đường hô hấp</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Môi trường:</strong> Môi trường ẩm ướt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Không hút thuốc</li>
                  <li>Tránh ô nhiễm</li>
                  <li>Vệ sinh tốt</li>
                  <li>Tiêm vaccine</li>
                  <li>Tập thể dục</li>
                  <li>Dinh dưỡng tốt</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Viêm phế quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán viêm phế quản dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian</li>
                  <li><strong>Khám lâm sàng:</strong> Nghe phổi</li>
                  <li><strong>Triệu chứng:</strong> Ho, đờm, khó thở</li>
                  <li><strong>Thời gian:</strong> Cấp tính hay mạn tính</li>
                  <li><strong>Nguyên nhân:</strong> Virus, vi khuẩn</li>
                  <li><strong>Mức độ:</strong> Nhẹ, trung bình, nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Bạch cầu</li>
                  <li><strong>Cấy đờm:</strong> Vi khuẩn</li>
                  <li><strong>X-quang ngực:</strong> Hình ảnh phổi</li>
                  <li><strong>Đo chức năng phổi:</strong> Spirometry</li>
                  <li><strong>Khí máu:</strong> Oxy, CO2</li>
                  <li><strong>CT scan:</strong> Hình ảnh chi tiết</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chẩn đoán phân biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Hen suyễn:</strong> Khó thở từng cơn</li>
                  <li><strong>Viêm phổi:</strong> Nhiễm trùng phổi</li>
                  <li><strong>COPD:</strong> Bệnh phổi tắc nghẽn</li>
                  <li><strong>Ung thư phổi:</strong> Khối u phổi</li>
                  <li><strong>Viêm xoang:</strong> Viêm xoang</li>
                  <li><strong>Trào ngược:</strong> Trào ngược dạ dày</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Viêm phế quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa viêm phế quản tập trung vào việc tránh các yếu tố nguy cơ và tăng cường sức đề kháng. 
                  Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Không hút thuốc:</strong> Bỏ thuốc lá</li>
                  <li><strong>Tránh khói:</strong> Tránh khói thuốc</li>
                  <li><strong>Tránh ô nhiễm:</strong> Sống nơi sạch sẽ</li>
                  <li><strong>Tránh bụi:</strong> Đeo khẩu trang</li>
                  <li><strong>Tránh lạnh:</strong> Giữ ấm</li>
                  <li><strong>Tránh ẩm:</strong> Tránh nơi ẩm ướt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng cường sức đề kháng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiêm vaccine:</strong> Vaccine cúm, phế cầu</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục thường xuyên</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Vệ sinh:</strong> Rửa tay thường xuyên</li>
                  <li><strong>Vitamin:</strong> Bổ sung vitamin</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Theo dõi triệu chứng</li>
                  <li>Điều trị sớm</li>
                  <li>Tránh tiếp xúc người bệnh</li>
                  <li>Giữ môi trường sạch</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Viêm phế quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị viêm phế quản tùy thuộc vào loại (cấp tính hay mạn tính) và nguyên nhân gây bệnh. 
                  Điều trị bao gồm các biện pháp hỗ trợ và thuốc điều trị.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị viêm phế quản cấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Uống nhiều nước</li>
                  <li><strong>Thuốc ho:</strong> Thuốc giảm ho</li>
                  <li><strong>Thuốc hạ sốt:</strong> Paracetamol</li>
                  <li><strong>Kháng sinh:</strong> Nếu nhiễm vi khuẩn</li>
                  <li><strong>Thuốc giảm đau:</strong> Ibuprofen</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị viêm phế quản mạn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bỏ thuốc:</strong> Ngừng hút thuốc</li>
                  <li><strong>Thuốc giãn phế quản:</strong> Salbutamol</li>
                  <li><strong>Thuốc kháng viêm:</strong> Corticosteroid</li>
                  <li><strong>Thuốc long đờm:</strong> Acetylcysteine</li>
                  <li><strong>Oxy liệu pháp:</strong> Thở oxy</li>
                  <li><strong>Vật lý trị liệu:</strong> Tập thở</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Uống nhiều nước</li>
                  <li><strong>Không hút thuốc:</strong> Tránh khói thuốc</li>
                  <li><strong>Giữ ấm:</strong> Giữ ấm cơ thể</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh mũi họng</li>
                  <li><strong>Theo dõi:</strong> Theo dõi triệu chứng</li>
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
