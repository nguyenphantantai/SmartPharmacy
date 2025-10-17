import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AsthmaPage() {
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
    "Bệnh Người Cao Tuổi", 
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Trẻ Em",
    "Bệnh Về Máu",
    "Bệnh Nội Tiết - Chuyển Hóa",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Truyền Nhiễm"
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-screen-2xl px-6 py-8">
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
                <BreadcrumbPage>Hen suyễn</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">17/05/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tìm hiểu về bệnh hen suyễn – Những điều bạn cần biết
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
                  Hen suyễn là một tình trạng viêm mãn tính của đường thở, liên quan đến nhiều tế bào và 
                  thành phần tế bào, dẫn đến tăng phản ứng của đường thở (co thắt, sưng, tăng đờm), gây tắc nghẽn 
                  và hạn chế luồng khí. Các triệu chứng bao gồm khò khè, khó thở, tức ngực và ho tái phát, 
                  thường xảy ra vào ban đêm và sáng sớm, có thể tự khỏi hoặc điều trị bằng thuốc.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ở trẻ em, hen suyễn được gọi là viêm phế quản co thắt hoặc hen phế quản. Người lớn thường 
                  gọi là hen suyễn. Bệnh có thể bắt đầu rất sớm trong đời, đôi khi được gọi là "hen sữa". 
                  Nhiều trường hợp cải thiện và biến mất khi trẻ lớn lên, nhưng một số trường hợp vẫn tồn tại 
                  và tái phát ở tuổi già.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Asthma</li>
                  <li><strong>Tính chất:</strong> Viêm mãn tính đường thở</li>
                  <li><strong>Triệu chứng chính:</strong> Khò khè, khó thở, tức ngực</li>
                  <li><strong>Thời gian:</strong> Có thể kéo dài suốt đời</li>
                  <li><strong>Điều trị:</strong> Thuốc hít, thuốc uống</li>
                  <li><strong>Phòng ngừa:</strong> Tránh tác nhân kích thích</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Hen suyễn</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của hen suyễn có thể thay đổi từ nhẹ đến nghiêm trọng và có thể xuất hiện 
                  đột ngột hoặc phát triển từ từ. Triệu chứng thường nặng hơn vào ban đêm và sáng sớm.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khò khè:</strong> Tiếng rít khi thở ra</li>
                  <li><strong>Khó thở:</strong> Cảm giác thiếu không khí</li>
                  <li><strong>Tức ngực:</strong> Cảm giác bị ép chặt</li>
                  <li><strong>Ho:</strong> Ho khan, đặc biệt vào ban đêm</li>
                  <li><strong>Thở nhanh:</strong> Nhịp thở tăng</li>
                  <li><strong>Mệt mỏi:</strong> Do khó thở</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở trẻ em:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ho về đêm:</strong> Ho khan, dai dẳng</li>
                  <li><strong>Khó thở khi vận động:</strong> Chạy nhảy, chơi đùa</li>
                  <li><strong>Mệt mỏi:</strong> Trẻ không muốn chơi</li>
                  <li><strong>Thở nhanh:</strong> Nhịp thở nhanh hơn bình thường</li>
                  <li><strong>Co rút cơ liên sườn:</strong> Cơ ngực co lại</li>
                  <li><strong>Khó ngủ:</strong> Do ho và khó thở</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Cơn hen cấp:</strong> Khó thở dữ dội</li>
                  <li><strong>Không thể nói:</strong> Do khó thở</li>
                  <li><strong>Môi tím tái:</strong> Thiếu oxy</li>
                  <li><strong>Mạch nhanh:</strong> Tim đập nhanh</li>
                  <li><strong>Lú lẫn:</strong> Do thiếu oxy não</li>
                  <li><strong>Ngất xỉu:</strong> Trong trường hợp nặng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Hen suyễn</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hen suyễn là kết quả của sự tương tác phức tạp giữa gen di truyền và các yếu tố môi trường. 
                  Nguyên nhân chính là viêm đường thở và tăng phản ứng của đường thở với các tác nhân kích thích.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Viêm đường thở:</strong> Viêm mãn tính niêm mạc</li>
                  <li><strong>Tăng phản ứng:</strong> Đường thở nhạy cảm</li>
                  <li><strong>Co thắt cơ trơn:</strong> Cơ đường thở co lại</li>
                  <li><strong>Sưng niêm mạc:</strong> Phù nề đường thở</li>
                  <li><strong>Tăng tiết đờm:</strong> Đờm dính, khó khạc</li>
                  <li><strong>Thu hẹp đường thở:</strong> Giảm luồng khí</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tác nhân kích thích:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Dị ứng:</strong> Phấn hoa, bụi, lông động vật</li>
                  <li><strong>Nhiễm trùng:</strong> Virus, vi khuẩn</li>
                  <li><strong>Khói thuốc:</strong> Hút thuốc, khói thuốc thụ động</li>
                  <li><strong>Ô nhiễm không khí:</strong> Khói, bụi</li>
                  <li><strong>Thời tiết:</strong> Lạnh, ẩm, thay đổi</li>
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc hen suyễn hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử gia đình:</strong> Có người thân mắc hen suyễn</li>
                  <li><strong>Dị ứng:</strong> Viêm mũi dị ứng, chàm</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc hoặc hút thuốc thụ động</li>
                  <li><strong>Ô nhiễm:</strong> Sống trong môi trường ô nhiễm</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng đường hô hấp</li>
                  <li><strong>Béo phì:</strong> Thừa cân, béo phì</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ em và người cao tuổi</li>
                  <li><strong>Giới tính:</strong> Nam giới (trẻ em), nữ giới (người lớn)</li>
                  <li><strong>Dân tộc:</strong> Người Mỹ gốc Phi, Puerto Rico</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc hóa chất, bụi</li>
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Thuốc:</strong> Aspirin, NSAID</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Bú sữa mẹ</li>
                  <li>Tiếp xúc với vật nuôi sớm</li>
                  <li>Sống ở nông thôn</li>
                  <li>Vận động thường xuyên</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Tránh khói thuốc</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Hen suyễn</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán hen suyễn dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm chức năng phổi. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, tần suất, mức độ</li>
                  <li><strong>Khám lâm sàng:</strong> Nghe phổi, đo nhịp thở</li>
                  <li><strong>Triệu chứng:</strong> Khò khè, khó thở, ho</li>
                  <li><strong>Thời gian:</strong> Ban đêm, sáng sớm</li>
                  <li><strong>Tác nhân:</strong> Dị ứng, nhiễm trùng</li>
                  <li><strong>Đáp ứng thuốc:</strong> Cải thiện với thuốc giãn phế quản</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm chức năng phổi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Spirometry:</strong> Đo dung tích phổi</li>
                  <li><strong>Peak flow:</strong> Đo lưu lượng đỉnh</li>
                  <li><strong>Test giãn phế quản:</strong> Đo trước và sau thuốc</li>
                  <li><strong>Test kích thích:</strong> Methacholine, histamine</li>
                  <li><strong>Đo khí máu:</strong> O2, CO2</li>
                  <li><strong>X-quang ngực:</strong> Loại trừ bệnh khác</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Test dị ứng:</strong> Da, máu</li>
                  <li><strong>Xét nghiệm máu:</strong> IgE, eosinophil</li>
                  <li><strong>Đờm:</strong> Tế bào eosinophil</li>
                  <li><strong>CT ngực:</strong> Đánh giá cấu trúc</li>
                  <li><strong>Nội soi phế quản:</strong> Trong trường hợp đặc biệt</li>
                  <li><strong>Theo dõi:</strong> Peak flow tại nhà</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Hen suyễn</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù không thể ngăn ngừa hoàn toàn hen suyễn, nhưng có thể giảm nguy cơ và 
                  kiểm soát triệu chứng thông qua việc tránh tác nhân kích thích và lối sống lành mạnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh tác nhân kích thích:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dị ứng:</strong> Tránh phấn hoa, bụi, lông động vật</li>
                  <li><strong>Khói thuốc:</strong> Không hút thuốc, tránh khói thuốc</li>
                  <li><strong>Ô nhiễm:</strong> Tránh khói, bụi</li>
                  <li><strong>Nhiễm trùng:</strong> Rửa tay, tiêm vaccine</li>
                  <li><strong>Thời tiết:</strong> Mặc ấm, tránh lạnh</li>
                  <li><strong>Stress:</strong> Quản lý căng thẳng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Lối sống lành mạnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vận động:</strong> Thể dục nhẹ nhàng</li>
                  <li><strong>Chế độ ăn:</strong> Nhiều rau quả, ít chất béo</li>
                  <li><strong>Kiểm soát cân nặng:</strong> Tránh béo phì</li>
                  <li><strong>Ngủ đủ giấc:</strong> 7-8 giờ/ngày</li>
                  <li><strong>Uống đủ nước:</strong> 2-3 lít/ngày</li>
                  <li><strong>Tránh rượu:</strong> Hạn chế uống rượu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Môi trường sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Làm sạch nhà cửa thường xuyên</li>
                  <li>Sử dụng máy lọc không khí</li>
                  <li>Tránh thảm, gối lông</li>
                  <li>Giữ độ ẩm phù hợp</li>
                  <li>Tránh nấm mốc</li>
                  <li>Thông gió tốt</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Hen suyễn</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị hen suyễn tập trung vào việc kiểm soát triệu chứng và ngăn ngừa cơn hen. 
                  Điều trị bao gồm thuốc kiểm soát dài hạn và thuốc cắt cơn nhanh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thuốc kiểm soát dài hạn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Corticosteroid hít:</strong> Fluticasone, Budesonide</li>
                  <li><strong>LABA:</strong> Salmeterol, Formoterol</li>
                  <li><strong>LTRA:</strong> Montelukast</li>
                  <li><strong>Theophylline:</strong> Thuốc uống</li>
                  <li><strong>Cromolyn:</strong> Thuốc ổn định tế bào</li>
                  <li><strong>Omalizumab:</strong> Kháng thể đơn dòng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc cắt cơn nhanh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>SABA:</strong> Albuterol, Levalbuterol</li>
                  <li><strong>Anticholinergic:</strong> Ipratropium</li>
                  <li><strong>Corticosteroid uống:</strong> Prednisone</li>
                  <li><strong>Epinephrine:</strong> Trong trường hợp nặng</li>
                  <li><strong>Magnesium sulfate:</strong> Tiêm tĩnh mạch</li>
                  <li><strong>Heliox:</strong> Hỗn hợp khí</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phương pháp điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Inhaler:</strong> Thuốc hít</li>
                  <li><strong>Nebulizer:</strong> Máy khí dung</li>
                  <li><strong>Spacer:</strong> Buồng đệm</li>
                  <li><strong>Peak flow meter:</strong> Đo lưu lượng</li>
                  <li><strong>Action plan:</strong> Kế hoạch hành động</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về bệnh</li>
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
