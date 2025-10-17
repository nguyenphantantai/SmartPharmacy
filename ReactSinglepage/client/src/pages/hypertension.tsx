import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function HypertensionPage() {
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
    "Bệnh Tim Mạch",
    "Bệnh Người Cao Tuổi",
    "Ngực",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
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
                <BreadcrumbPage>Tăng huyết áp</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">28/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tăng huyết áp là gì? Những điều cần biết về bệnh
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
                <h2 className="text-2xl font-bold mb-4">Tăng huyết áp là gì?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tăng huyết áp, hay còn gọi là cao huyết áp, là tình trạng mà áp lực máu trong động mạch tăng cao hơn mức bình thường. 
                  Đây là một trong những yếu tố nguy cơ chính dẫn đến các bệnh tim mạch và đột quỵ. 
                  Tăng huyết áp được gọi là "kẻ giết người thầm lặng" bởi vì nó thường không có triệu chứng rõ ràng nhưng có thể gây ra các biến chứng nghiêm trọng.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện nay, tăng huyết áp là một vấn đề y tế toàn cầu, ảnh hưởng đến hàng triệu người trên thế giới. 
                  Bệnh có thể xảy ra ở mọi lứa tuổi nhưng phổ biến hơn ở người cao tuổi. 
                  Việc kiểm soát huyết áp hiệu quả có thể giảm đáng kể nguy cơ mắc các bệnh tim mạch và đột quỵ.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Hypertension</li>
                  <li><strong>Tính chất:</strong> Mạn tính</li>
                  <li><strong>Triệu chứng chính:</strong> Thường không có</li>
                  <li><strong>Thời gian:</strong> Kéo dài</li>
                  <li><strong>Điều trị:</strong> Thuốc, lối sống</li>
                  <li><strong>Phòng ngừa:</strong> Kiểm soát yếu tố nguy cơ</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tăng huyết áp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tăng huyết áp thường được gọi là "kẻ giết người thầm lặng" vì hầu hết những người mắc bệnh không có triệu chứng rõ ràng. 
                  Triệu chứng chỉ xuất hiện khi huyết áp tăng rất cao hoặc đã gây ra biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng thường gặp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Chóng mặt:</strong> Cảm giác quay cuồng</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Khó thở:</strong> Thở gấp</li>
                  <li><strong>Đau ngực:</strong> Đau vùng ngực</li>
                  <li><strong>Nhìn mờ:</strong> Thị lực giảm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đau đầu dữ dội:</strong> Đau đầu không chịu nổi</li>
                  <li><strong>Buồn nôn:</strong> Cảm giác muốn nôn</li>
                  <li><strong>Nôn mửa:</strong> Nôn liên tục</li>
                  <li><strong>Lú lẫn:</strong> Không tỉnh táo</li>
                  <li><strong>Co giật:</strong> Động kinh</li>
                  <li><strong>Hôn mê:</strong> Mất ý thức</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng biến chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đột quỵ:</strong> Liệt nửa người</li>
                  <li><strong>Nhồi máu cơ tim:</strong> Đau ngực dữ dội</li>
                  <li><strong>Suy tim:</strong> Khó thở, phù</li>
                  <li><strong>Suy thận:</strong> Thiểu niệu</li>
                  <li><strong>Bệnh mắt:</strong> Mù lòa</li>
                  <li><strong>Bệnh mạch máu:</strong> Tắc mạch</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Tăng huyết áp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tăng huyết áp có thể được phân loại thành hai loại chính: tăng huyết áp nguyên phát (không rõ nguyên nhân) 
                  và tăng huyết áp thứ phát (có nguyên nhân cụ thể). 
                  Hầu hết các trường hợp là tăng huyết áp nguyên phát.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tăng huyết áp nguyên phát:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi tác:</strong> Tuổi cao</li>
                  <li><strong>Di truyền:</strong> Tiền sử gia đình</li>
                  <li><strong>Giới tính:</strong> Nam giới</li>
                  <li><strong>Chủng tộc:</strong> Người da đen</li>
                  <li><strong>Lối sống:</strong> Hút thuốc, rượu</li>
                  <li><strong>Chế độ ăn:</strong> Ăn mặn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng huyết áp thứ phát:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bệnh thận:</strong> Viêm thận, suy thận</li>
                  <li><strong>Bệnh nội tiết:</strong> Cường giáp, tiểu đường</li>
                  <li><strong>Thuốc:</strong> Thuốc tránh thai, steroid</li>
                  <li><strong>Mang thai:</strong> Tiền sản giật</li>
                  <li><strong>Bệnh tim:</strong> Hẹp động mạch chủ</li>
                  <li><strong>Bệnh mạch máu:</strong> Hẹp động mạch thận</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tuổi cao</li>
                  <li>Tiền sử gia đình</li>
                  <li>Thừa cân, béo phì</li>
                  <li>Ít vận động</li>
                  <li>Hút thuốc lá</li>
                  <li>Uống rượu nhiều</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc tăng huyết áp hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi già:</strong> Trên 65 tuổi</li>
                  <li><strong>Tiền sử gia đình:</strong> Bố mẹ mắc bệnh</li>
                  <li><strong>Thừa cân:</strong> BMI &gt; 25</li>
                  <li><strong>Béo phì:</strong> BMI &gt; 30</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Uống rượu:</strong> Uống rượu nhiều</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Chế độ ăn:</strong> Ăn mặn, nhiều chất béo</li>
                  <li><strong>Căng thẳng:</strong> Stress kéo dài</li>
                  <li><strong>Tiểu đường:</strong> Đái tháo đường</li>
                  <li><strong>Bệnh thận:</strong> Bệnh thận mạn tính</li>
                  <li><strong>Thuốc:</strong> Một số loại thuốc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tập thể dục thường xuyên</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Duy trì cân nặng hợp lý</li>
                  <li>Không hút thuốc</li>
                  <li>Hạn chế rượu bia</li>
                  <li>Kiểm soát stress</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tăng huyết áp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tăng huyết áp dựa trên việc đo huyết áp nhiều lần và đánh giá các yếu tố nguy cơ. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Huyết áp tâm thu:</strong> ≥ 140 mmHg</li>
                  <li><strong>Huyết áp tâm trương:</strong> ≥ 90 mmHg</li>
                  <li><strong>Đo nhiều lần:</strong> Ít nhất 2 lần</li>
                  <li><strong>Thời gian:</strong> Cách nhau ít nhất 1 tuần</li>
                  <li><strong>Điều kiện:</strong> Nghỉ ngơi 5 phút</li>
                  <li><strong>Môi trường:</strong> Yên tĩnh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phân loại mức độ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Bình thường:</strong> &lt; 120/80 mmHg</li>
                  <li><strong>Tiền tăng huyết áp:</strong> 120-139/80-89 mmHg</li>
                  <li><strong>Tăng huyết áp độ 1:</strong> 140-159/90-99 mmHg</li>
                  <li><strong>Tăng huyết áp độ 2:</strong> 160-179/100-109 mmHg</li>
                  <li><strong>Tăng huyết áp độ 3:</strong> ≥ 180/110 mmHg</li>
                  <li><strong>Khủng hoảng:</strong> ≥ 180/120 mmHg</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Công thức máu:</strong> Thiếu máu</li>
                  <li><strong>Điện giải:</strong> Kali, natri</li>
                  <li><strong>Chức năng thận:</strong> Creatinine, ure</li>
                  <li><strong>Đường huyết:</strong> Tiểu đường</li>
                  <li><strong>Cholesterol:</strong> Lipid máu</li>
                  <li><strong>Điện tâm đồ:</strong> Bệnh tim</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tăng huyết áp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa tăng huyết áp tập trung vào việc thay đổi lối sống và kiểm soát các yếu tố nguy cơ. 
                  Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thay đổi lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tập thể dục:</strong> Ít nhất 30 phút/ngày</li>
                  <li><strong>Chế độ ăn:</strong> Ăn nhiều rau quả</li>
                  <li><strong>Giảm muối:</strong> &lt; 6g muối/ngày</li>
                  <li><strong>Duy trì cân nặng:</strong> BMI 18.5-24.9</li>
                  <li><strong>Không hút thuốc:</strong> Bỏ thuốc lá</li>
                  <li><strong>Hạn chế rượu:</strong> &lt; 2 đơn vị/ngày</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn DASH:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rau quả:</strong> 4-5 phần/ngày</li>
                  <li><strong>Ngũ cốc:</strong> 6-8 phần/ngày</li>
                  <li><strong>Sữa ít béo:</strong> 2-3 phần/ngày</li>
                  <li><strong>Thịt nạc:</strong> 2 phần/ngày</li>
                  <li><strong>Hạt:</strong> 4-5 phần/tuần</li>
                  <li><strong>Đường:</strong> &lt; 5 phần/tuần</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Kiểm soát yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kiểm soát cân nặng</li>
                  <li>Kiểm soát đường huyết</li>
                  <li>Kiểm soát cholesterol</li>
                  <li>Kiểm soát stress</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Theo dõi huyết áp</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tăng huyết áp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tăng huyết áp bao gồm thay đổi lối sống và sử dụng thuốc. 
                  Mục tiêu là giảm huyết áp xuống dưới 140/90 mmHg và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thay đổi lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tập thể dục:</strong> Aerobic 150 phút/tuần</li>
                  <li><strong>Chế độ ăn:</strong> DASH, giảm muối</li>
                  <li><strong>Giảm cân:</strong> Giảm 5-10% cân nặng</li>
                  <li><strong>Bỏ thuốc:</strong> Ngừng hút thuốc</li>
                  <li><strong>Hạn chế rượu:</strong> &lt; 1 đơn vị/ngày</li>
                  <li><strong>Giảm stress:</strong> Thiền, yoga</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>ACE inhibitors:</strong> Enalapril, Lisinopril</li>
                  <li><strong>ARB:</strong> Losartan, Valsartan</li>
                  <li><strong>Thiazide:</strong> Hydrochlorothiazide</li>
                  <li><strong>Calcium channel blockers:</strong> Amlodipine</li>
                  <li><strong>Beta blockers:</strong> Metoprolol</li>
                  <li><strong>Alpha blockers:</strong> Doxazosin</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Theo dõi và điều chỉnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đo huyết áp:</strong> Hàng ngày</li>
                  <li><strong>Khám định kỳ:</strong> 3-6 tháng</li>
                  <li><strong>Điều chỉnh thuốc:</strong> Theo chỉ định</li>
                  <li><strong>Theo dõi tác dụng phụ:</strong> Ho, phù</li>
                  <li><strong>Tuân thủ điều trị:</strong> Uống thuốc đều</li>
                  <li><strong>Giáo dục bệnh nhân:</strong> Hiểu về bệnh</li>
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
