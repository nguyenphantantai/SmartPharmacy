import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AllergyPage() {
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
    "Bệnh Dị Ứng",
    "Da"
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
                <BreadcrumbPage>Bệnh dị ứng</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">18/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh dị ứng là gì? Triệu chứng, nguyên nhân và cách điều trị bệnh dị ứng
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
                  Bệnh dị ứng là một tình trạng phổ biến và có rất nhiều dạng với rất nhiều triệu chứng khác nhau. 
                  Hãy cùng Pharmacity tìm hiểu về Bệnh dị ứng qua bài viết dưới đây.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Tình trạng dị ứng được lý giải là những phản ứng của cơ thể thường xuất hiện khi hệ thống miễn dịch 
                  nhận ra có tác nhân gây hại đang xâm nhập. Những phản ứng này thường biểu hiện qua các dấu hiệu như 
                  nổi mề đay, tiêu chảy, phát ban,...
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Dựa trên tính chất đặc trưng của từng dạng dị ứng, các bác sĩ phân chia bệnh thành các loại như sau:
                </p>

                <h3 className="text-xl font-semibold mb-3">Các loại dị ứng:</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
                  <li>
                    <strong>Dị ứng đường hô hấp:</strong> tình trạng này thường xuất phát do bệnh nhân bị dị ứng thời tiết 
                    (bao gồm tất cả các mùa trong năm), viêm mũi dị ứng, dị ứng với phấn hoa/bụi/nấm mốc/thú cưng.
                  </li>
                  <li>
                    <strong>Dị ứng thức ăn:</strong> phát sinh do sự nhầm lẫn của hệ miễn dịch khi nhận nhầm một chất nào đó 
                    có trong thức ăn là tác nhân gây hại. Do đó, cơ thể điều tiết kháng thể nhằm chống lại các chất này. 
                    Một số dạng thường gặp ở bệnh nhân dị ứng thức ăn là dị ứng sữa, dị ứng trứng, dị ứng Casein, dị ứng lúa mì, dị ứng cá,...
                  </li>
                  <li>
                    <strong>Dị ứng da:</strong> có thể xuất phát từ nhiều nguyên nhân như viêm da tiếp xúc, dị ứng với cây độc 
                    (thường xuân, sumac,...), mày đay, mỹ phẩm, vết cắn của côn trùng,...
                  </li>
                  <li>
                    <strong>Dị ứng thuốc:</strong> một số bệnh nhân bị dị ứng với một trong những thành phần có trong thuốc. 
                    Một vài loại thuốc thường gây ra triệu chứng dị ứng cho bệnh nhân như Salicylate, Penicillin,...
                  </li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của dị ứng rất đa dạng và phụ thuộc vào loại dị ứng và mức độ nghiêm trọng. 
                  Các triệu chứng có thể xuất hiện ngay lập tức hoặc sau vài giờ đến vài ngày.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng dị ứng đường hô hấp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hắt hơi:</strong> Hắt hơi liên tục</li>
                  <li><strong>Nghẹt mũi:</strong> Nghẹt mũi, khó thở</li>
                  <li><strong>Chảy nước mũi:</strong> Nước mũi trong</li>
                  <li><strong>Ngứa mũi:</strong> Ngứa trong mũi</li>
                  <li><strong>Ho:</strong> Ho khan</li>
                  <li><strong>Khó thở:</strong> Khó thở, thở khò khè</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng dị ứng thức ăn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nổi mề đay:</strong> Nốt đỏ trên da</li>
                  <li><strong>Ngứa da:</strong> Ngứa khắp người</li>
                  <li><strong>Phù mặt:</strong> Sưng mặt, môi</li>
                  <li><strong>Tiêu chảy:</strong> Tiêu chảy, đau bụng</li>
                  <li><strong>Nôn:</strong> Nôn mửa</li>
                  <li><strong>Sốc phản vệ:</strong> Sốc phản vệ nghiêm trọng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng dị ứng da:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Phát ban:</strong> Nốt đỏ trên da</li>
                  <li><strong>Ngứa:</strong> Ngứa dữ dội</li>
                  <li><strong>Khô da:</strong> Da khô, bong tróc</li>
                  <li><strong>Viêm da:</strong> Da đỏ, sưng</li>
                  <li><strong>Mụn nước:</strong> Mụn nước nhỏ</li>
                  <li><strong>Chàm:</strong> Chàm eczema</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dị ứng xảy ra khi hệ miễn dịch phản ứng quá mức với các chất thông thường không gây hại. 
                  Hiểu biết về nguyên nhân giúp có biện pháp phòng ngừa hiệu quả.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Cơ chế dị ứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>IgE:</strong> Kháng thể IgE</li>
                  <li><strong>Histamine:</strong> Giải phóng histamine</li>
                  <li><strong>Mast cells:</strong> Tế bào mast</li>
                  <li><strong>Phản ứng:</strong> Phản ứng quá mức</li>
                  <li><strong>Viêm:</strong> Viêm tại chỗ</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng dị ứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tác nhân gây dị ứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phấn hoa:</strong> Phấn hoa các loại</li>
                  <li><strong>Bụi:</strong> Bụi nhà, bụi mạt</li>
                  <li><strong>Thú cưng:</strong> Lông chó, mèo</li>
                  <li><strong>Thức ăn:</strong> Sữa, trứng, cá</li>
                  <li><strong>Thuốc:</strong> Penicillin, aspirin</li>
                  <li><strong>Côn trùng:</strong> Ong, kiến</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Di truyền</li>
                  <li>Tuổi tác</li>
                  <li>Môi trường</li>
                  <li>Stress</li>
                  <li>Nhiễm trùng</li>
                  <li>Hormone</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc dị ứng hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Di truyền:</strong> Gia đình có tiền sử dị ứng</li>
                  <li><strong>Tuổi:</strong> Trẻ em, người cao tuổi</li>
                  <li><strong>Giới tính:</strong> Nữ giới</li>
                  <li><strong>Môi trường:</strong> Môi trường ô nhiễm</li>
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng đường hô hấp</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Thói quen:</strong> Hút thuốc</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Vận động:</strong> Ít vận động</li>
                  <li><strong>Giấc ngủ:</strong> Thiếu ngủ</li>
                  <li><strong>Hormone:</strong> Thay đổi hormone</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Cho con bú sữa mẹ</li>
                  <li>Tiếp xúc sớm với vi khuẩn</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Vận động thường xuyên</li>
                  <li>Giảm stress</li>
                  <li>Môi trường sạch</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán dị ứng dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử dị ứng</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám da:</strong> Khám da, niêm mạc</li>
                  <li><strong>Khám hô hấp:</strong> Khám đường hô hấp</li>
                  <li><strong>Khám tim mạch:</strong> Khám tim mạch</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Test da:</strong> Test dị ứng da</li>
                  <li><strong>Xét nghiệm máu:</strong> IgE toàn phần</li>
                  <li><strong>RAST:</strong> Xét nghiệm RAST</li>
                  <li><strong>Challenge test:</strong> Test thử thách</li>
                  <li><strong>Patch test:</strong> Test áp da</li>
                  <li><strong>Xét nghiệm khác:</strong> Theo chỉ định</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Triệu chứng điển hình</li>
                  <li><strong>Xét nghiệm:</strong> Xét nghiệm dương tính</li>
                  <li><strong>Loại trừ:</strong> Loại trừ bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                  <li><strong>Điều trị:</strong> Đáp ứng điều trị</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa dị ứng tập trung vào việc tránh tiếp xúc với tác nhân gây dị ứng và 
                  tăng cường hệ miễn dịch. Đây là cách hiệu quả nhất để ngăn ngừa dị ứng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh tác nhân gây dị ứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phấn hoa:</strong> Tránh phấn hoa</li>
                  <li><strong>Bụi:</strong> Vệ sinh nhà cửa</li>
                  <li><strong>Thú cưng:</strong> Hạn chế tiếp xúc</li>
                  <li><strong>Thức ăn:</strong> Tránh thức ăn dị ứng</li>
                  <li><strong>Thuốc:</strong> Tránh thuốc dị ứng</li>
                  <li><strong>Côn trùng:</strong> Tránh côn trùng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng cường hệ miễn dịch:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dinh dưỡng:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Vận động:</strong> Tập thể dục</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Stress:</strong> Giảm stress</li>
                  <li><strong>Vitamin:</strong> Bổ sung vitamin</li>
                  <li><strong>Probiotic:</strong> Bổ sung probiotic</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh cá nhân</li>
                  <li>Môi trường sạch</li>
                  <li>Không hút thuốc</li>
                  <li>Tránh ô nhiễm</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị dị ứng bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm triệu chứng và ngăn ngừa tái phát.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Antihistamine:</strong> Thuốc kháng histamine</li>
                  <li><strong>Corticosteroid:</strong> Thuốc corticosteroid</li>
                  <li><strong>Decongestant:</strong> Thuốc thông mũi</li>
                  <li><strong>Bronchodilator:</strong> Thuốc giãn phế quản</li>
                  <li><strong>Topical:</strong> Thuốc bôi ngoài da</li>
                  <li><strong>Eye drops:</strong> Thuốc nhỏ mắt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị căn nguyên:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Immunotherapy:</strong> Liệu pháp miễn dịch</li>
                  <li><strong>Allergy shots:</strong> Tiêm dị ứng</li>
                  <li><strong>Sublingual:</strong> Thuốc dưới lưỡi</li>
                  <li><strong>Desensitization:</strong> Giảm mẫn cảm</li>
                  <li><strong>Biologic:</strong> Thuốc sinh học</li>
                  <li><strong>Monoclonal:</strong> Kháng thể đơn dòng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị cấp cứu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Epinephrine:</strong> Epinephrine</li>
                  <li><strong>Oxygen:</strong> Thở oxy</li>
                  <li><strong>IV fluids:</strong> Truyền dịch</li>
                  <li><strong>Antihistamine:</strong> Kháng histamine</li>
                  <li><strong>Corticosteroid:</strong> Corticosteroid</li>
                  <li><strong>Monitoring:</strong> Theo dõi liên tục</li>
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
