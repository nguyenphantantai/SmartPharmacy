import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function ViralFeverPage() {
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
    "Bệnh Trẻ Em",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Người Cao Tuổi",
    "Bệnh Về Máu",
    "Bệnh Nội Tiết - Chuyển Hóa",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Hô Hấp"
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
                <BreadcrumbPage>Sốt siêu vi</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">01/10/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sốt siêu vi: "Kẻ thù thầm lặng" gây bệnh cho mọi lứa tuổi
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan về sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt siêu vi là thuật ngữ chung để chỉ các bệnh nhiễm trùng do virus gây ra, với triệu chứng chính là sốt. 
                  Đây là một trong những bệnh phổ biến nhất, đặc biệt ở trẻ em, có thể gây ra bởi nhiều loại virus khác nhau. 
                  Mặc dù thường là bệnh nhẹ và tự khỏi, nhưng nếu không được điều trị kịp thời có thể dẫn đến các biến chứng nguy hiểm.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bài viết này sẽ cung cấp thông tin chi tiết về triệu chứng, nguyên nhân, cách điều trị và các biện pháp 
                  phòng ngừa hiệu quả để giúp bạn hiểu rõ hơn về căn bệnh này và có cách xử lý phù hợp khi gặp phải.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Viral Fever</li>
                  <li><strong>Tính chất:</strong> Nhiễm trùng virus</li>
                  <li><strong>Triệu chứng chính:</strong> Sốt cao, mệt mỏi</li>
                  <li><strong>Thời gian:</strong> Thường 7-10 ngày</li>
                  <li><strong>Điều trị:</strong> Hỗ trợ, thuốc hạ sốt</li>
                  <li><strong>Phòng ngừa:</strong> Vệ sinh, tiêm vaccine</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của sốt siêu vi có thể thay đổi tùy thuộc vào loại virus và độ tuổi của người bệnh. 
                  Triệu chứng thường xuất hiện đột ngột và có thể kéo dài từ vài ngày đến vài tuần.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> Trên 38.5°C</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Đau đầu:</strong> Đau nhức đầu</li>
                  <li><strong>Đau cơ:</strong> Đau nhức toàn thân</li>
                  <li><strong>Ớn lạnh:</strong> Cảm giác lạnh run</li>
                  <li><strong>Đổ mồ hôi:</strong> Ra mồ hôi nhiều</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng ở trẻ em:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Quấy khóc:</strong> Trẻ khóc nhiều</li>
                  <li><strong>Bỏ ăn:</strong> Không muốn ăn</li>
                  <li><strong>Buồn ngủ:</strong> Ngủ nhiều hơn</li>
                  <li><strong>Phát ban:</strong> Nổi mẩn đỏ</li>
                  <li><strong>Co giật:</strong> Trong trường hợp nặng</li>
                  <li><strong>Khó thở:</strong> Thở nhanh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sốt cao kéo dài:</strong> Trên 40°C</li>
                  <li><strong>Co giật:</strong> Động kinh</li>
                  <li><strong>Mất nước:</strong> Không uống được nước</li>
                  <li><strong>Lú lẫn:</strong> Không tỉnh táo</li>
                  <li><strong>Khó thở:</strong> Thở gấp</li>
                  <li><strong>Phát ban:</strong> Nổi mẩn toàn thân</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt siêu vi có thể do nhiều loại virus khác nhau gây ra. Các virus phổ biến nhất bao gồm 
                  Rhinovirus, Rotavirus, Adenovirus và Enterovirus. Bệnh có thể xảy ra ở mọi lứa tuổi nhưng 
                  thường gặp nhất ở trẻ em dưới 5 tuổi.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Virus phổ biến:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rhinovirus:</strong> Gây cảm lạnh</li>
                  <li><strong>Rotavirus:</strong> Gây tiêu chảy</li>
                  <li><strong>Adenovirus:</strong> Gây viêm họng</li>
                  <li><strong>Enterovirus:</strong> Gây viêm màng não</li>
                  <li><strong>Influenza:</strong> Gây cúm</li>
                  <li><strong>Parainfluenza:</strong> Gây viêm thanh quản</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Đường lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đường hô hấp:</strong> Ho, hắt hơi</li>
                  <li><strong>Tiếp xúc:</strong> Chạm vào người bệnh</li>
                  <li><strong>Vật dụng:</strong> Dùng chung đồ dùng</li>
                  <li><strong>Thực phẩm:</strong> Ăn uống không sạch</li>
                  <li><strong>Nước:</strong> Uống nước bẩn</li>
                  <li><strong>Côn trùng:</strong> Muỗi, ve</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hệ miễn dịch yếu</li>
                  <li>Tuổi già</li>
                  <li>Trẻ em</li>
                  <li>Mang thai</li>
                  <li>Bệnh mãn tính</li>
                  <li>Vệ sinh kém</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc sốt siêu vi hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 5 tuổi</li>
                  <li><strong>Người già:</strong> Trên 65 tuổi</li>
                  <li><strong>Hệ miễn dịch yếu:</strong> HIV, ung thư</li>
                  <li><strong>Mang thai:</strong> Phụ nữ có thai</li>
                  <li><strong>Bệnh mãn tính:</strong> Tiểu đường, tim mạch</li>
                  <li><strong>Vệ sinh kém:</strong> Không rửa tay</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Stress:</strong> Căng thẳng tâm lý</li>
                  <li><strong>Thiếu ngủ:</strong> Ngủ không đủ giấc</li>
                  <li><strong>Dinh dưỡng kém:</strong> Thiếu vitamin</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                  <li><strong>Uống rượu:</strong> Uống nhiều rượu</li>
                  <li><strong>Ô nhiễm:</strong> Môi trường ô nhiễm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hệ miễn dịch khỏe</li>
                  <li>Vệ sinh tốt</li>
                  <li>Tiêm vaccine</li>
                  <li>Dinh dưỡng đầy đủ</li>
                  <li>Vận động thường xuyên</li>
                  <li>Nghỉ ngơi đủ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán sốt siêu vi dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chẩn đoán lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian</li>
                  <li><strong>Khám lâm sàng:</strong> Sốt, mệt mỏi</li>
                  <li><strong>Triệu chứng:</strong> Đau đầu, đau cơ</li>
                  <li><strong>Thời gian:</strong> Cấp tính</li>
                  <li><strong>Nguyên nhân:</strong> Virus</li>
                  <li><strong>Mức độ:</strong> Nhẹ, trung bình, nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Xét nghiệm máu:</strong> Công thức máu</li>
                  <li><strong>Xét nghiệm virus:</strong> PCR, ELISA</li>
                  <li><strong>Cấy máu:</strong> Tìm vi khuẩn</li>
                  <li><strong>X-quang ngực:</strong> Loại trừ viêm phổi</li>
                  <li><strong>Siêu âm:</strong> Đánh giá cơ quan</li>
                  <li><strong>CT scan:</strong> Trong trường hợp nặng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Test nhanh:</strong> Phát hiện virus</li>
                  <li><strong>Test kháng thể:</strong> IgM, IgG</li>
                  <li><strong>Test kháng nguyên:</strong> NS1</li>
                  <li><strong>Test chức năng:</strong> Gan, thận</li>
                  <li><strong>Test dị ứng:</strong> Loại trừ dị ứng</li>
                  <li><strong>Theo dõi:</strong> Triệu chứng</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa sốt siêu vi tập trung vào việc tăng cường hệ miễn dịch, vệ sinh cá nhân và 
                  tránh các yếu tố nguy cơ. Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vệ sinh cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa tay:</strong> Thường xuyên với xà phòng</li>
                  <li><strong>Vệ sinh:</strong> Môi trường sống</li>
                  <li><strong>Tránh:</strong> Tiếp xúc với người bệnh</li>
                  <li><strong>Khử trùng:</strong> Đồ dùng cá nhân</li>
                  <li><strong>Quần áo:</strong> Giặt sạch</li>
                  <li><strong>Nhà cửa:</strong> Vệ sinh sạch sẽ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng cường miễn dịch:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dinh dưỡng:</strong> Ăn đầy đủ chất</li>
                  <li><strong>Vitamin:</strong> C, D, E</li>
                  <li><strong>Khoáng chất:</strong> Kẽm, sắt</li>
                  <li><strong>Vận động:</strong> Thể dục thường xuyên</li>
                  <li><strong>Nghỉ ngơi:</strong> Ngủ đủ giấc</li>
                  <li><strong>Stress:</strong> Quản lý căng thẳng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tiêm vaccine</li>
                  <li>Tránh nơi đông người</li>
                  <li>Đeo khẩu trang</li>
                  <li>Uống nước sạch</li>
                  <li>Ăn thực phẩm an toàn</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Sốt siêu vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị sốt siêu vi tập trung vào việc hỗ trợ triệu chứng và tăng cường sức đề kháng. 
                  Điều trị bao gồm các biện pháp hỗ trợ và thuốc điều trị triệu chứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Uống nước:</strong> Bù nước</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn đầy đủ</li>
                  <li><strong>Vệ sinh:</strong> Giữ sạch sẽ</li>
                  <li><strong>Theo dõi:</strong> Triệu chứng</li>
                  <li><strong>Chăm sóc:</strong> Hỗ trợ tinh thần</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc hạ sốt:</strong> Paracetamol</li>
                  <li><strong>Thuốc giảm đau:</strong> Ibuprofen</li>
                  <li><strong>Thuốc kháng virus:</strong> Trong trường hợp nặng</li>
                  <li><strong>Thuốc kháng histamine:</strong> Giảm dị ứng</li>
                  <li><strong>Thuốc ho:</strong> Giảm ho</li>
                  <li><strong>Thuốc sổ mũi:</strong> Thông mũi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ăn nhẹ:</strong> Chia nhỏ bữa ăn</li>
                  <li><strong>Uống nhiều:</strong> Nước, nước trái cây</li>
                  <li><strong>Tránh:</strong> Thực phẩm khó tiêu</li>
                  <li><strong>Tránh:</strong> Thực phẩm cay nóng</li>
                  <li><strong>Bổ sung:</strong> Vitamin, khoáng chất</li>
                  <li><strong>Ăn đủ:</strong> Protein, carbohydrate</li>
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
