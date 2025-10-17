import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function Type1DiabetesPage() {
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
    "Bệnh Nội Tiết - Chuyển Hóa",
    "Bệnh Về Máu", 
    "Bệnh Trẻ Em",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Truyền Nhiễm",
    "Bệnh Theo Mùa"
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
                <BreadcrumbPage>Tiểu đường tuýp 1</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">27/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tiểu đường tuýp 1: Nguyên nhân, triệu chứng và điều trị
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 1 là một bệnh tự miễn dịch, trong đó hệ thống miễn dịch của cơ thể tấn công 
                  và phá hủy các tế bào beta trong tuyến tụy (nơi sản xuất insulin). Đây là một tình trạng mãn tính 
                  thường xuất hiện ở trẻ em và thanh niên, đòi hỏi điều trị insulin suốt đời. Bài viết này sẽ 
                  khám phá nguyên nhân, triệu chứng, chẩn đoán và cách quản lý bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiểu đường tuýp 1 là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường là một rối loạn chuyển hóa mãn tính, trong đó cơ thể không thể sử dụng glucose 
                  do thiếu hoặc không hiệu quả của insulin. Cơ thể bình thường sử dụng glucose, lipid và protein 
                  để tạo năng lượng, với glucose là nguồn năng lượng chính cho các tế bào, não và cơ bắp. 
                  Insulin, một hormone được sản xuất bởi tuyến tụy nội tiết, là cần thiết để glucose di chuyển 
                  từ máu vào các tế bào để chuyển hóa và sản xuất năng lượng.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường có hai loại chính (Tuýp 1 và Tuýp 2). Tiểu đường tuýp 1 (trước đây gọi là 
                  tiểu đường phụ thuộc insulin) là tình trạng liên quan đến sự phá hủy các tế bào beta tuyến tụy 
                  (các tế bào tiết insulin), dẫn đến thiếu insulin và cần phải tiêm insulin từ bên ngoài.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên cũ:</strong> Tiểu đường phụ thuộc insulin</li>
                  <li><strong>Tỷ lệ:</strong> Chiếm 10% tổng số ca tiểu đường</li>
                  <li><strong>Tuổi khởi phát:</strong> Thường ở trẻ em và thanh niên</li>
                  <li><strong>Nguyên nhân:</strong> Phá hủy tế bào beta tuyến tụy</li>
                  <li><strong>Điều trị:</strong> Bắt buộc phải tiêm insulin</li>
                  <li><strong>Tính chất:</strong> Bệnh mãn tính, không thể chữa khỏi</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tiểu đường tuýp 1</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của tiểu đường tuýp 1 thường xuất hiện đột ngột và có thể nghiêm trọng. 
                  Các triệu chứng này là kết quả của việc đường huyết cao và thiếu insulin trong cơ thể.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khát nước nhiều:</strong> Uống nước liên tục, không thể thỏa mãn</li>
                  <li><strong>Đi tiểu thường xuyên:</strong> Tiểu nhiều lần, đặc biệt vào ban đêm</li>
                  <li><strong>Đói liên tục:</strong> Cảm giác đói dữ dội</li>
                  <li><strong>Sụt cân không giải thích được:</strong> Mặc dù ăn nhiều</li>
                  <li><strong>Mệt mỏi cực độ:</strong> Cảm giác kiệt sức</li>
                  <li><strong>Nhìn mờ:</strong> Thị lực giảm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở trẻ em:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đái dầm:</strong> Trẻ đã lớn vẫn đái dầm</li>
                  <li><strong>Thay đổi hành vi:</strong> Cáu kỉnh, khó chịu</li>
                  <li><strong>Giảm hiệu suất học tập:</strong> Khó tập trung</li>
                  <li><strong>Nhiễm trùng tái phát:</strong> Nhiễm trùng da, nấm</li>
                  <li><strong>Chậm phát triển:</strong> Tăng trưởng chậm</li>
                  <li><strong>Buồn nôn, nôn:</strong> Đặc biệt vào buổi sáng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nhiễm toan ceton:</strong> Hơi thở có mùi acetone</li>
                  <li><strong>Hôn mê:</strong> Mất ý thức</li>
                  <li><strong>Thở nhanh:</strong> Thở sâu và nhanh</li>
                  <li><strong>Đau bụng:</strong> Đau dữ dội</li>
                  <li><strong>Da khô, nóng:</strong> Mất nước nghiêm trọng</li>
                  <li><strong>Nhịp tim nhanh:</strong> Tim đập nhanh</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây bệnh Tiểu đường tuýp 1</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 1 chiếm 10% tổng số ca tiểu đường. Nguyên nhân là do sự phá hủy các tế bào 
                  beta tuyến tụy, dẫn đến cơ thể sản xuất rất ít hoặc không có insulin.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Cơ chế sinh bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tự miễn dịch:</strong> Hệ miễn dịch tấn công tế bào beta</li>
                  <li><strong>Phá hủy tế bào beta:</strong> Tế bào sản xuất insulin bị hủy</li>
                  <li><strong>Thiếu insulin:</strong> Không có insulin để chuyển glucose</li>
                  <li><strong>Đường huyết tăng:</strong> Glucose tích tụ trong máu</li>
                  <li><strong>Rối loạn chuyển hóa:</strong> Cơ thể không sử dụng được glucose</li>
                  <li><strong>Phá hủy protein và lipid:</strong> Để tạo năng lượng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố kích hoạt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Di truyền:</strong> Gen HLA-DR3, HLA-DR4</li>
                  <li><strong>Nhiễm virus:</strong> Coxsackie, Rubella, CMV</li>
                  <li><strong>Yếu tố môi trường:</strong> Thực phẩm, hóa chất</li>
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Thiếu vitamin D:</strong> Liên quan đến miễn dịch</li>
                  <li><strong>Tuổi:</strong> Thường khởi phát trước 30 tuổi</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù tiểu đường tuýp 1 có thể xảy ra ở mọi lứa tuổi, nhưng một số nhóm đối tượng có nguy cơ 
                  cao hơn. Hiểu biết về các yếu tố nguy cơ giúp phát hiện sớm và điều trị kịp thời.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ em và thanh niên (5-25 tuổi)</li>
                  <li><strong>Tiền sử gia đình:</strong> Có người thân mắc tiểu đường tuýp 1</li>
                  <li><strong>Gen di truyền:</strong> HLA-DR3, HLA-DR4</li>
                  <li><strong>Bệnh tự miễn khác:</strong> Viêm tuyến giáp, bệnh celiac</li>
                  <li><strong>Nhiễm virus:</strong> Coxsackie, Rubella trong thai kỳ</li>
                  <li><strong>Dân tộc:</strong> Người da trắng có nguy cơ cao nhất</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giới tính:</strong> Nam giới có nguy cơ cao hơn</li>
                  <li><strong>Thiếu vitamin D:</strong> Ít tiếp xúc ánh nắng</li>
                  <li><strong>Chế độ ăn:</strong> Sữa bò sớm, gluten</li>
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Môi trường:</strong> Ô nhiễm, hóa chất</li>
                  <li><strong>Thiếu cân:</strong> Khi sinh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Bú sữa mẹ lâu dài</li>
                  <li>Tiếp xúc ánh nắng đầy đủ</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Vận động thường xuyên</li>
                  <li>Quản lý stress tốt</li>
                  <li>Tránh nhiễm virus</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tiểu đường tuýp 1</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tiểu đường tuýp 1 dựa trên triệu chứng lâm sàng và các xét nghiệm đường huyết. 
                  Việc chẩn đoán sớm rất quan trọng để tránh biến chứng nghiêm trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đường huyết đói:</strong> ≥ 126 mg/dL (7.0 mmol/L)</li>
                  <li><strong>Đường huyết ngẫu nhiên:</strong> ≥ 200 mg/dL (11.1 mmol/L)</li>
                  <li><strong>HbA1c:</strong> ≥ 6.5%</li>
                  <li><strong>Test dung nạp glucose:</strong> ≥ 200 mg/dL sau 2 giờ</li>
                  <li><strong>Triệu chứng:</strong> Khát nước, tiểu nhiều, sụt cân</li>
                  <li><strong>Ceton trong nước tiểu:</strong> Dương tính</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm bổ sung:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng thể:</strong> Anti-GAD, ICA, IAA</li>
                  <li><strong>C-peptide:</strong> Thấp hoặc không có</li>
                  <li><strong>Điện giải:</strong> Na+, K+, Cl-</li>
                  <li><strong>Khí máu:</strong> pH, HCO3-</li>
                  <li><strong>Chức năng thận:</strong> Creatinine, BUN</li>
                  <li><strong>Chức năng gan:</strong> AST, ALT</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phân biệt với tuýp 2:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tuổi khởi phát:</strong> Trẻ em vs người lớn</li>
                  <li><strong>Triệu chứng:</strong> Đột ngột vs từ từ</li>
                  <li><strong>Cân nặng:</strong> Sụt cân vs thừa cân</li>
                  <li><strong>C-peptide:</strong> Thấp vs bình thường</li>
                  <li><strong>Kháng thể:</strong> Dương tính vs âm tính</li>
                  <li><strong>Điều trị:</strong> Insulin vs thuốc uống</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tiểu đường tuýp 1</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại chưa có cách phòng ngừa hoàn toàn tiểu đường tuýp 1, nhưng có thể giảm nguy cơ 
                  thông qua các biện pháp can thiệp sớm và lối sống lành mạnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Can thiệp sớm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tầm soát gen:</strong> Xét nghiệm HLA ở trẻ có nguy cơ</li>
                  <li><strong>Theo dõi kháng thể:</strong> Anti-GAD, ICA</li>
                  <li><strong>Can thiệp miễn dịch:</strong> Thuốc ức chế miễn dịch</li>
                  <li><strong>Insulin dự phòng:</strong> Tiêm insulin sớm</li>
                  <li><strong>Ghép tế bào beta:</strong> Thử nghiệm</li>
                  <li><strong>Liệu pháp gen:</strong> Đang nghiên cứu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp phòng ngừa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bú sữa mẹ:</strong> Ít nhất 6 tháng</li>
                  <li><strong>Tránh sữa bò:</strong> Trong năm đầu</li>
                  <li><strong>Bổ sung vitamin D:</strong> Đầy đủ</li>
                  <li><strong>Tiêm vaccine:</strong> Phòng nhiễm virus</li>
                  <li><strong>Chế độ ăn:</strong> Ít gluten, đường</li>
                  <li><strong>Vận động:</strong> Thường xuyên</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nghiên cứu tương lai:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vaccine phòng ngừa</li>
                  <li>Thuốc ức chế miễn dịch</li>
                  <li>Liệu pháp tế bào gốc</li>
                  <li>Ghép tế bào beta</li>
                  <li>Liệu pháp gen</li>
                  <li>Thuốc bảo vệ tế bào beta</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tiểu đường tuýp 1</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tiểu đường tuýp 1 tập trung vào việc thay thế insulin và kiểm soát đường huyết. 
                  Đây là điều trị suốt đời và cần sự hợp tác chặt chẽ giữa bệnh nhân và bác sĩ.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị insulin:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Insulin tác dụng nhanh:</strong> Lispro, Aspart</li>
                  <li><strong>Insulin tác dụng ngắn:</strong> Regular</li>
                  <li><strong>Insulin tác dụng trung bình:</strong> NPH</li>
                  <li><strong>Insulin tác dụng dài:</strong> Glargine, Detemir</li>
                  <li><strong>Insulin hỗn hợp:</strong> 70/30, 50/50</li>
                  <li><strong>Liều lượng:</strong> Điều chỉnh theo đường huyết</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phương pháp tiêm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bút tiêm insulin:</strong> Tiện lợi, chính xác</li>
                  <li><strong>Ống tiêm:</strong> Truyền thống</li>
                  <li><strong>Bơm insulin:</strong> Liên tục</li>
                  <li><strong>Insulin hít:</strong> Afrezza</li>
                  <li><strong>Insulin uống:</strong> Đang nghiên cứu</li>
                  <li><strong>Ghép tế bào beta:</strong> Thử nghiệm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Quản lý đường huyết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Theo dõi đường huyết:</strong> 4-6 lần/ngày</li>
                  <li><strong>HbA1c:</strong> Mục tiêu &lt; 7%</li>
                  <li><strong>Chế độ ăn:</strong> Cân bằng carbohydrate</li>
                  <li><strong>Vận động:</strong> Thường xuyên</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về bệnh</li>
                  <li><strong>Hỗ trợ tâm lý:</strong> Đối phó với bệnh</li>
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
