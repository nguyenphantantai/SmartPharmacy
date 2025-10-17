import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function CoughPage() {
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
    "Bệnh Hô Hấp"
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
                <BreadcrumbPage>Ho</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">12/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Ho là gì? Dấu hiệu, nguyên nhân, chẩn đoán và điều trị
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
                  Ho là phản xạ tự nhiên của cơ thể, nhưng ho đôi khi còn là dấu hiệu của bệnh tật. 
                  Chẳng hạn như lao phổi, ung thư phổi hoặc một tình trạng viêm trong cơ thể nghiêm trọng. 
                  Vậy ho là gì? Chúng ta cùng tìm hiểu bài viết dưới đây nhé.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Ho là một phản xạ tự nhiên của cơ thể giúp loại bỏ các chất gây kích ứng ra khỏi đường hô hấp. 
                  Vì vậy, phản xạ ho cũng là cách để cơ thể tự bảo vệ và chữa lành.
                </p>

                <h3 className="text-xl font-semibold mb-3">Định nghĩa ho:</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ho là một phản xạ tự nhiên của cơ thể, được kích hoạt khi có chất gây kích ứng trong đường hô hấp. 
                  Phản xạ này giúp làm sạch đường thở và loại bỏ các chất có hại như bụi, vi khuẩn, virus hoặc dịch nhầy.
                </p>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Ho</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của ho có thể khác nhau tùy thuộc vào nguyên nhân và mức độ nghiêm trọng. 
                  Ho có thể là triệu chứng của nhiều bệnh lý khác nhau, từ cảm lạnh thông thường đến các bệnh nghiêm trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ho khan:</strong> Ho không có đờm</li>
                  <li><strong>Ho có đờm:</strong> Ho kèm theo đờm</li>
                  <li><strong>Ho dai dẳng:</strong> Ho kéo dài</li>
                  <li><strong>Ho từng cơn:</strong> Ho theo từng cơn</li>
                  <li><strong>Ho về đêm:</strong> Ho nhiều vào ban đêm</li>
                  <li><strong>Ho khi nằm:</strong> Ho khi nằm xuống</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo nguyên nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cảm lạnh:</strong> Ho khan, ho có đờm</li>
                  <li><strong>Cúm:</strong> Ho khan, sốt</li>
                  <li><strong>Viêm phế quản:</strong> Ho có đờm, khó thở</li>
                  <li><strong>Hen suyễn:</strong> Ho khan, khó thở</li>
                  <li><strong>Viêm phổi:</strong> Ho có đờm, sốt cao</li>
                  <li><strong>Lao phổi:</strong> Ho có đờm, ho ra máu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đau ngực:</strong> Đau ngực khi ho</li>
                  <li><strong>Khó thở:</strong> Khó thở</li>
                  <li><strong>Sốt:</strong> Sốt</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi</li>
                  <li><strong>Đau họng:</strong> Đau họng</li>
                  <li><strong>Khàn tiếng:</strong> Khàn tiếng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Ho</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ho có thể do nhiều nguyên nhân khác nhau, từ các bệnh lý đơn giản đến các tình trạng nghiêm trọng. 
                  Hiểu biết về nguyên nhân giúp có biện pháp điều trị và phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân nhiễm trùng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus:</strong> Virus cảm lạnh, virus cúm</li>
                  <li><strong>Vi khuẩn:</strong> Vi khuẩn gây viêm phổi</li>
                  <li><strong>Nấm:</strong> Nấm phổi</li>
                  <li><strong>Ký sinh trùng:</strong> Ký sinh trùng phổi</li>
                  <li><strong>Vi khuẩn lao:</strong> Vi khuẩn lao</li>
                  <li><strong>Nhiễm trùng hỗn hợp:</strong> Nhiễm trùng hỗn hợp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân không nhiễm trùng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dị ứng:</strong> Dị ứng phấn hoa, bụi</li>
                  <li><strong>Hen suyễn:</strong> Hen suyễn</li>
                  <li><strong>COPD:</strong> Bệnh phổi tắc nghẽn mạn tính</li>
                  <li><strong>Trào ngược:</strong> Trào ngược dạ dày</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc</li>
                  <li><strong>Ô nhiễm:</strong> Ô nhiễm không khí</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ung thư phổi:</strong> Ung thư phổi</li>
                  <li><strong>Ung thư vòm họng:</strong> Ung thư vòm họng</li>
                  <li><strong>Suy tim:</strong> Suy tim</li>
                  <li><strong>Thuyên tắc phổi:</strong> Thuyên tắc phổi</li>
                  <li><strong>Viêm phổi:</strong> Viêm phổi</li>
                  <li><strong>Lao phổi:</strong> Lao phổi</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao bị ho dai dẳng hoặc ho do các bệnh nghiêm trọng hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Tuổi:</strong> Người cao tuổi</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Môi trường:</strong> Môi trường ô nhiễm</li>
                  <li><strong>Bệnh mạn tính:</strong> Bệnh mạn tính</li>
                  <li><strong>Hệ miễn dịch:</strong> Hệ miễn dịch yếu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Thiếu ngủ:</strong> Thiếu ngủ</li>
                  <li><strong>Vận động:</strong> Ít vận động</li>
                  <li><strong>Thuốc:</strong> Sử dụng thuốc</li>
                  <li><strong>Di truyền:</strong> Di truyền</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Không hút thuốc</li>
                  <li>Tránh ô nhiễm</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Tập thể dục</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Tiêm phòng</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Ho</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán ho dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử bệnh</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám phổi:</strong> Khám phổi</li>
                  <li><strong>Khám họng:</strong> Khám họng</li>
                  <li><strong>Khám tim:</strong> Khám tim</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>X-quang phổi:</strong> Chụp X-quang phổi</li>
                  <li><strong>CT scan:</strong> Chụp cắt lớp</li>
                  <li><strong>Xét nghiệm máu:</strong> Xét nghiệm máu</li>
                  <li><strong>Cấy đờm:</strong> Cấy đờm</li>
                  <li><strong>Nội soi:</strong> Nội soi phế quản</li>
                  <li><strong>Xét nghiệm khác:</strong> Xét nghiệm hỗ trợ</li>
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
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Ho</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa ho tập trung vào việc tránh các yếu tố nguy cơ và tăng cường hệ miễn dịch. 
                  Đây là cách hiệu quả nhất để ngăn ngừa ho và các bệnh liên quan.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hút thuốc:</strong> Không hút thuốc</li>
                  <li><strong>Ô nhiễm:</strong> Tránh ô nhiễm</li>
                  <li><strong>Dị ứng:</strong> Tránh dị ứng</li>
                  <li><strong>Nhiễm trùng:</strong> Tránh nhiễm trùng</li>
                  <li><strong>Stress:</strong> Giảm stress</li>
                  <li><strong>Thời tiết:</strong> Bảo vệ khỏi thay đổi thời tiết</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng cường miễn dịch:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng tốt</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Vitamin:</strong> Bổ sung vitamin</li>
                  <li><strong>Tiêm phòng:</strong> Tiêm phòng</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh cá nhân</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Điều trị bệnh mạn tính</li>
                  <li>Tránh tiếp xúc người bệnh</li>
                  <li>Rửa tay thường xuyên</li>
                  <li>Đeo khẩu trang</li>
                  <li>Giữ ấm cơ thể</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Ho</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị ho bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm triệu chứng, loại bỏ nguyên nhân và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc giảm ho:</strong> Thuốc giảm ho</li>
                  <li><strong>Thuốc long đờm:</strong> Thuốc long đờm</li>
                  <li><strong>Thuốc kháng viêm:</strong> Thuốc kháng viêm</li>
                  <li><strong>Thuốc giảm đau:</strong> Thuốc giảm đau</li>
                  <li><strong>Thuốc khác:</strong> Thuốc hỗ trợ</li>
                  <li><strong>Liệu pháp:</strong> Liệu pháp hỗ trợ</li>
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

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Uống nhiều nước</li>
                  <li><strong>Xông hơi:</strong> Xông hơi</li>
                  <li><strong>Massage:</strong> Massage ngực</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng tốt</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục nhẹ</li>
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
