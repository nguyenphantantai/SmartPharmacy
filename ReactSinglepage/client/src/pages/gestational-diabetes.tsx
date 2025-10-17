import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function GestationalDiabetesPage() {
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
    "Bệnh Về Máu",
    "Bệnh Nội Tiết - Chuyển Hóa", 
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Trẻ Em",
    "Bệnh Truyền Nhiễm"
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
                <BreadcrumbPage>Tiểu đường thai kỳ</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">23/04/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tiểu đường thai kỳ là gì? Những điều cần biết về bệnh
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung về tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường thai kỳ là một vấn đề sức khỏe mà tất cả phụ nữ mang thai cần được thông tin. 
                  Bệnh ảnh hưởng đến 2% đến 10% phụ nữ mang thai và có thể tác động đến cả mẹ và bé. 
                  Bài viết này sẽ cung cấp thông tin về triệu chứng, nguyên nhân, cách phòng ngừa và điều trị.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường thai kỳ là tình trạng rối loạn đường huyết xảy ra trong thời kỳ mang thai. 
                  Hầu hết phụ nữ sẽ trở lại bình thường sau khi sinh, nhưng 5% đến 20% có nguy cơ phát triển 
                  thành tiểu đường tuýp 2 sau này. Việc nhận biết sớm và quản lý kịp thời rất quan trọng.
                </p>                

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Thời gian:</strong> Xảy ra trong thời kỳ mang thai</li>
                  <li><strong>Tỷ lệ mắc:</strong> 2-10% phụ nữ mang thai</li>
                  <li><strong>Nguy cơ:</strong> 5-20% phát triển thành tiểu đường tuýp 2</li>
                  <li><strong>Ảnh hưởng:</strong> Cả mẹ và thai nhi</li>
                  <li><strong>Phục hồi:</strong> Hầu hết trở lại bình thường sau sinh</li>
                  <li><strong>Quản lý:</strong> Cần theo dõi và điều trị kịp thời</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường thai kỳ thường không có triệu chứng rõ ràng, đó là lý do tại sao việc tầm soát 
                  định kỳ rất quan trọng. Tuy nhiên, một số phụ nữ có thể gặp các triệu chứng tương tự như 
                  tiểu đường tuýp 2.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng có thể gặp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khát nước nhiều:</strong> Uống nước liên tục</li>
                  <li><strong>Đi tiểu thường xuyên:</strong> Tiểu nhiều lần trong ngày</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác kiệt sức</li>
                  <li><strong>Buồn nôn:</strong> Nôn mửa không rõ nguyên nhân</li>
                  <li><strong>Nhìn mờ:</strong> Thị lực giảm tạm thời</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng đường tiết niệu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở thai nhi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thai to:</strong> Cân nặng thai nhi lớn hơn bình thường</li>
                  <li><strong>Nước ối nhiều:</strong> Lượng nước ối tăng</li>
                  <li><strong>Đường huyết thai nhi cao:</strong> Sau khi sinh</li>
                  <li><strong>Vàng da:</strong> Vàng da sơ sinh</li>
                  <li><strong>Khó thở:</strong> Hội chứng suy hô hấp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hôn mê do đường huyết cao</li>
                  <li>Tiền sản giật</li>
                  <li>Sinh non</li>
                  <li>Thai chết lưu</li>
                  <li>Nhiễm toan ceton</li>
                  <li>Biến chứng tim mạch</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiểu đường thai kỳ xảy ra khi cơ thể không thể sản xuất đủ insulin để đáp ứng nhu cầu 
                  tăng cao trong thai kỳ. Hormone từ nhau thai có thể làm giảm hiệu quả của insulin.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Cơ chế sinh bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng insulin:</strong> Hormone thai kỳ làm giảm hiệu quả insulin</li>
                  <li><strong>Nhu cầu insulin tăng:</strong> Cơ thể cần nhiều insulin hơn</li>
                  <li><strong>Tuyến tụy không đáp ứng:</strong> Không sản xuất đủ insulin</li>
                  <li><strong>Đường huyết tăng:</strong> Glucose tích tụ trong máu</li>
                  <li><strong>Hormone nhau thai:</strong> HCG, estrogen, progesterone</li>
                  <li><strong>Stress oxy hóa:</strong> Tăng trong thai kỳ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố góp phần:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Di truyền:</strong> Tiền sử gia đình mắc tiểu đường</li>
                  <li><strong>Tuổi tác:</strong> Phụ nữ trên 25 tuổi</li>
                  <li><strong>Cân nặng:</strong> Thừa cân, béo phì</li>
                  <li><strong>Lối sống:</strong> Ít vận động, chế độ ăn không lành mạnh</li>
                  <li><strong>Tiền sử:</strong> Tiểu đường thai kỳ trước đó</li>
                  <li><strong>Hội chứng buồng trứng đa nang:</strong> PCOS</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số phụ nữ có nguy cơ cao mắc tiểu đường thai kỳ hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và tầm soát phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trên 25 tuổi</li>
                  <li><strong>BMI:</strong> Chỉ số khối cơ thể trên 25</li>
                  <li><strong>Tiền sử gia đình:</strong> Có người thân mắc tiểu đường</li>
                  <li><strong>Tiểu đường thai kỳ trước:</strong> Đã mắc trong lần mang thai trước</li>
                  <li><strong>Hội chứng buồng trứng đa nang:</strong> PCOS</li>
                  <li><strong>Tiền sản giật:</strong> Đã từng mắc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dân tộc:</strong> Châu Á, Mỹ Latinh, người Mỹ gốc Phi</li>
                  <li><strong>Lối sống:</strong> Ít vận động</li>
                  <li><strong>Chế độ ăn:</strong> Nhiều đường, tinh bột</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                  <li><strong>Hút thuốc:</strong> Trong hoặc trước khi mang thai</li>
                  <li><strong>Uống rượu:</strong> Trong thai kỳ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vận động thường xuyên</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Kiểm soát cân nặng</li>
                  <li>Không hút thuốc</li>
                  <li>Quản lý stress</li>
                  <li>Khám thai định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tiểu đường thai kỳ thường được thực hiện trong tam cá nguyệt thứ hai (24-28 tuần). 
                  Các xét nghiệm đường huyết được sử dụng để xác định chẩn đoán.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Xét nghiệm tầm soát:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Test dung nạp glucose:</strong> Uống 50g glucose</li>
                  <li><strong>Đo đường huyết:</strong> Sau 1 giờ</li>
                  <li><strong>Ngưỡng bình thường:</strong> &lt; 140 mg/dL</li>
                  <li><strong>Ngưỡng nghi ngờ:</strong> ≥ 140 mg/dL</li>
                  <li><strong>Thời gian:</strong> 24-28 tuần thai</li>
                  <li><strong>Đối tượng:</strong> Tất cả phụ nữ mang thai</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Test dung nạp glucose 3 giờ:</strong> Uống 100g glucose</li>
                  <li><strong>Đo đường huyết:</strong> Trước, 1h, 2h, 3h sau uống</li>
                  <li><strong>Ngưỡng chẩn đoán:</strong> 2/4 giá trị vượt ngưỡng</li>
                  <li><strong>Đường huyết đói:</strong> ≥ 95 mg/dL</li>
                  <li><strong>Sau 1 giờ:</strong> ≥ 180 mg/dL</li>
                  <li><strong>Sau 2 giờ:</strong> ≥ 155 mg/dL</li>
                  <li><strong>Sau 3 giờ:</strong> ≥ 140 mg/dL</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>HbA1c:</strong> Đánh giá đường huyết trung bình</li>
                  <li><strong>Đường huyết ngẫu nhiên:</strong> Bất kỳ thời điểm nào</li>
                  <li><strong>Đường huyết đói:</strong> Sau nhịn ăn 8 giờ</li>
                  <li><strong>Xét nghiệm nước tiểu:</strong> Glucose trong nước tiểu</li>
                  <li><strong>Siêu âm thai:</strong> Đánh giá sự phát triển thai nhi</li>
                  <li><strong>Monitoring thai:</strong> Theo dõi tim thai</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù không thể ngăn ngừa hoàn toàn tiểu đường thai kỳ, nhưng có thể giảm nguy cơ 
                  thông qua lối sống lành mạnh và chăm sóc sức khỏe tốt trước và trong thai kỳ.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Trước khi mang thai:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kiểm soát cân nặng:</strong> BMI trong giới hạn bình thường</li>
                  <li><strong>Vận động thường xuyên:</strong> Ít nhất 150 phút/tuần</li>
                  <li><strong>Chế độ ăn lành mạnh:</strong> Ít đường, nhiều chất xơ</li>
                  <li><strong>Bổ sung acid folic:</strong> Trước khi mang thai</li>
                  <li><strong>Kiểm tra sức khỏe:</strong> Khám tổng quát</li>
                  <li><strong>Quản lý stress:</strong> Thư giãn, nghỉ ngơi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Trong thai kỳ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tăng cân hợp lý:</strong> 11-16 kg (BMI bình thường)</li>
                  <li><strong>Vận động nhẹ nhàng:</strong> Đi bộ, yoga, bơi lội</li>
                  <li><strong>Chế độ ăn cân bằng:</strong> Protein, chất béo, carb</li>
                  <li><strong>Khám thai định kỳ:</strong> Theo lịch hẹn</li>
                  <li><strong>Theo dõi đường huyết:</strong> Nếu có nguy cơ</li>
                  <li><strong>Nghỉ ngơi đầy đủ:</strong> Ngủ đủ giấc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ăn nhiều bữa nhỏ trong ngày</li>
                  <li>Hạn chế đường và tinh bột</li>
                  <li>Tăng cường chất xơ</li>
                  <li>Chọn protein nạc</li>
                  <li>Uống đủ nước</li>
                  <li>Tránh thức ăn chế biến sẵn</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tiểu đường thai kỳ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tiểu đường thai kỳ tập trung vào việc kiểm soát đường huyết để đảm bảo sức khỏe 
                  của cả mẹ và thai nhi. Hầu hết trường hợp có thể kiểm soát bằng chế độ ăn và vận động.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị không dùng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Kiểm soát carbohydrate</li>
                  <li><strong>Vận động:</strong> Đi bộ, yoga, bơi lội</li>
                  <li><strong>Theo dõi đường huyết:</strong> Đo 4-6 lần/ngày</li>
                  <li><strong>Kiểm soát cân nặng:</strong> Tăng cân hợp lý</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về bệnh</li>
                  <li><strong>Hỗ trợ tâm lý:</strong> Giảm stress, lo lắng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị bằng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Insulin:</strong> Thuốc điều trị chính</li>
                  <li><strong>Metformin:</strong> Thuốc uống (có thể dùng)</li>
                  <li><strong>Glyburide:</strong> Thuốc uống thay thế</li>
                  <li><strong>Liều lượng:</strong> Điều chỉnh theo đường huyết</li>
                  <li><strong>Theo dõi:</strong> Đường huyết và tác dụng phụ</li>
                  <li><strong>Thời gian:</strong> Cho đến khi sinh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Theo dõi và chăm sóc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám thai thường xuyên</li>
                  <li>Siêu âm thai định kỳ</li>
                  <li>Theo dõi tim thai</li>
                  <li>Đo đường huyết liên tục</li>
                  <li>Chuẩn bị cho việc sinh</li>
                  <li>Chăm sóc sau sinh</li>
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
