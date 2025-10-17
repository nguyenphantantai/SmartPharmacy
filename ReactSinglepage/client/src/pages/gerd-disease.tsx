import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function GERDDiseasePage() {
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
    "Bệnh Tiêu Hóa",
    "Bệnh Người Cao Tuổi", 
    "Bệnh Theo Bộ Phận Cơ Thể",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Ngực",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì",
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
                <BreadcrumbPage>Trào ngược dạ dày</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">16/04/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Trào ngược dạ dày thực quản là gì? Những điều cần biết về bệnh
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan về Trào ngược dạ dày thực quản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Trào ngược dạ dày thực quản (GERD) là tình trạng axit dạ dày và các chất trong dạ dày trào ngược lên thực quản, 
                  gây ra các triệu chứng khó chịu và có thể dẫn đến các biến chứng nghiêm trọng nếu không được điều trị.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Đây là một bệnh lý phổ biến, ảnh hưởng đến khoảng 10-20% dân số phương Tây và đang có xu hướng gia tăng ở Việt Nam. 
                  Bệnh có thể xảy ra ở mọi lứa tuổi nhưng thường gặp nhất ở người trưởng thành.
                </p>
                <h3 className="text-xl font-semibold mb-3">Cơ chế bệnh sinh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Cơ thắt thực quản dưới yếu:</strong> Không đóng kín hoàn toàn, cho phép axit trào ngược</li>
                  <li><strong>Thoát vị hoành:</strong> Một phần dạ dày trượt lên trên cơ hoành</li>
                  <li><strong>Rối loạn nhu động thực quản:</strong> Giảm khả năng đẩy axit trở lại dạ dày</li>
                  <li><strong>Tăng áp lực ổ bụng:</strong> Do béo phì, mang thai, hoặc các hoạt động gắng sức</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Trào ngược dạ dày</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của GERD có thể khác nhau ở mỗi người và có thể xuất hiện theo từng đợt hoặc liên tục. 
                  Một số người có thể không có triệu chứng rõ ràng trong giai đoạn đầu.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng điển hình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ợ nóng:</strong> Cảm giác nóng rát ở ngực, lan lên cổ họng</li>
                  <li><strong>Ợ chua:</strong> Vị chua hoặc đắng trong miệng</li>
                  <li><strong>Trào ngược:</strong> Cảm giác thức ăn hoặc dịch trào ngược lên</li>
                  <li><strong>Đau ngực:</strong> Đau sau xương ức, có thể nhầm với đau tim</li>
                  <li><strong>Khó nuốt:</strong> Cảm giác thức ăn bị kẹt trong cổ họng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng không điển hình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ho mạn tính, đặc biệt vào ban đêm</li>
                  <li>Khàn giọng, đau họng</li>
                  <li>Hen suyễn hoặc khó thở</li>
                  <li>Đau tai, ù tai</li>
                  <li>Hôi miệng</li>
                  <li>Buồn nôn, nôn</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Trào ngược dạ dày</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  GERD xảy ra khi có sự mất cân bằng giữa các yếu tố bảo vệ và tấn công trong hệ thống tiêu hóa. 
                  Có nhiều yếu tố có thể góp phần gây ra tình trạng này.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cơ thắt thực quản dưới yếu:</strong> Nguyên nhân phổ biến nhất</li>
                  <li><strong>Thoát vị hoành:</strong> Làm thay đổi giải phẫu và chức năng cơ thắt</li>
                  <li><strong>Rối loạn nhu động thực quản:</strong> Giảm khả năng làm sạch axit</li>
                  <li><strong>Tăng tiết axit dạ dày:</strong> Do stress, thuốc, hoặc bệnh lý</li>
                  <li><strong>Chậm làm rỗng dạ dày:</strong> Thức ăn ở lại dạ dày lâu hơn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố góp phần:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Béo phì và thừa cân</li>
                  <li>Mang thai</li>
                  <li>Hút thuốc lá</li>
                  <li>Uống rượu bia</li>
                  <li>Ăn quá no, ăn khuya</li>
                  <li>Nằm ngay sau khi ăn</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao hơn phát triển GERD. Hiểu biết về các yếu tố nguy cơ có thể giúp 
                  phòng ngừa và phát hiện sớm bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Nguy cơ tăng theo tuổi, đặc biệt sau 40 tuổi</li>
                  <li><strong>Giới tính:</strong> Nam giới có nguy cơ cao hơn nữ giới</li>
                  <li><strong>Béo phì:</strong> BMI cao làm tăng áp lực ổ bụng</li>
                  <li><strong>Mang thai:</strong> Do thay đổi hormone và áp lực</li>
                  <li><strong>Tiền sử gia đình:</strong> Có thể có yếu tố di truyền</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hút thuốc lá</li>
                  <li>Uống rượu bia thường xuyên</li>
                  <li>Stress và lo âu</li>
                  <li>Một số thuốc (NSAIDs, thuốc huyết áp)</li>
                  <li>Bệnh tiểu đường</li>
                  <li>Rối loạn mô liên kết</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Trào ngược dạ dày</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán GERD dựa trên triệu chứng lâm sàng và các xét nghiệm cận lâm sàng. 
                  Trong nhiều trường hợp, chẩn đoán có thể được thực hiện dựa trên triệu chứng điển hình.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Triệu chứng điển hình:</strong> Ợ nóng, ợ chua, trào ngược</li>
                  <li><strong>Thang điểm GERD:</strong> Đánh giá mức độ nghiêm trọng</li>
                  <li><strong>Thử nghiệm điều trị:</strong> Đáp ứng với thuốc ức chế bơm proton</li>
                  <li><strong>Tiền sử bệnh:</strong> Các yếu tố nguy cơ và triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cận lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nội soi thực quản dạ dày:</strong> Xét nghiệm quan trọng nhất</li>
                  <li><strong>Đo pH thực quản 24h:</strong> Đánh giá mức độ trào ngược axit</li>
                  <li><strong>Đo áp lực thực quản:</strong> Đánh giá chức năng cơ thắt</li>
                  <li><strong>Chụp X-quang có thuốc cản quang:</strong> Phát hiện thoát vị hoành</li>
                  <li><strong>Sinh thiết:</strong> Loại trừ các bệnh lý khác</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Trào ngược dạ dày</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa GERD chủ yếu dựa vào thay đổi lối sống và chế độ ăn uống. 
                  Các biện pháp này có thể giúp giảm nguy cơ và kiểm soát triệu chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thay đổi lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Duy trì cân nặng hợp lý:</strong> Giảm áp lực ổ bụng</li>
                  <li><strong>Bỏ hút thuốc:</strong> Cải thiện chức năng cơ thắt</li>
                  <li><strong>Hạn chế rượu bia:</strong> Giảm kích thích niêm mạc</li>
                  <li><strong>Quản lý stress:</strong> Thư giãn và nghỉ ngơi đầy đủ</li>
                  <li><strong>Tập thể dục thường xuyên:</strong> Cải thiện sức khỏe tổng thể</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ăn nhiều bữa nhỏ thay vì ít bữa lớn</li>
                  <li>Tránh ăn 2-3 giờ trước khi ngủ</li>
                  <li>Hạn chế thức ăn cay, chua, béo</li>
                  <li>Tránh cà phê, trà, nước có ga</li>
                  <li>Ăn chậm, nhai kỹ</li>
                  <li>Uống đủ nước nhưng không quá nhiều trong bữa ăn</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Trào ngược dạ dày</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị GERD bao gồm nhiều phương pháp từ thay đổi lối sống đến phẫu thuật. 
                  Mục tiêu là giảm triệu chứng, chữa lành tổn thương và ngăn ngừa biến chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị bằng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc ức chế bơm proton (PPI):</strong> Giảm tiết axit hiệu quả</li>
                  <li><strong>Thuốc kháng H2:</strong> Giảm tiết axit ở mức độ nhẹ hơn</li>
                  <li><strong>Thuốc kháng axit:</strong> Trung hòa axit tạm thời</li>
                  <li><strong>Thuốc tăng nhu động:</strong> Cải thiện làm rỗng dạ dày</li>
                  <li><strong>Thuốc bảo vệ niêm mạc:</strong> Tạo lớp bảo vệ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị không dùng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thay đổi lối sống:</strong> Cơ sở của điều trị</li>
                  <li><strong>Vật lý trị liệu:</strong> Các bài tập cải thiện tư thế</li>
                  <li><strong>Phẫu thuật:</strong> Trong trường hợp nặng hoặc không đáp ứng thuốc</li>
                  <li><strong>Thủ thuật nội soi:</strong> Các phương pháp ít xâm lấn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Theo dõi và quản lý:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tuân thủ điều trị theo chỉ định</li>
                  <li>Theo dõi triệu chứng định kỳ</li>
                  <li>Nội soi kiểm tra khi cần thiết</li>
                  <li>Điều chỉnh thuốc theo đáp ứng</li>
                  <li>Phòng ngừa tái phát</li>
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
