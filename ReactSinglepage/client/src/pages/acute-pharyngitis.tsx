import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AcutePharyngitisPage() {
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
    "Bệnh Theo Mùa",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Đối tượng",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Tai Mũi Họng",
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
                <BreadcrumbPage>Viêm họng cấp</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">19/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Viêm họng cấp là gì? Những điều cần biết về viêm họng cấp
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
                  Viêm họng cấp là hiện tượng viêm của tổ chức niêm mạc nằm ở phần sau của cổ họng. 
                  Triệu chứng thường gặp là đau họng. Ngoài ra viêm họng còn gây ra các triệu chứng 
                  như ngứa họng hoặc nuốt vướng, nuốt đau.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của viêm họng cấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tính chất:</strong> Viêm cấp tính</li>
                  <li><strong>Vị trí:</strong> Niêm mạc họng</li>
                  <li><strong>Triệu chứng:</strong> Đau họng, ngứa họng</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở mọi lứa tuổi</li>
                  <li><strong>Nguyên nhân:</strong> Virus, vi khuẩn</li>
                  <li><strong>Điều trị:</strong> Điều trị triệu chứng</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Viêm họng cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của viêm họng cấp thường xuất hiện đột ngột và có thể kéo dài từ vài ngày 
                  đến một tuần. Các triệu chứng có thể từ nhẹ đến nặng tùy thuộc vào nguyên nhân gây bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đau họng:</strong> Đau họng, đau khi nuốt</li>
                  <li><strong>Ngứa họng:</strong> Ngứa họng, khó chịu</li>
                  <li><strong>Nuốt vướng:</strong> Nuốt vướng, nuốt đau</li>
                  <li><strong>Khô họng:</strong> Khô họng, khát nước</li>
                  <li><strong>Ho:</strong> Ho khan hoặc có đờm</li>
                  <li><strong>Khàn tiếng:</strong> Khàn tiếng, mất tiếng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng toàn thân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt:</strong> Sốt nhẹ đến sốt cao</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi, khó chịu</li>
                  <li><strong>Đau đầu:</strong> Đau đầu</li>
                  <li><strong>Đau cơ:</strong> Đau cơ, đau khớp</li>
                  <li><strong>Chán ăn:</strong> Chán ăn</li>
                  <li><strong>Buồn nôn:</strong> Buồn nôn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sưng hạch:</strong> Sưng hạch cổ</li>
                  <li><strong>Đỏ họng:</strong> Họng đỏ, sưng</li>
                  <li><strong>Mủ:</strong> Có mủ ở họng</li>
                  <li><strong>Hơi thở:</strong> Hơi thở hôi</li>
                  <li><strong>Khó thở:</strong> Khó thở (hiếm)</li>
                  <li><strong>Phát ban:</strong> Phát ban (hiếm)</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Viêm họng cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm họng cấp có thể do nhiều nguyên nhân khác nhau, chủ yếu là do virus và vi khuẩn. 
                  Hiểu biết về nguyên nhân giúp có biện pháp điều trị và phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân do virus:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rhinovirus:</strong> Virus cảm lạnh</li>
                  <li><strong>Adenovirus:</strong> Virus adenovirus</li>
                  <li><strong>Influenza:</strong> Virus cúm</li>
                  <li><strong>Parainfluenza:</strong> Virus parainfluenza</li>
                  <li><strong>Coronavirus:</strong> Virus coronavirus</li>
                  <li><strong>Enterovirus:</strong> Virus enterovirus</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân do vi khuẩn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Streptococcus:</strong> Liên cầu khuẩn</li>
                  <li><strong>Staphylococcus:</strong> Tụ cầu khuẩn</li>
                  <li><strong>Haemophilus:</strong> Haemophilus influenzae</li>
                  <li><strong>Mycoplasma:</strong> Mycoplasma pneumoniae</li>
                  <li><strong>Chlamydia:</strong> Chlamydia pneumoniae</li>
                  <li><strong>Corynebacterium:</strong> Corynebacterium</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Thay đổi thời tiết</li>
                  <li>Ô nhiễm môi trường</li>
                  <li>Hút thuốc</li>
                  <li>Uống rượu</li>
                  <li>Stress</li>
                  <li>Hệ miễn dịch yếu</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc viêm họng cấp hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ em, người cao tuổi</li>
                  <li><strong>Hệ miễn dịch:</strong> Hệ miễn dịch yếu</li>
                  <li><strong>Tiếp xúc:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Môi trường:</strong> Môi trường ô nhiễm</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc</li>
                  <li><strong>Rượu bia:</strong> Uống rượu bia</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghề nghiệp:</strong> Giáo viên, ca sĩ</li>
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Thiếu ngủ:</strong> Thiếu ngủ</li>
                  <li><strong>Vận động:</strong> Ít vận động</li>
                  <li><strong>Bệnh mạn tính:</strong> Bệnh mạn tính</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh cá nhân tốt</li>
                  <li>Rửa tay thường xuyên</li>
                  <li>Tránh tiếp xúc người bệnh</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Tập thể dục</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Viêm họng cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán viêm họng cấp dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử bệnh</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám họng:</strong> Khám họng</li>
                  <li><strong>Khám hạch:</strong> Khám hạch cổ</li>
                  <li><strong>Khám tai mũi:</strong> Khám tai mũi</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cấy dịch:</strong> Cấy dịch họng</li>
                  <li><strong>Test nhanh:</strong> Test nhanh liên cầu</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu</li>
                  <li><strong>CRP:</strong> Protein phản ứng C</li>
                  <li><strong>ESR:</strong> Tốc độ lắng máu</li>
                  <li><strong>Xét nghiệm khác:</strong> Theo chỉ định</li>
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
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Viêm họng cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa viêm họng cấp tập trung vào việc vệ sinh cá nhân và tránh các yếu tố nguy cơ. 
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

                <h3 className="text-xl font-semibold mb-3">Tăng cường miễn dịch:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dinh dưỡng:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Vitamin:</strong> Bổ sung vitamin</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục</li>
                  <li><strong>Stress:</strong> Giảm stress</li>
                  <li><strong>Ngủ:</strong> Ngủ đủ giấc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tránh tiếp xúc người bệnh</li>
                  <li>Không hút thuốc</li>
                  <li>Không uống rượu</li>
                  <li>Tránh ô nhiễm</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Tiêm phòng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Viêm họng cấp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị viêm họng cấp bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm triệu chứng và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc giảm đau:</strong> Paracetamol, ibuprofen</li>
                  <li><strong>Thuốc kháng viêm:</strong> NSAIDs</li>
                  <li><strong>Thuốc ho:</strong> Thuốc ho</li>
                  <li><strong>Thuốc súc họng:</strong> Thuốc súc họng</li>
                  <li><strong>Thuốc ngậm:</strong> Thuốc ngậm họng</li>
                  <li><strong>Thuốc khác:</strong> Thuốc hỗ trợ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị căn nguyên:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng sinh:</strong> Kháng sinh (nếu do vi khuẩn)</li>
                  <li><strong>Kháng virus:</strong> Kháng virus (nếu do virus)</li>
                  <li><strong>Thuốc khác:</strong> Thuốc đặc hiệu</li>
                  <li><strong>Liệu pháp:</strong> Liệu pháp hỗ trợ</li>
                  <li><strong>Điều trị:</strong> Điều trị biến chứng</li>
                  <li><strong>Theo dõi:</strong> Theo dõi điều trị</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Uống nhiều nước</li>
                  <li><strong>Ăn uống:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Súc họng:</strong> Súc họng bằng nước muối</li>
                  <li><strong>Hít thở:</strong> Hít thở không khí ẩm</li>
                  <li><strong>Tránh:</strong> Tránh kích thích</li>
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
