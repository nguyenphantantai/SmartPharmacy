import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function DiarrheaPage() {
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
    "Bệnh Trẻ Em",
    "Bệnh Truyền Nhiễm",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Người Cao Tuổi",
    "Bệnh Về Máu",
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
                <BreadcrumbPage>Tiêu chảy</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">22/05/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tiêu chảy là gì? Những điều cần biết về bệnh tiêu chảy
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung: Tiêu chảy là gì?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiêu chảy là một trong những bệnh lý tiêu hóa phổ biến nhất, xuất hiện ở cả người lớn và trẻ em. 
                  Tình trạng được nhận biết dễ dàng bởi dấu hiệu đi ngoài nhiều lần, phân lỏng kèm nước bất thường. 
                  Tuy nhiên, người bệnh cần phân biệt rõ với hiện tượng đại tiện nhiều nhưng phân đặc hoặc phân lỏng, 
                  dính ở em bé bú mẹ. Cả hai trường hợp này đều không phải là tiêu chảy.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Thông thường, tình trạng có thể phát triển từ nhẹ đến nghiêm trọng và đe dọa đến tính mạng nếu 
                  không được kiểm soát kịp thời. Vì vậy, ngay khi nhận biết dấu hiệu rối loạn, người bệnh nên 
                  chủ động thăm khám để điều trị sớm, tránh ảnh hưởng tiêu cực đến sức khỏe.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Diarrhea</li>
                  <li><strong>Tính chất:</strong> Rối loạn tiêu hóa</li>
                  <li><strong>Triệu chứng chính:</strong> Đi ngoài nhiều lần, phân lỏng</li>
                  <li><strong>Thời gian:</strong> Cấp tính hoặc mãn tính</li>
                  <li><strong>Điều trị:</strong> Bù nước, thuốc kháng sinh</li>
                  <li><strong>Phòng ngừa:</strong> Vệ sinh thực phẩm, rửa tay</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tiêu chảy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của tiêu chảy có thể thay đổi từ nhẹ đến nghiêm trọng tùy thuộc vào nguyên nhân 
                  và mức độ nghiêm trọng. Triệu chứng thường xuất hiện đột ngột và có thể kéo dài vài ngày đến vài tuần.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đi ngoài nhiều lần:</strong> Hơn 3 lần/ngày</li>
                  <li><strong>Phân lỏng:</strong> Phân có nhiều nước</li>
                  <li><strong>Đau bụng:</strong> Co thắt, đau quặn</li>
                  <li><strong>Buồn nôn:</strong> Cảm giác muốn nôn</li>
                  <li><strong>Nôn mửa:</strong> Trong trường hợp nặng</li>
                  <li><strong>Sốt:</strong> Nhiệt độ cơ thể tăng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở trẻ em:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khóc nhiều:</strong> Do đau bụng</li>
                  <li><strong>Bỏ ăn:</strong> Không muốn ăn</li>
                  <li><strong>Mệt mỏi:</strong> Trẻ không muốn chơi</li>
                  <li><strong>Khát nước:</strong> Do mất nước</li>
                  <li><strong>Mắt trũng:</strong> Dấu hiệu mất nước</li>
                  <li><strong>Da khô:</strong> Thiếu nước</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Mất nước nặng:</strong> Không thể uống nước</li>
                  <li><strong>Máu trong phân:</strong> Dấu hiệu nhiễm trùng</li>
                  <li><strong>Sốt cao:</strong> Trên 38.5°C</li>
                  <li><strong>Lú lẫn:</strong> Do mất nước</li>
                  <li><strong>Ngất xỉu:</strong> Trong trường hợp nặng</li>
                  <li><strong>Không đi tiểu:</strong> Thiếu nước nghiêm trọng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Tiêu chảy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiêu chảy có thể do nhiều nguyên nhân khác nhau, từ nhiễm trùng đến các bệnh lý tiêu hóa. 
                  Hiểu biết về nguyên nhân giúp có phương pháp điều trị và phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân nhiễm trùng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus:</strong> Rotavirus, Norovirus</li>
                  <li><strong>Vi khuẩn:</strong> E.coli, Salmonella</li>
                  <li><strong>Ký sinh trùng:</strong> Giardia, Cryptosporidium</li>
                  <li><strong>Nấm:</strong> Candida</li>
                  <li><strong>Độc tố:</strong> Từ vi khuẩn</li>
                  <li><strong>Nhiễm trùng:</strong> Đường ruột</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân không nhiễm trùng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thực phẩm:</strong> Đồ ăn ôi thiu</li>
                  <li><strong>Thuốc:</strong> Kháng sinh, thuốc nhuận tràng</li>
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Dị ứng:</strong> Thực phẩm</li>
                  <li><strong>Bệnh lý:</strong> Viêm ruột, hội chứng ruột kích thích</li>
                  <li><strong>Phẫu thuật:</strong> Cắt bỏ ruột</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh kém</li>
                  <li>Ăn uống không an toàn</li>
                  <li>Du lịch đến vùng có dịch</li>
                  <li>Hệ miễn dịch yếu</li>
                  <li>Tuổi già</li>
                  <li>Trẻ em</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc tiêu chảy hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 5 tuổi</li>
                  <li><strong>Người già:</strong> Trên 65 tuổi</li>
                  <li><strong>Hệ miễn dịch yếu:</strong> HIV, ung thư</li>
                  <li><strong>Du lịch:</strong> Đến vùng có dịch</li>
                  <li><strong>Vệ sinh kém:</strong> Không rửa tay</li>
                  <li><strong>Ăn uống:</strong> Thực phẩm không an toàn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Thuốc:</strong> Kháng sinh, thuốc nhuận tràng</li>
                  <li><strong>Bệnh lý:</strong> Viêm ruột, hội chứng ruột kích thích</li>
                  <li><strong>Phẫu thuật:</strong> Cắt bỏ ruột</li>
                  <li><strong>Dị ứng:</strong> Thực phẩm</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc thực phẩm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh tốt</li>
                  <li>Ăn uống an toàn</li>
                  <li>Uống nước sạch</li>
                  <li>Tiêm vaccine</li>
                  <li>Hệ miễn dịch khỏe</li>
                  <li>Lối sống lành mạnh</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tiêu chảy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tiêu chảy dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian, tần suất</li>
                  <li><strong>Khám lâm sàng:</strong> Đau bụng, mất nước</li>
                  <li><strong>Triệu chứng:</strong> Đi ngoài nhiều lần, phân lỏng</li>
                  <li><strong>Thời gian:</strong> Cấp tính hoặc mãn tính</li>
                  <li><strong>Nguyên nhân:</strong> Nhiễm trùng, thực phẩm</li>
                  <li><strong>Mức độ:</strong> Nhẹ, trung bình, nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cấy phân:</strong> Tìm vi khuẩn</li>
                  <li><strong>Xét nghiệm phân:</strong> Tìm ký sinh trùng</li>
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu</li>
                  <li><strong>Điện giải:</strong> Na, K, Cl</li>
                  <li><strong>Chức năng thận:</strong> Urea, Creatinine</li>
                  <li><strong>Nội soi:</strong> Trong trường hợp mãn tính</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Siêu âm:</strong> Đánh giá ruột</li>
                  <li><strong>CT scan:</strong> Trong trường hợp nặng</li>
                  <li><strong>Test dị ứng:</strong> Thực phẩm</li>
                  <li><strong>Test dung nạp:</strong> Lactose</li>
                  <li><strong>Test chức năng:</strong> Ruột</li>
                  <li><strong>Theo dõi:</strong> Triệu chứng</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tiêu chảy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa tiêu chảy tập trung vào việc vệ sinh thực phẩm, vệ sinh cá nhân và 
                  tránh các yếu tố nguy cơ. Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh thực phẩm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay:</strong> Trước khi ăn, sau khi đi vệ sinh</li>
                  <li><strong>Nấu chín:</strong> Thực phẩm phải được nấu chín</li>
                  <li><strong>Bảo quản:</strong> Thực phẩm trong tủ lạnh</li>
                  <li><strong>Tránh:</strong> Thực phẩm ôi thiu</li>
                  <li><strong>Nước sạch:</strong> Uống nước đã đun sôi</li>
                  <li><strong>Rửa rau quả:</strong> Rửa sạch trước khi ăn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay:</strong> Thường xuyên với xà phòng</li>
                  <li><strong>Vệ sinh:</strong> Môi trường sống</li>
                  <li><strong>Tránh:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Khử trùng:</strong> Đồ dùng cá nhân</li>
                  <li><strong>Quần áo:</strong> Giặt sạch</li>
                  <li><strong>Nhà vệ sinh:</strong> Vệ sinh sạch sẽ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tiêm vaccine</li>
                  <li>Tránh du lịch đến vùng có dịch</li>
                  <li>Uống nước sạch</li>
                  <li>Ăn thực phẩm an toàn</li>
                  <li>Vệ sinh môi trường</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tiêu chảy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tiêu chảy tập trung vào việc bù nước, điện giải và điều trị nguyên nhân. 
                  Điều trị bao gồm các biện pháp hỗ trợ và thuốc điều trị.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Bù nước và điện giải:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>ORS:</strong> Dung dịch bù nước đường uống</li>
                  <li><strong>Nước:</strong> Uống nhiều nước</li>
                  <li><strong>Điện giải:</strong> Na, K, Cl</li>
                  <li><strong>Đường:</strong> Glucose</li>
                  <li><strong>Muối:</strong> NaCl</li>
                  <li><strong>Kali:</strong> KCl</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng sinh:</strong> Trong trường hợp nhiễm trùng</li>
                  <li><strong>Thuốc cầm tiêu chảy:</strong> Loperamide</li>
                  <li><strong>Probiotic:</strong> Men vi sinh</li>
                  <li><strong>Thuốc giảm đau:</strong> Paracetamol</li>
                  <li><strong>Thuốc chống nôn:</strong> Metoclopramide</li>
                  <li><strong>Thuốc kháng acid:</strong> Ranitidine</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>BRAT diet:</strong> Chuối, gạo, táo, bánh mì</li>
                  <li><strong>Tránh:</strong> Thực phẩm nhiều chất béo</li>
                  <li><strong>Tránh:</strong> Thực phẩm nhiều đường</li>
                  <li><strong>Tránh:</strong> Thực phẩm nhiều chất xơ</li>
                  <li><strong>Ăn nhẹ:</strong> Chia nhỏ bữa ăn</li>
                  <li><strong>Uống nhiều:</strong> Nước, nước trái cây</li>
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
