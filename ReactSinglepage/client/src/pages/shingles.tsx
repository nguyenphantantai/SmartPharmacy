import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function ShinglesPage() {
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
    "Bệnh Về Da",
    "Da",
    "Đối tượng",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Người Cao Tuổi",
    "Bệnh Trẻ Em",
    "Bệnh Truyền Nhiễm",
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
                <BreadcrumbPage>Giời leo</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">18/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Giời leo là gì? Những điều cần biết về giời leo
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
                  Giời leo là bệnh rất nhiều người gặp phải, không chỉ gây mất thẩm mỹ mà còn ảnh hưởng không nhỏ đến cuộc sống hàng ngày. 
                  Hãy cùng Pharmacity tìm hiểu về giời leo qua bài viết dưới đây.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh giời leo là bị bỏng da do acid photpho hữu cơ từ côn trùng, Bọ giời là bị một loại côn trùng 
                  (ban đêm phát sáng màu xanh lục) bò lên da để lại chất nhầy chứa acid photpho hữu cơ gây bỏng da, 
                  nếu chúng bị đè nát thì mức độ tổn thương trên da nặng hơn, không còn là những đường vệt dài mà là một đám lớn.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Paederus dermatitis</li>
                  <li><strong>Tính chất:</strong> Bỏng da do acid</li>
                  <li><strong>Triệu chứng chính:</strong> Đau rát, phồng rộp</li>
                  <li><strong>Thời gian:</strong> Cấp tính</li>
                  <li><strong>Điều trị:</strong> Rửa sạch, thuốc bôi</li>
                  <li><strong>Phòng ngừa:</strong> Tránh côn trùng</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Giời leo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của giời leo thường xuất hiện ngay sau khi tiếp xúc với côn trùng và có thể 
                  thay đổi tùy thuộc vào mức độ tiếp xúc và thời gian phát hiện.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đau rát:</strong> Cảm giác nóng rát</li>
                  <li><strong>Phồng rộp:</strong> Da bị phồng lên</li>
                  <li><strong>Đỏ da:</strong> Da đỏ và sưng</li>
                  <li><strong>Ngứa:</strong> Cảm giác ngứa ngáy</li>
                  <li><strong>Chảy nước:</strong> Vết thương chảy nước</li>
                  <li><strong>Đóng vảy:</strong> Da đóng vảy</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo giai đoạn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giai đoạn đầu:</strong> Đỏ da, ngứa</li>
                  <li><strong>Giai đoạn giữa:</strong> Phồng rộp, đau</li>
                  <li><strong>Giai đoạn cuối:</strong> Đóng vảy, lành</li>
                  <li><strong>Thời gian:</strong> 7-14 ngày</li>
                  <li><strong>Để lại sẹo:</strong> Nếu không điều trị</li>
                  <li><strong>Nhiễm trùng:</strong> Trong trường hợp nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nhiễm trùng:</strong> Vết thương bị nhiễm trùng</li>
                  <li><strong>Sốt:</strong> Nhiệt độ cơ thể tăng</li>
                  <li><strong>Sưng hạch:</strong> Hạch bạch huyết sưng</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Đau đầu:</strong> Đau nhức đầu</li>
                  <li><strong>Buồn nôn:</strong> Cảm giác muốn nôn</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Giời leo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Giời leo là do tiếp xúc với côn trùng thuộc họ Paederus, đặc biệt là loài Paederus fuscipes. 
                  Côn trùng này có màu xanh lục và phát sáng vào ban đêm, thường sống ở những nơi ẩm ướt.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Côn trùng gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Paederus fuscipes:</strong> Loài chính gây bệnh</li>
                  <li><strong>Màu sắc:</strong> Xanh lục</li>
                  <li><strong>Phát sáng:</strong> Ban đêm</li>
                  <li><strong>Kích thước:</strong> 7-10mm</li>
                  <li><strong>Môi trường:</strong> Ẩm ướt</li>
                  <li><strong>Thức ăn:</strong> Côn trùng nhỏ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Acid photpho hữu cơ:</strong> Chất độc chính</li>
                  <li><strong>Chất nhầy:</strong> Để lại trên da</li>
                  <li><strong>Phản ứng:</strong> Gây bỏng da</li>
                  <li><strong>Thời gian:</strong> 24-48 giờ</li>
                  <li><strong>Mức độ:</strong> Tùy thuộc lượng chất</li>
                  <li><strong>Lan rộng:</strong> Nếu không rửa sạch</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Môi trường ẩm ướt</li>
                  <li>Ban đêm</li>
                  <li>Ánh sáng thu hút</li>
                  <li>Da nhạy cảm</li>
                  <li>Không rửa sạch</li>
                  <li>Đè nát côn trùng</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc giời leo hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Môi trường:</strong> Sống ở nơi ẩm ướt</li>
                  <li><strong>Nghề nghiệp:</strong> Làm việc ngoài trời</li>
                  <li><strong>Thời gian:</strong> Hoạt động ban đêm</li>
                  <li><strong>Da nhạy cảm:</strong> Da dễ bị kích ứng</li>
                  <li><strong>Trẻ em:</strong> Da mỏng, nhạy cảm</li>
                  <li><strong>Người già:</strong> Da khô, dễ tổn thương</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giới tính:</strong> Nam giới</li>
                  <li><strong>Tuổi:</strong> 20-50 tuổi</li>
                  <li><strong>Vùng miền:</strong> Nông thôn</li>
                  <li><strong>Mùa:</strong> Mùa mưa</li>
                  <li><strong>Thời tiết:</strong> Ẩm ướt</li>
                  <li><strong>Ánh sáng:</strong> Ánh sáng thu hút</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Môi trường khô ráo</li>
                  <li>Vệ sinh tốt</li>
                  <li>Tránh ánh sáng</li>
                  <li>Mặc quần áo dài</li>
                  <li>Sử dụng thuốc chống côn trùng</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Giời leo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán giời leo chủ yếu dựa trên tiền sử tiếp xúc và khám lâm sàng. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiếp xúc côn trùng</li>
                  <li><strong>Khám lâm sàng:</strong> Vết thương đặc trưng</li>
                  <li><strong>Triệu chứng:</strong> Đau rát, phồng rộp</li>
                  <li><strong>Vị trí:</strong> Vùng tiếp xúc</li>
                  <li><strong>Hình dạng:</strong> Đường vệt hoặc đám</li>
                  <li><strong>Màu sắc:</strong> Đỏ, phồng rộp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Không cần:</strong> Xét nghiệm đặc biệt</li>
                  <li><strong>Chẩn đoán:</strong> Dựa trên lâm sàng</li>
                  <li><strong>Phân biệt:</strong> Với các bệnh da khác</li>
                  <li><strong>Tiền sử:</strong> Quan trọng nhất</li>
                  <li><strong>Khám:</strong> Vết thương đặc trưng</li>
                  <li><strong>Theo dõi:</strong> Diễn biến bệnh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chẩn đoán phân biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Bỏng:</strong> Bỏng nhiệt</li>
                  <li><strong>Viêm da:</strong> Viêm da tiếp xúc</li>
                  <li><strong>Herpes:</strong> Herpes simplex</li>
                  <li><strong>Zona:</strong> Herpes zoster</li>
                  <li><strong>Dị ứng:</strong> Dị ứng thuốc</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng da</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Giời leo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa giời leo tập trung vào việc tránh tiếp xúc với côn trùng và 
                  vệ sinh môi trường sống. Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh tiếp xúc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mặc quần áo:</strong> Dài tay, dài chân</li>
                  <li><strong>Tránh ánh sáng:</strong> Tắt đèn ban đêm</li>
                  <li><strong>Màn:</strong> Sử dụng màn chống côn trùng</li>
                  <li><strong>Thuốc chống côn trùng:</strong> DEET, Permethrin</li>
                  <li><strong>Vệ sinh:</strong> Giữ sạch môi trường</li>
                  <li><strong>Tránh:</strong> Nơi ẩm ướt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Làm sạch:</strong> Nhà cửa thường xuyên</li>
                  <li><strong>Thông gió:</strong> Giữ không khí lưu thông</li>
                  <li><strong>Độ ẩm:</strong> Giữ độ ẩm thấp</li>
                  <li><strong>Ánh sáng:</strong> Tránh ánh sáng thu hút</li>
                  <li><strong>Cây cối:</strong> Cắt tỉa cây cối</li>
                  <li><strong>Nước:</strong> Loại bỏ nước đọng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Giáo dục sức khỏe</li>
                  <li>Nhận biết côn trùng</li>
                  <li>Xử lý đúng cách</li>
                  <li>Rửa sạch ngay</li>
                  <li>Không đè nát</li>
                  <li>Theo dõi triệu chứng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Giời leo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị giời leo tập trung vào việc rửa sạch vết thương, giảm đau và 
                  ngăn ngừa nhiễm trùng. Điều trị bao gồm các biện pháp tại chỗ và toàn thân.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị tại chỗ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa sạch:</strong> Nước sạch ngay lập tức</li>
                  <li><strong>Xà phòng:</strong> Rửa với xà phòng</li>
                  <li><strong>Thuốc bôi:</strong> Corticosteroid</li>
                  <li><strong>Kháng sinh:</strong> Bôi kháng sinh</li>
                  <li><strong>Giảm đau:</strong> Thuốc giảm đau</li>
                  <li><strong>Băng:</strong> Băng vết thương</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị toàn thân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng sinh:</strong> Trong trường hợp nhiễm trùng</li>
                  <li><strong>Thuốc giảm đau:</strong> Paracetamol, Ibuprofen</li>
                  <li><strong>Thuốc kháng histamine:</strong> Giảm ngứa</li>
                  <li><strong>Corticosteroid:</strong> Trong trường hợp nặng</li>
                  <li><strong>Vitamin:</strong> Tăng cường sức đề kháng</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc vết thương:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Giữ sạch:</strong> Rửa sạch hàng ngày</li>
                  <li><strong>Không gãi:</strong> Tránh gãi vết thương</li>
                  <li><strong>Băng:</strong> Băng vết thương</li>
                  <li><strong>Theo dõi:</strong> Theo dõi diễn biến</li>
                  <li><strong>Khám:</strong> Khám lại nếu cần</li>
                  <li><strong>Phòng ngừa:</strong> Ngăn ngừa nhiễm trùng</li>
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
