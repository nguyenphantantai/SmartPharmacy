import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function RoseolaPage() {
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
    "Bệnh Theo Mùa",
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
                <BreadcrumbPage>Sốt phát ban</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">02/10/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sốt phát ban là gì? Những điều bạn cần biết về bệnh sốt phát ban
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
                  Sốt phát ban thường có hai loại là sốt phát ban đỏ và sốt phát ban đào. 
                  Cả hai loại này đều có các triệu chứng và nguyên nhân gây bệnh tương tự nhau. 
                  Đối với trẻ nhỏ, cha mẹ cần hiểu rõ các biểu hiện của bệnh để phát hiện và 
                  điều trị kịp thời, đảm bảo hiệu quả cho con.
                </p>

                <h3 className="text-xl font-semibold mb-3">Sốt phát ban là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt phát ban là tình trạng nhiễm trùng cấp tính gây ra bởi vi rút Herpes 6 hoặc 7 
                  với biểu hiện đặc trưng là các nốt ban đỏ xuất hiện trên da kèm với đó là hiện tượng sốt cao. 
                  Sốt phát ban là bệnh thường gặp ở trẻ nhỏ, tuy nhiên với điều kiện thuận lợi bệnh cũng có thể 
                  dễ dàng tấn công và lây sang cho người lớn.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của sốt phát ban:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Roseola infantum</li>
                  <li><strong>Tính chất:</strong> Nhiễm trùng cấp tính</li>
                  <li><strong>Triệu chứng chính:</strong> Sốt cao, phát ban</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở trẻ em</li>
                  <li><strong>Điều trị:</strong> Điều trị triệu chứng</li>
                  <li><strong>Phòng ngừa:</strong> Vệ sinh, tránh tiếp xúc</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Sốt phát ban</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của sốt phát ban thường xuất hiện từ 5-15 ngày sau khi nhiễm virus. 
                  Bệnh có thể diễn biến từ nhẹ đến nặng và có thể gây khó chịu cho trẻ.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng giai đoạn đầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> Sốt đột ngột 39-40°C</li>
                  <li><strong>Đau đầu:</strong> Đau đầu nhẹ</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi, khó chịu</li>
                  <li><strong>Chán ăn:</strong> Không muốn ăn</li>
                  <li><strong>Khó ngủ:</strong> Khó ngủ, quấy khóc</li>
                  <li><strong>Sưng hạch:</strong> Sưng hạch cổ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng phát ban:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ban đỏ:</strong> Nốt ban đỏ nhỏ</li>
                  <li><strong>Vị trí:</strong> Thân mình, cổ, mặt</li>
                  <li><strong>Kích thước:</strong> 2-5mm</li>
                  <li><strong>Màu sắc:</strong> Hồng, đỏ</li>
                  <li><strong>Không ngứa:</strong> Thường không ngứa</li>
                  <li><strong>Thời gian:</strong> 1-3 ngày</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ho:</strong> Ho nhẹ</li>
                  <li><strong>Sổ mũi:</strong> Chảy nước mũi</li>
                  <li><strong>Tiêu chảy:</strong> Tiêu chảy nhẹ</li>
                  <li><strong>Nôn:</strong> Nôn mửa</li>
                  <li><strong>Co giật:</strong> Co giật do sốt</li>
                  <li><strong>Mất nước:</strong> Mất nước nhẹ</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Sốt phát ban</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt phát ban do virus Herpes 6 và 7 gây ra. Hiểu biết về nguyên nhân giúp có 
                  biện pháp phòng ngừa hiệu quả.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Virus gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>HHV-6:</strong> Human Herpesvirus 6</li>
                  <li><strong>HHV-7:</strong> Human Herpesvirus 7</li>
                  <li><strong>Tính chất:</strong> DNA virus</li>
                  <li><strong>Khả năng lây:</strong> Cao</li>
                  <li><strong>Miễn dịch:</strong> Suốt đời</li>
                  <li><strong>Biến chủng:</strong> Ít biến đổi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Đường lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiếp xúc:</strong> Tiếp xúc trực tiếp</li>
                  <li><strong>Nước bọt:</strong> Qua nước bọt</li>
                  <li><strong>Dịch tiết:</strong> Dịch tiết mũi họng</li>
                  <li><strong>Đồ dùng:</strong> Dùng chung đồ dùng</li>
                  <li><strong>Không khí:</strong> Qua không khí</li>
                  <li><strong>Mẹ con:</strong> Từ mẹ sang con</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hệ miễn dịch yếu</li>
                  <li>Tiếp xúc gần</li>
                  <li>Môi trường đông đúc</li>
                  <li>Vệ sinh kém</li>
                  <li>Thời tiết thay đổi</li>
                  <li>Stress</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc sốt phát ban hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> 6 tháng - 3 tuổi</li>
                  <li><strong>Hệ miễn dịch yếu:</strong> Suy giảm miễn dịch</li>
                  <li><strong>Tiếp xúc:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Môi trường:</strong> Môi trường đông đúc</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh kém</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ lớn hơn</li>
                  <li><strong>Giới tính:</strong> Không phân biệt</li>
                  <li><strong>Địa lý:</strong> Vùng nhiệt đới</li>
                  <li><strong>Mùa:</strong> Mùa xuân, hè</li>
                  <li><strong>Điều kiện:</strong> Điều kiện sống kém</li>
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hệ miễn dịch khỏe</li>
                  <li>Vệ sinh tốt</li>
                  <li>Dinh dưỡng đầy đủ</li>
                  <li>Tránh tiếp xúc</li>
                  <li>Môi trường sạch</li>
                  <li>Khám sức khỏe định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Sốt phát ban</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán sốt phát ban dựa trên triệu chứng lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán sớm rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> Sốt đột ngột</li>
                  <li><strong>Phát ban:</strong> Ban đỏ đặc trưng</li>
                  <li><strong>Hạch:</strong> Sưng hạch cổ</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng khác</li>
                  <li><strong>Tuổi:</strong> Tuổi đặc trưng</li>
                  <li><strong>Tiền sử:</strong> Tiền sử tiếp xúc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Bạch cầu</li>
                  <li><strong>Xét nghiệm virus:</strong> HHV-6, HHV-7</li>
                  <li><strong>Kháng thể:</strong> IgM, IgG</li>
                  <li><strong>PCR:</strong> Phát hiện DNA</li>
                  <li><strong>Cấy virus:</strong> Cấy virus</li>
                  <li><strong>Xét nghiệm khác:</strong> Theo chỉ định</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Sốt + phát ban</li>
                  <li><strong>Tuổi:</strong> 6 tháng - 3 tuổi</li>
                  <li><strong>Xét nghiệm:</strong> Virus dương tính</li>
                  <li><strong>Loại trừ:</strong> Bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Sốt phát ban</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa sốt phát ban tập trung vào việc vệ sinh và tránh tiếp xúc. 
                  Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay:</strong> Rửa tay thường xuyên</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh cá nhân</li>
                  <li><strong>Không dùng chung:</strong> Không dùng chung đồ</li>
                  <li><strong>Che miệng:</strong> Che miệng khi ho</li>
                  <li><strong>Không tiếp xúc:</strong> Tránh tiếp xúc gần</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh đồ dùng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thông thoáng:</strong> Thông thoáng</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh nhà cửa</li>
                  <li><strong>Khử trùng:</strong> Khử trùng đồ dùng</li>
                  <li><strong>Giặt:</strong> Giặt quần áo</li>
                  <li><strong>Dọn dẹp:</strong> Dọn dẹp thường xuyên</li>
                  <li><strong>Không khí:</strong> Làm sạch không khí</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tránh tiếp xúc người bệnh</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Tăng cường miễn dịch</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Sốt phát ban</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị sốt phát ban chủ yếu là điều trị triệu chứng và hỗ trợ. 
                  Không có thuốc đặc hiệu để điều trị virus Herpes.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hạ sốt:</strong> Paracetamol</li>
                  <li><strong>Giảm đau:</strong> Thuốc giảm đau</li>
                  <li><strong>Bù nước:</strong> Uống nhiều nước</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Theo dõi:</strong> Theo dõi triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Truyền dịch:</strong> Truyền dịch</li>
                  <li><strong>Hỗ trợ hô hấp:</strong> Thở oxy</li>
                  <li><strong>Hỗ trợ tim mạch:</strong> Thuốc tim mạch</li>
                  <li><strong>Hỗ trợ gan:</strong> Thuốc bảo vệ gan</li>
                  <li><strong>Hỗ trợ thận:</strong> Thuốc bảo vệ thận</li>
                  <li><strong>Hỗ trợ:</strong> Hỗ trợ gia đình</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị biến chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Co giật:</strong> Thuốc chống co giật</li>
                  <li><strong>Mất nước:</strong> Bù nước điện giải</li>
                  <li><strong>Nhiễm trùng:</strong> Kháng sinh</li>
                  <li><strong>Suy hô hấp:</strong> Thở máy</li>
                  <li><strong>Suy gan:</strong> Hỗ trợ gan</li>
                  <li><strong>Biến chứng khác:</strong> Điều trị triệu chứng</li>
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
