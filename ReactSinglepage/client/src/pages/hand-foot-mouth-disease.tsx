import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart, Play } from "lucide-react";
import { useState } from "react";

export default function HandFootMouthDiseasePage() {
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
    "Bệnh Truyền Nhiễm",
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai"
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
                <BreadcrumbPage>Tay chân miệng</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">19/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh tay chân miệng là gì? Tổng quan về bệnh tay chân miệng
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan về Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Theo thông tin từ Cục Y tế Dự phòng, từ đầu năm đến nay, Việt Nam đã ghi nhận 10.196 ca mắc bệnh tay chân miệng, 
                  tăng 2,3 lần so với cùng kỳ năm 2023. Trong đó, miền Nam có hơn 7.500 ca (chiếm 74,1% số ca cả nước), 
                  miền Bắc hơn 1.300 ca, miền Trung khoảng 1.000 ca và Tây Nguyên ít nhất 200 ca.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh tay chân miệng là một bệnh truyền nhiễm cấp tính do virus gây ra, thường gặp ở trẻ em dưới 5 tuổi. 
                  Bệnh đặc trưng bởi các tổn thương da và niêm mạc dưới dạng phỏng nước ở các vị trí đặc biệt: miệng, 
                  lòng bàn tay, lòng bàn chân, mông, gối.
                </p>
                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Virus gây bệnh:</strong> Chủ yếu do Enterovirus (EV71, Coxsackie A16)</li>
                  <li><strong>Đối tượng:</strong> Chủ yếu trẻ em dưới 5 tuổi</li>
                  <li><strong>Tính lây lan:</strong> Rất cao, dễ bùng phát thành dịch</li>
                  <li><strong>Mùa dịch:</strong> Thường xảy ra từ tháng 3-5 và 9-12</li>
                  <li><strong>Biến chứng:</strong> Có thể gây viêm não, viêm màng não</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh tay chân miệng có thời gian ủ bệnh từ 3-7 ngày. Triệu chứng thường xuất hiện theo các giai đoạn 
                  và có thể khác nhau tùy theo độ tuổi và tình trạng sức khỏe của trẻ.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng ban đầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt nhẹ:</strong> 37.5-38.5°C</li>
                  <li><strong>Mệt mỏi:</strong> Trẻ quấy khóc, bỏ ăn</li>
                  <li><strong>Đau họng:</strong> Khó nuốt, chảy nước dãi</li>
                  <li><strong>Ho nhẹ:</strong> Ho khan</li>
                  <li><strong>Chán ăn:</strong> Không muốn ăn uống</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng đặc trưng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phỏng nước trong miệng:</strong> Đau, khó ăn uống</li>
                  <li><strong>Phỏng nước ở tay:</strong> Lòng bàn tay, ngón tay</li>
                  <li><strong>Phỏng nước ở chân:</strong> Lòng bàn chân, ngón chân</li>
                  <li><strong>Phỏng nước ở mông:</strong> Vùng mông, đùi</li>
                  <li><strong>Phỏng nước ở gối:</strong> Vùng đầu gối</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sốt cao trên 39°C</li>
                  <li>Giật mình, run chi</li>
                  <li>Khó thở, thở nhanh</li>
                  <li>Da xanh tái</li>
                  <li>Nôn nhiều</li>
                  <li>Lơ mơ, hôn mê</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh tay chân miệng do các virus thuộc nhóm Enterovirus gây ra. Có nhiều chủng virus có thể gây bệnh, 
                  trong đó EV71 và Coxsackie A16 là hai chủng phổ biến nhất.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Virus gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Enterovirus 71 (EV71):</strong> Nguy hiểm nhất, dễ gây biến chứng</li>
                  <li><strong>Coxsackie A16:</strong> Phổ biến nhất, ít biến chứng</li>
                  <li><strong>Coxsackie A6:</strong> Gây triệu chứng nặng hơn</li>
                  <li><strong>Coxsackie A10:</strong> Ít phổ biến</li>
                  <li><strong>Enterovirus khác:</strong> Một số chủng khác</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Cơ chế lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đường tiêu hóa:</strong> Qua thức ăn, nước uống bị nhiễm</li>
                  <li><strong>Tiếp xúc trực tiếp:</strong> Với dịch tiết của người bệnh</li>
                  <li><strong>Tiếp xúc gián tiếp:</strong> Qua đồ chơi, đồ dùng bị nhiễm</li>
                  <li><strong>Đường hô hấp:</strong> Qua giọt bắn khi ho, hắt hơi</li>
                  <li><strong>Thời gian lây:</strong> Từ 1 tuần trước đến 2 tuần sau khi có triệu chứng</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù bệnh tay chân miệng có thể xảy ra ở mọi lứa tuổi, nhưng một số nhóm đối tượng có nguy cơ cao hơn 
                  và dễ gặp biến chứng nghiêm trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nhóm nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em dưới 5 tuổi:</strong> Đặc biệt dưới 3 tuổi</li>
                  <li><strong>Trẻ suy dinh dưỡng:</strong> Hệ miễn dịch yếu</li>
                  <li><strong>Trẻ có bệnh mạn tính:</strong> Tim bẩm sinh, suy giảm miễn dịch</li>
                  <li><strong>Trẻ sinh non:</strong> Hệ miễn dịch chưa hoàn thiện</li>
                  <li><strong>Người lớn suy giảm miễn dịch:</strong> HIV, ung thư</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố làm tăng nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sống trong môi trường đông đúc</li>
                  <li>Điều kiện vệ sinh kém</li>
                  <li>Tiếp xúc với người bệnh</li>
                  <li>Không rửa tay thường xuyên</li>
                  <li>Sử dụng chung đồ dùng cá nhân</li>
                  <li>Đi nhà trẻ, trường học</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bệnh tay chân miệng chủ yếu dựa trên lâm sàng, đặc biệt là các tổn thương đặc trưng. 
                  Trong một số trường hợp cần xét nghiệm để xác định chủng virus và đánh giá nguy cơ biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tổn thương đặc trưng:</strong> Phỏng nước ở tay, chân, miệng</li>
                  <li><strong>Triệu chứng toàn thân:</strong> Sốt, mệt mỏi, chán ăn</li>
                  <li><strong>Tiền sử:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Độ tuổi:</strong> Chủ yếu trẻ em dưới 5 tuổi</li>
                  <li><strong>Mùa dịch:</strong> Trong mùa dịch tay chân miệng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>RT-PCR:</strong> Phát hiện RNA virus</li>
                  <li><strong>Nuôi cấy virus:</strong> Xác định chủng virus</li>
                  <li><strong>Xét nghiệm kháng thể:</strong> Đánh giá miễn dịch</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu, CRP</li>
                  <li><strong>Dịch não tủy:</strong> Khi có biến chứng thần kinh</li>
                  <li><strong>X-quang ngực:</strong> Phát hiện biến chứng phổi</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại chưa có vaccine phòng ngừa bệnh tay chân miệng. Việc phòng ngừa chủ yếu dựa vào 
                  các biện pháp vệ sinh cá nhân và môi trường.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay thường xuyên:</strong> Với xà phòng, đặc biệt trước khi ăn</li>
                  <li><strong>Vệ sinh răng miệng:</strong> Đánh răng, súc miệng</li>
                  <li><strong>Tắm rửa sạch sẽ:</strong> Hàng ngày</li>
                  <li><strong>Không mút tay:</strong> Tránh đưa tay vào miệng</li>
                  <li><strong>Che miệng khi ho:</strong> Sử dụng khăn giấy</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Làm sạch đồ chơi, đồ dùng</li>
                  <li>Khử trùng bề mặt thường xuyên</li>
                  <li>Giữ môi trường thông thoáng</li>
                  <li>Xử lý chất thải đúng cách</li>
                  <li>Cách ly người bệnh</li>
                  <li>Không dùng chung đồ dùng cá nhân</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh tay chân miệng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại chưa có thuốc đặc hiệu để điều trị bệnh tay chân miệng. Điều trị chủ yếu là hỗ trợ 
                  triệu chứng và ngăn ngừa biến chứng. Việc chăm sóc đúng cách rất quan trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hạ sốt:</strong> Paracetamol khi sốt trên 38.5°C</li>
                  <li><strong>Giảm đau:</strong> Thuốc giảm đau cho tổn thương miệng</li>
                  <li><strong>Bổ sung nước:</strong> Uống đủ nước, điện giải</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn thức ăn mềm, lỏng</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Vệ sinh:</strong> Giữ sạch các tổn thương</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc tại nhà:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Cách ly trẻ trong 10-14 ngày</li>
                  <li>Theo dõi nhiệt độ thường xuyên</li>
                  <li>Quan sát các dấu hiệu nguy hiểm</li>
                  <li>Cho trẻ ăn thức ăn mát, mềm</li>
                  <li>Tránh thức ăn cay, nóng</li>
                  <li>Giữ môi trường sạch sẽ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khi nào cần nhập viện:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sốt cao trên 39°C</li>
                  <li>Giật mình, run chi</li>
                  <li>Khó thở, thở nhanh</li>
                  <li>Da xanh tái</li>
                  <li>Nôn nhiều</li>
                  <li>Lơ mơ, hôn mê</li>
                  <li>Trẻ dưới 3 tuổi</li>
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
