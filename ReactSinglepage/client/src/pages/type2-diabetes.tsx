import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function Type2DiabetesPage() {
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
    "Bệnh Người Cao Tuổi", 
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Về Máu",
    "Bệnh Trẻ Em",
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
                <BreadcrumbPage>Tiểu đường tuýp 2</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">26/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh tiểu đường tuýp 2: Nguyên nhân, biến chứng và phòng bệnh
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
                <h3 className="text-xl font-semibold mb-3">Tiểu đường tuýp 2 là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 2 là một tình trạng mãn tính liên quan đến việc sản xuất insulin không đủ 
                  hoặc sử dụng insulin không hiệu quả. Insulin là hormone giúp điều chỉnh lượng đường trong máu. 
                  Khi cơ thể không thể sử dụng insulin đúng cách, glucose tích tụ trong máu thay vì được 
                  chuyển hóa thành năng lượng, có thể gây tổn thương nghiêm trọng cho các cơ quan trong cơ thể.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 2 chiếm 90-95% tổng số ca tiểu đường và thường phát triển ở người lớn, 
                  mặc dù ngày càng có nhiều trẻ em và thanh thiếu niên mắc bệnh này. Khác với tiểu đường tuýp 1, 
                  tiểu đường tuýp 2 có thể được phòng ngừa và quản lý thông qua lối sống lành mạnh.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tỷ lệ:</strong> Chiếm 90-95% tổng số ca tiểu đường</li>
                  <li><strong>Tuổi khởi phát:</strong> Thường ở người lớn (trên 40 tuổi)</li>
                  <li><strong>Nguyên nhân:</strong> Kháng insulin và thiếu insulin tương đối</li>
                  <li><strong>Điều trị:</strong> Chế độ ăn, vận động, thuốc uống</li>
                  <li><strong>Tính chất:</strong> Có thể phòng ngừa và quản lý</li>
                  <li><strong>Tiến triển:</strong> Từ từ, có thể không có triệu chứng</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tiểu đường tuýp 2</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của tiểu đường tuýp 2 thường phát triển từ từ và có thể không rõ ràng trong 
                  giai đoạn đầu. Nhiều người có thể mắc bệnh trong nhiều năm mà không biết.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khát nước nhiều:</strong> Uống nước liên tục</li>
                  <li><strong>Đi tiểu thường xuyên:</strong> Tiểu nhiều lần, đặc biệt vào ban đêm</li>
                  <li><strong>Đói liên tục:</strong> Cảm giác đói dữ dội</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác kiệt sức</li>
                  <li><strong>Nhìn mờ:</strong> Thị lực giảm</li>
                  <li><strong>Vết thương chậm lành:</strong> Vết cắt, vết bầm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nhiễm trùng thường xuyên:</strong> Nhiễm trùng da, nấm</li>
                  <li><strong>Ngứa da:</strong> Đặc biệt ở vùng sinh dục</li>
                  <li><strong>Tê bì chân tay:</strong> Cảm giác kim châm</li>
                  <li><strong>Da sạm màu:</strong> Vùng nách, cổ</li>
                  <li><strong>Giảm cân không giải thích được:</strong> Mặc dù ăn nhiều</li>
                  <li><strong>Khó tập trung:</strong> Suy giảm nhận thức</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Hôn mê tăng đường huyết:</strong> Mất ý thức</li>
                  <li><strong>Nhiễm toan ceton:</strong> Hơi thở có mùi acetone</li>
                  <li><strong>Đau ngực:</strong> Dấu hiệu tim mạch</li>
                  <li><strong>Khó thở:</strong> Suy hô hấp</li>
                  <li><strong>Đau đầu dữ dội:</strong> Có thể do tăng huyết áp</li>
                  <li><strong>Buồn nôn, nôn:</strong> Dấu hiệu nhiễm toan</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Tiểu đường tuýp 2</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 2 xảy ra khi cơ thể trở nên kháng insulin hoặc tuyến tụy không sản xuất 
                  đủ insulin. Đây là kết quả của sự tương tác phức tạp giữa gen di truyền và các yếu tố môi trường.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Cơ chế sinh bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng insulin:</strong> Tế bào không đáp ứng với insulin</li>
                  <li><strong>Thiếu insulin tương đối:</strong> Tuyến tụy không sản xuất đủ</li>
                  <li><strong>Rối loạn chuyển hóa glucose:</strong> Glucose tích tụ trong máu</li>
                  <li><strong>Tăng sản xuất glucose:</strong> Gan sản xuất quá nhiều glucose</li>
                  <li><strong>Giảm sử dụng glucose:</strong> Cơ và mô không sử dụng glucose</li>
                  <li><strong>Rối loạn lipid:</strong> Tăng triglyceride, giảm HDL</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố góp phần:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Di truyền:</strong> Tiền sử gia đình mắc tiểu đường</li>
                  <li><strong>Thừa cân, béo phì:</strong> Đặc biệt béo bụng</li>
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Chế độ ăn:</strong> Nhiều đường, tinh bột</li>
                  <li><strong>Tuổi tác:</strong> Trên 45 tuổi</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc tiểu đường tuýp 2 hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và tầm soát phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trên 45 tuổi</li>
                  <li><strong>BMI:</strong> Chỉ số khối cơ thể trên 25</li>
                  <li><strong>Vòng eo:</strong> Nam &gt; 90cm, nữ &gt; 80cm</li>
                  <li><strong>Tiền sử gia đình:</strong> Có người thân mắc tiểu đường</li>
                  <li><strong>Tiểu đường thai kỳ:</strong> Đã từng mắc</li>
                  <li><strong>Hội chứng buồng trứng đa nang:</strong> PCOS</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dân tộc:</strong> Châu Á, Mỹ Latinh, người Mỹ gốc Phi</li>
                  <li><strong>Lối sống:</strong> Ít vận động</li>
                  <li><strong>Chế độ ăn:</strong> Nhiều đường, tinh bột</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Uống rượu:</strong> Uống quá nhiều</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vận động thường xuyên</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Kiểm soát cân nặng</li>
                  <li>Không hút thuốc</li>
                  <li>Quản lý stress</li>
                  <li>Khám sức khỏe định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tiểu đường tuýp 2</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tiểu đường tuýp 2 dựa trên các xét nghiệm đường huyết và HbA1c. 
                  Việc chẩn đoán sớm rất quan trọng để tránh biến chứng nghiêm trọng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đường huyết đói:</strong> ≥ 126 mg/dL (7.0 mmol/L)</li>
                  <li><strong>Đường huyết ngẫu nhiên:</strong> ≥ 200 mg/dL (11.1 mmol/L)</li>
                  <li><strong>HbA1c:</strong> ≥ 6.5%</li>
                  <li><strong>Test dung nạp glucose:</strong> ≥ 200 mg/dL sau 2 giờ</li>
                  <li><strong>Triệu chứng:</strong> Khát nước, tiểu nhiều, sụt cân</li>
                  <li><strong>Xét nghiệm lặp lại:</strong> Để xác nhận chẩn đoán</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm bổ sung:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>C-peptide:</strong> Bình thường hoặc tăng</li>
                  <li><strong>Kháng thể:</strong> Anti-GAD, ICA (âm tính)</li>
                  <li><strong>Lipid máu:</strong> Cholesterol, triglyceride</li>
                  <li><strong>Chức năng thận:</strong> Creatinine, BUN</li>
                  <li><strong>Chức năng gan:</strong> AST, ALT</li>
                  <li><strong>Huyết áp:</strong> Đo huyết áp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tầm soát:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Người trên 45 tuổi:</strong> Mỗi 3 năm</li>
                  <li><strong>Người có nguy cơ:</strong> Mỗi năm</li>
                  <li><strong>Phụ nữ mang thai:</strong> 24-28 tuần</li>
                  <li><strong>Trẻ em:</strong> Nếu có nguy cơ</li>
                  <li><strong>HbA1c:</strong> Xét nghiệm chính</li>
                  <li><strong>Đường huyết đói:</strong> Xét nghiệm bổ sung</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tiểu đường tuýp 2</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường tuýp 2 có thể được phòng ngừa thông qua lối sống lành mạnh. 
                  Các nghiên cứu cho thấy giảm cân và vận động có thể giảm nguy cơ mắc bệnh đến 58%.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Biện pháp phòng ngừa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kiểm soát cân nặng:</strong> BMI trong giới hạn bình thường</li>
                  <li><strong>Vận động thường xuyên:</strong> Ít nhất 150 phút/tuần</li>
                  <li><strong>Chế độ ăn lành mạnh:</strong> Ít đường, nhiều chất xơ</li>
                  <li><strong>Không hút thuốc:</strong> Bỏ thuốc lá</li>
                  <li><strong>Hạn chế rượu:</strong> Uống có chừng mực</li>
                  <li><strong>Quản lý stress:</strong> Thư giãn, nghỉ ngơi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Carbohydrate:</strong> Chọn carb phức hợp</li>
                  <li><strong>Chất xơ:</strong> Ít nhất 25g/ngày</li>
                  <li><strong>Protein:</strong> Chọn protein nạc</li>
                  <li><strong>Chất béo:</strong> Chất béo không bão hòa</li>
                  <li><strong>Rau quả:</strong> Ít nhất 5 phần/ngày</li>
                  <li><strong>Hạn chế:</strong> Đường, muối, chất béo bão hòa</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vận động:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đi bộ:</strong> Ít nhất 30 phút/ngày</li>
                  <li><strong>Thể dục nhịp điệu:</strong> 3-4 lần/tuần</li>
                  <li><strong>Rèn luyện sức mạnh:</strong> 2-3 lần/tuần</li>
                  <li><strong>Hoạt động hàng ngày:</strong> Leo cầu thang, đi bộ</li>
                  <li><strong>Giảm thời gian ngồi:</strong> Đứng dậy mỗi giờ</li>
                  <li><strong>Thể thao:</strong> Bơi lội, đạp xe, yoga</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tiểu đường tuýp 2</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tiểu đường tuýp 2 tập trung vào việc kiểm soát đường huyết và ngăn ngừa biến chứng. 
                  Điều trị bao gồm thay đổi lối sống, thuốc uống và trong một số trường hợp là insulin.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị không dùng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Kiểm soát carbohydrate</li>
                  <li><strong>Vận động:</strong> Ít nhất 150 phút/tuần</li>
                  <li><strong>Giảm cân:</strong> 5-10% trọng lượng cơ thể</li>
                  <li><strong>Theo dõi đường huyết:</strong> Đo thường xuyên</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về bệnh</li>
                  <li><strong>Hỗ trợ tâm lý:</strong> Đối phó với bệnh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Metformin:</strong> Thuốc điều trị đầu tay</li>
                  <li><strong>Sulfonylurea:</strong> Kích thích tiết insulin</li>
                  <li><strong>DPP-4 inhibitor:</strong> Ức chế DPP-4</li>
                  <li><strong>GLP-1 agonist:</strong> Kích thích tiết insulin</li>
                  <li><strong>SGLT-2 inhibitor:</strong> Ức chế tái hấp thu glucose</li>
                  <li><strong>Thiazolidinedione:</strong> Cải thiện kháng insulin</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Insulin:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Khi nào cần:</strong> Thuốc uống không hiệu quả</li>
                  <li><strong>Loại insulin:</strong> Tác dụng dài, trung bình</li>
                  <li><strong>Liều lượng:</strong> Điều chỉnh theo đường huyết</li>
                  <li><strong>Phương pháp:</strong> Tiêm dưới da</li>
                  <li><strong>Theo dõi:</strong> Đường huyết và tác dụng phụ</li>
                  <li><strong>Giáo dục:</strong> Cách tiêm và bảo quản</li>
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
