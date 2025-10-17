import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AcuteKidneyFailurePage() {
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
    "Bệnh Thận - Tiết Niệu",
    "Thận",
    "Đối tượng",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Người Cao Tuổi",
    "Bệnh Trẻ Em",
    "Bệnh Nội Tiết - Chuyển Hóa",
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
                <BreadcrumbPage>Suy thận cấp</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">15/09/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Suy thận cấp: Nguy hiểm nhưng có thể điều trị
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
                  Suy thận cấp là tình trạng thận đột ngột mất khả năng lọc chất thải và chất lỏng dư thừa từ máu. 
                  Đây là một tình trạng nghiêm trọng có thể đe dọa tính mạng nếu không được điều trị kịp thời.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Suy thận cấp có thể xảy ra ở mọi lứa tuổi và có thể phục hồi hoàn toàn nếu được chẩn đoán và điều trị sớm. 
                  Tuy nhiên, nếu không được điều trị kịp thời, có thể dẫn đến suy thận mạn tính hoặc tử vong.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Acute Kidney Injury (AKI)</li>
                  <li><strong>Tính chất:</strong> Cấp tính</li>
                  <li><strong>Triệu chứng chính:</strong> Thiểu niệu, phù</li>
                  <li><strong>Thời gian:</strong> Vài giờ đến vài ngày</li>
                  <li><strong>Điều trị:</strong> Hỗ trợ, lọc máu</li>
                  <li><strong>Phòng ngừa:</strong> Kiểm soát nguyên nhân</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Suy thận cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của suy thận cấp có thể xuất hiện đột ngột hoặc từ từ, tùy thuộc vào nguyên nhân và mức độ nghiêm trọng. 
                  Một số trường hợp có thể không có triệu chứng rõ ràng ở giai đoạn đầu.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thiểu niệu:</strong> Giảm lượng nước tiểu</li>
                  <li><strong>Phù:</strong> Sưng chân, tay, mặt</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Buồn nôn:</strong> Cảm giác muốn nôn</li>
                  <li><strong>Đau ngực:</strong> Đau vùng ngực</li>
                  <li><strong>Khó thở:</strong> Thở gấp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng tiến triển:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vô niệu:</strong> Không có nước tiểu</li>
                  <li><strong>Phù toàn thân:</strong> Sưng toàn cơ thể</li>
                  <li><strong>Lú lẫn:</strong> Không tỉnh táo</li>
                  <li><strong>Co giật:</strong> Động kinh</li>
                  <li><strong>Hôn mê:</strong> Mất ý thức</li>
                  <li><strong>Rối loạn nhịp tim:</strong> Tim đập không đều</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Suy hô hấp:</strong> Khó thở nặng</li>
                  <li><strong>Sốc:</strong> Huyết áp tụt</li>
                  <li><strong>Nhiễm toan:</strong> pH máu thấp</li>
                  <li><strong>Tăng kali máu:</strong> Kali cao</li>
                  <li><strong>Rối loạn đông máu:</strong> Chảy máu</li>
                  <li><strong>Tử vong:</strong> Trong trường hợp nặng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Suy thận cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Suy thận cấp có thể do nhiều nguyên nhân khác nhau, được phân loại thành 3 nhóm chính: 
                  nguyên nhân trước thận, tại thận và sau thận. Hiểu rõ nguyên nhân giúp có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân trước thận:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mất nước:</strong> Tiêu chảy, nôn mửa</li>
                  <li><strong>Mất máu:</strong> Chảy máu nặng</li>
                  <li><strong>Sốc:</strong> Sốc tim, sốc nhiễm trùng</li>
                  <li><strong>Hạ huyết áp:</strong> Huyết áp thấp</li>
                  <li><strong>Thuốc:</strong> Thuốc lợi tiểu</li>
                  <li><strong>Bỏng:</strong> Bỏng nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân tại thận:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Viêm cầu thận:</strong> Viêm cầu thận cấp</li>
                  <li><strong>Viêm ống thận:</strong> Viêm ống thận cấp</li>
                  <li><strong>Thuốc độc:</strong> Thuốc độc với thận</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng thận</li>
                  <li><strong>Rhabdomyolysis:</strong> Tiêu cơ vân</li>
                  <li><strong>Huyết tán:</strong> Tan máu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân sau thận:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sỏi thận:</strong> Sỏi niệu quản</li>
                  <li><strong>Ung thư:</strong> Ung thư bàng quang</li>
                  <li><strong>Phì đại tuyến tiền liệt:</strong> Tắc nghẽn</li>
                  <li><strong>Hẹp niệu đạo:</strong> Hẹp đường tiểu</li>
                  <li><strong>Viêm bàng quang:</strong> Viêm bàng quang</li>
                  <li><strong>Chấn thương:</strong> Chấn thương đường tiểu</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc suy thận cấp hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi già:</strong> Trên 65 tuổi</li>
                  <li><strong>Bệnh thận:</strong> Bệnh thận mạn tính</li>
                  <li><strong>Tiểu đường:</strong> Đái tháo đường</li>
                  <li><strong>Tăng huyết áp:</strong> Huyết áp cao</li>
                  <li><strong>Bệnh tim:</strong> Suy tim, bệnh mạch vành</li>
                  <li><strong>Bệnh gan:</strong> Xơ gan, viêm gan</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc:</strong> Thuốc độc với thận</li>
                  <li><strong>Phẫu thuật:</strong> Phẫu thuật lớn</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng nặng</li>
                  <li><strong>Chấn thương:</strong> Chấn thương nặng</li>
                  <li><strong>Bỏng:</strong> Bỏng nặng</li>
                  <li><strong>Ung thư:</strong> Ung thư di căn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kiểm soát huyết áp</li>
                  <li>Kiểm soát đường huyết</li>
                  <li>Uống đủ nước</li>
                  <li>Tránh thuốc độc</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Lối sống lành mạnh</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Suy thận cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán suy thận cấp dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán sớm rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, nguyên nhân</li>
                  <li><strong>Khám lâm sàng:</strong> Phù, thiểu niệu</li>
                  <li><strong>Triệu chứng:</strong> Mệt mỏi, buồn nôn</li>
                  <li><strong>Thời gian:</strong> Cấp tính</li>
                  <li><strong>Nguyên nhân:</strong> Trước, tại, sau thận</li>
                  <li><strong>Mức độ:</strong> Nhẹ, trung bình, nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Creatinine:</strong> Tăng creatinine máu</li>
                  <li><strong>Ure:</strong> Tăng ure máu</li>
                  <li><strong>Điện giải:</strong> Kali, natri</li>
                  <li><strong>Công thức máu:</strong> Thiếu máu</li>
                  <li><strong>Khí máu:</strong> Nhiễm toan</li>
                  <li><strong>Siêu âm:</strong> Hình ảnh thận</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nước tiểu:</strong> Protein, tế bào</li>
                  <li><strong>CT scan:</strong> Hình ảnh chi tiết</li>
                  <li><strong>MRI:</strong> Hình ảnh mô mềm</li>
                  <li><strong>Sinh thiết:</strong> Trong trường hợp cần</li>
                  <li><strong>Điện tâm đồ:</strong> Rối loạn nhịp</li>
                  <li><strong>Theo dõi:</strong> Diễn biến bệnh</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Suy thận cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa suy thận cấp tập trung vào việc kiểm soát các yếu tố nguy cơ và 
                  tránh các tác nhân gây hại cho thận. Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Kiểm soát yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Huyết áp:</strong> Kiểm soát huyết áp</li>
                  <li><strong>Đường huyết:</strong> Kiểm soát tiểu đường</li>
                  <li><strong>Tim mạch:</strong> Điều trị bệnh tim</li>
                  <li><strong>Gan:</strong> Điều trị bệnh gan</li>
                  <li><strong>Nhiễm trùng:</strong> Điều trị nhiễm trùng</li>
                  <li><strong>Chấn thương:</strong> Tránh chấn thương</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tránh tác nhân gây hại:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc:</strong> Tránh thuốc độc với thận</li>
                  <li><strong>Chất độc:</strong> Tránh chất độc</li>
                  <li><strong>Rượu:</strong> Hạn chế rượu</li>
                  <li><strong>Thuốc lá:</strong> Bỏ thuốc lá</li>
                  <li><strong>Chế độ ăn:</strong> Ăn uống lành mạnh</li>
                  <li><strong>Vận động:</strong> Tập thể dục</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Theo dõi chức năng thận</li>
                  <li>Uống đủ nước</li>
                  <li>Tránh mất nước</li>
                  <li>Điều trị sớm</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Suy thận cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị suy thận cấp tập trung vào việc điều trị nguyên nhân, hỗ trợ chức năng thận và 
                  ngăn ngừa biến chứng. Điều trị bao gồm các biện pháp hỗ trợ và điều trị đặc hiệu.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị nguyên nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mất nước:</strong> Bù nước</li>
                  <li><strong>Mất máu:</strong> Truyền máu</li>
                  <li><strong>Sốc:</strong> Điều trị sốc</li>
                  <li><strong>Nhiễm trùng:</strong> Kháng sinh</li>
                  <li><strong>Thuốc độc:</strong> Ngừng thuốc</li>
                  <li><strong>Tắc nghẽn:</strong> Thông tắc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Lọc máu:</strong> Thận nhân tạo</li>
                  <li><strong>Điều chỉnh điện giải:</strong> Kali, natri</li>
                  <li><strong>Điều chỉnh pH:</strong> Nhiễm toan</li>
                  <li><strong>Điều trị thiếu máu:</strong> Truyền máu</li>
                  <li><strong>Điều trị tăng huyết áp:</strong> Thuốc hạ áp</li>
                  <li><strong>Điều trị phù:</strong> Lợi tiểu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Hạn chế protein:</strong> Giảm gánh nặng thận</li>
                  <li><strong>Hạn chế muối:</strong> Giảm phù</li>
                  <li><strong>Hạn chế kali:</strong> Tránh tăng kali</li>
                  <li><strong>Hạn chế phospho:</strong> Tránh tăng phospho</li>
                  <li><strong>Uống nước:</strong> Theo chỉ định</li>
                  <li><strong>Vitamin:</strong> Bổ sung vitamin</li>
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
