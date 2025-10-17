import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function ChickenpoxPage() {
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
    "Bệnh Trẻ Em",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Người Cao Tuổi",
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
                <BreadcrumbPage>Thuỷ đậu</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">22/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh thuỷ đậu là gì? Những điều cần biết về bệnh
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung về bệnh thủy đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh thủy đậu, còn gọi là bệnh trái rạ hoặc bệnh đậu mùa gà, là một bệnh do virus varicella-zoster (VZV) gây ra. 
                  Bệnh phổ biến nhất ở trẻ em nhưng cũng có thể ảnh hưởng đến người lớn. 
                  Thủy đậu có thể gây ra các biến chứng nguy hiểm nếu không được điều trị kịp thời và đúng cách.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh thủy đậu là một bệnh truyền nhiễm cấp tính, rất dễ lây lan qua đường hô hấp và tiếp xúc trực tiếp. 
                  Triệu chứng đặc trưng là sốt và phát ban dạng bóng nước trên da. 
                  Mặc dù thường là bệnh nhẹ ở trẻ em, nhưng có thể nghiêm trọng ở người lớn và những người có hệ miễn dịch yếu.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Varicella</li>
                  <li><strong>Tính chất:</strong> Truyền nhiễm cấp tính</li>
                  <li><strong>Triệu chứng chính:</strong> Sốt, phát ban</li>
                  <li><strong>Thời gian:</strong> 7-10 ngày</li>
                  <li><strong>Điều trị:</strong> Hỗ trợ, thuốc kháng virus</li>
                  <li><strong>Phòng ngừa:</strong> Tiêm vaccine</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của bệnh thuỷ đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của bệnh thủy đậu thường xuất hiện sau 10-21 ngày kể từ khi tiếp xúc với virus. 
                  Bệnh có thể bắt đầu với các triệu chứng giống cảm lạnh trước khi phát ban xuất hiện.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng ban đầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt:</strong> Sốt nhẹ đến vừa</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Đau đầu:</strong> Đau nhức đầu</li>
                  <li><strong>Chán ăn:</strong> Không muốn ăn</li>
                  <li><strong>Đau họng:</strong> Đau rát họng</li>
                  <li><strong>Ho:</strong> Ho khan</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng đặc trưng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phát ban:</strong> Nổi mẩn đỏ</li>
                  <li><strong>Bóng nước:</strong> Mụn nước trong</li>
                  <li><strong>Ngứa:</strong> Cảm giác ngứa ngáy</li>
                  <li><strong>Lan rộng:</strong> Từ mặt xuống thân</li>
                  <li><strong>Đóng vảy:</strong> Vảy khô</li>
                  <li><strong>Để lại sẹo:</strong> Nếu gãi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở người lớn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sốt cao:</strong> Trên 39°C</li>
                  <li><strong>Phát ban nặng:</strong> Nhiều mụn nước</li>
                  <li><strong>Đau cơ:</strong> Đau nhức toàn thân</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Biến chứng:</strong> Viêm phổi, viêm não</li>
                  <li><strong>Thời gian:</strong> Kéo dài hơn</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây bệnh thuỷ đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh thủy đậu do virus varicella-zoster (VZV) gây ra. Đây là một loại virus thuộc họ Herpesviridae, 
                  cùng họ với virus gây bệnh zona. Virus này rất dễ lây lan và có thể tồn tại trong không khí.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Virus gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Varicella-zoster virus:</strong> Virus chính</li>
                  <li><strong>Họ Herpesviridae:</strong> Cùng họ với herpes</li>
                  <li><strong>DNA virus:</strong> Virus DNA</li>
                  <li><strong>Kích thước:</strong> 150-200nm</li>
                  <li><strong>Khả năng sống:</strong> Trong không khí</li>
                  <li><strong>Khả năng lây:</strong> Rất cao</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Đường lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đường hô hấp:</strong> Ho, hắt hơi</li>
                  <li><strong>Tiếp xúc:</strong> Chạm vào mụn nước</li>
                  <li><strong>Không khí:</strong> Virus trong không khí</li>
                  <li><strong>Vật dụng:</strong> Dùng chung đồ dùng</li>
                  <li><strong>Dịch tiết:</strong> Nước bọt, nước mũi</li>
                  <li><strong>Mẹ sang con:</strong> Trong thai kỳ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chưa tiêm vaccine</li>
                  <li>Chưa mắc bệnh</li>
                  <li>Hệ miễn dịch yếu</li>
                  <li>Tiếp xúc với người bệnh</li>
                  <li>Môi trường đông đúc</li>
                  <li>Mùa đông xuân</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc bệnh thủy đậu hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 12 tuổi</li>
                  <li><strong>Chưa tiêm vaccine:</strong> Không có miễn dịch</li>
                  <li><strong>Chưa mắc bệnh:</strong> Chưa có kháng thể</li>
                  <li><strong>Hệ miễn dịch yếu:</strong> HIV, ung thư</li>
                  <li><strong>Mang thai:</strong> Phụ nữ có thai</li>
                  <li><strong>Người già:</strong> Trên 65 tuổi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Môi trường:</strong> Trường học, nhà trẻ</li>
                  <li><strong>Tiếp xúc:</strong> Với người bệnh</li>
                  <li><strong>Mùa:</strong> Mùa đông xuân</li>
                  <li><strong>Vùng miền:</strong> Khí hậu lạnh</li>
                  <li><strong>Đông đúc:</strong> Nơi đông người</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh kém</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tiêm vaccine</li>
                  <li>Đã mắc bệnh</li>
                  <li>Hệ miễn dịch khỏe</li>
                  <li>Vệ sinh tốt</li>
                  <li>Tránh tiếp xúc</li>
                  <li>Khẩu trang</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán bệnh thuỷ đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bệnh thủy đậu chủ yếu dựa trên tiền sử tiếp xúc và khám lâm sàng. 
                  Trong một số trường hợp, có thể cần xét nghiệm để xác định chẩn đoán.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Khám lâm sàng:</strong> Phát ban đặc trưng</li>
                  <li><strong>Triệu chứng:</strong> Sốt, mệt mỏi</li>
                  <li><strong>Phát ban:</strong> Bóng nước</li>
                  <li><strong>Vị trí:</strong> Từ mặt xuống thân</li>
                  <li><strong>Thời gian:</strong> 7-10 ngày</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Không cần:</strong> Xét nghiệm đặc biệt</li>
                  <li><strong>Chẩn đoán:</strong> Dựa trên lâm sàng</li>
                  <li><strong>Xét nghiệm:</strong> Trong trường hợp cần</li>
                  <li><strong>PCR:</strong> Phát hiện virus</li>
                  <li><strong>Kháng thể:</strong> IgM, IgG</li>
                  <li><strong>Cấy virus:</strong> Trong trường hợp nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chẩn đoán phân biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Zona:</strong> Herpes zoster</li>
                  <li><strong>Herpes:</strong> Herpes simplex</li>
                  <li><strong>Dị ứng:</strong> Dị ứng thuốc</li>
                  <li><strong>Viêm da:</strong> Viêm da tiếp xúc</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng da</li>
                  <li><strong>Bệnh khác:</strong> Bệnh da khác</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa bệnh thuỷ đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa bệnh thủy đậu tập trung vào việc tiêm vaccine và tránh tiếp xúc với người bệnh. 
                  Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêm vaccine:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vaccine:</strong> Varivax, Varilrix</li>
                  <li><strong>Tuổi:</strong> Từ 12 tháng tuổi</li>
                  <li><strong>Liều:</strong> 2 liều cách nhau 4-8 tuần</li>
                  <li><strong>Hiệu quả:</strong> 95-98%</li>
                  <li><strong>Thời gian:</strong> Bảo vệ lâu dài</li>
                  <li><strong>An toàn:</strong> Rất an toàn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tránh tiếp xúc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cách ly:</strong> Tránh người bệnh</li>
                  <li><strong>Khẩu trang:</strong> Đeo khẩu trang</li>
                  <li><strong>Vệ sinh:</strong> Rửa tay thường xuyên</li>
                  <li><strong>Không dùng chung:</strong> Đồ dùng cá nhân</li>
                  <li><strong>Thông gió:</strong> Giữ không khí lưu thông</li>
                  <li><strong>Khử trùng:</strong> Khử trùng bề mặt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Giáo dục sức khỏe</li>
                  <li>Nhận biết triệu chứng</li>
                  <li>Điều trị sớm</li>
                  <li>Theo dõi tiếp xúc</li>
                  <li>Báo cáo dịch</li>
                  <li>Kiểm soát dịch</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị bệnh thuỷ đậu</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị bệnh thủy đậu tập trung vào việc giảm triệu chứng và ngăn ngừa biến chứng. 
                  Điều trị bao gồm các biện pháp hỗ trợ và thuốc điều trị triệu chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Bù nước</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn đầy đủ</li>
                  <li><strong>Vệ sinh:</strong> Giữ sạch sẽ</li>
                  <li><strong>Không gãi:</strong> Tránh gãi</li>
                  <li><strong>Theo dõi:</strong> Triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc hạ sốt:</strong> Paracetamol</li>
                  <li><strong>Thuốc kháng virus:</strong> Acyclovir</li>
                  <li><strong>Thuốc giảm ngứa:</strong> Antihistamine</li>
                  <li><strong>Thuốc bôi:</strong> Calamine</li>
                  <li><strong>Kháng sinh:</strong> Trong trường hợp nhiễm trùng</li>
                  <li><strong>Thuốc giảm đau:</strong> Ibuprofen</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc da:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tắm nước mát:</strong> Giảm ngứa</li>
                  <li><strong>Mặc quần áo mỏng:</strong> Thoáng mát</li>
                  <li><strong>Không gãi:</strong> Tránh gãi</li>
                  <li><strong>Cắt móng tay:</strong> Ngắn và sạch</li>
                  <li><strong>Băng vết thương:</strong> Nếu cần</li>
                  <li><strong>Theo dõi:</strong> Nhiễm trùng</li>
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
