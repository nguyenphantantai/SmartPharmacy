import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function ConstipationPage() {
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
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Trẻ Em",
    "Bệnh Nội Tiết - Chuyển Hóa"
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
                <BreadcrumbPage>Táo bón</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">03/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Những điều cần biết về bệnh táo bón
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
                  Táo bón là tình trạng hay bệnh lý phổ biến nhất trong số các bệnh lý về đường tiêu hóa, 
                  hầu hết ai cũng hơn một lần bị táo bón trong đời. Bài viết dưới đây sẽ cung cấp cho các bạn một số thông tin về bệnh táo bón.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Táo bón là tình trạng phân khô cứng, khiến người bệnh khó và thậm chí bị đau khi đi đại tiện, 
                  phải rặn mạnh phân mới có thể thoát ra, thời gian đi lâu hoặc nhiều ngày mới đi một lần.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Constipation</li>
                  <li><strong>Tính chất:</strong> Cấp tính hoặc mạn tính</li>
                  <li><strong>Triệu chứng chính:</strong> Phân khô cứng, khó đi</li>
                  <li><strong>Tần suất:</strong> Ít hơn 3 lần/tuần</li>
                  <li><strong>Điều trị:</strong> Thay đổi lối sống, thuốc</li>
                  <li><strong>Phòng ngừa:</strong> Chế độ ăn, tập thể dục</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Táo bón</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của táo bón có thể khác nhau tùy thuộc vào mức độ nghiêm trọng và nguyên nhân gây bệnh. 
                  Triệu chứng chính là giảm tần suất đi đại tiện và khó khăn khi đi.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giảm tần suất:</strong> Ít hơn 3 lần/tuần</li>
                  <li><strong>Phân khô cứng:</strong> Phân cứng, khô</li>
                  <li><strong>Khó đi:</strong> Phải rặn mạnh</li>
                  <li><strong>Đau khi đi:</strong> Đau hậu môn</li>
                  <li><strong>Cảm giác chưa hết:</strong> Cảm giác chưa đi hết</li>
                  <li><strong>Thời gian lâu:</strong> Thời gian đi lâu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đầy bụng:</strong> Cảm giác đầy bụng</li>
                  <li><strong>Chướng bụng:</strong> Bụng căng phồng</li>
                  <li><strong>Đau bụng:</strong> Đau vùng bụng</li>
                  <li><strong>Buồn nôn:</strong> Cảm giác muốn nôn</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                  <li><strong>Chán ăn:</strong> Không muốn ăn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tắc ruột:</strong> Không đi được</li>
                  <li><strong>Nôn mửa:</strong> Nôn liên tục</li>
                  <li><strong>Đau bụng dữ dội:</strong> Đau không chịu nổi</li>
                  <li><strong>Sốt:</strong> Sốt cao</li>
                  <li><strong>Chảy máu:</strong> Chảy máu hậu môn</li>
                  <li><strong>Giảm cân:</strong> Giảm cân không rõ nguyên nhân</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Táo bón</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Táo bón có thể do nhiều nguyên nhân khác nhau, từ chế độ ăn uống đến các bệnh lý nghiêm trọng. 
                  Hiểu rõ nguyên nhân giúp có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân thường gặp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Ít chất xơ</li>
                  <li><strong>Uống ít nước:</strong> Thiếu nước</li>
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Nhịn đi:</strong> Nhịn đi đại tiện</li>
                  <li><strong>Thuốc:</strong> Một số loại thuốc</li>
                  <li><strong>Stress:</strong> Căng thẳng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân bệnh lý:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hội chứng ruột kích thích:</strong> IBS</li>
                  <li><strong>Bệnh trĩ:</strong> Trĩ nội, trĩ ngoại</li>
                  <li><strong>Nứt hậu môn:</strong> Vết nứt hậu môn</li>
                  <li><strong>Sa trực tràng:</strong> Sa trực tràng</li>
                  <li><strong>Ung thư:</strong> Ung thư đại tràng</li>
                  <li><strong>Bệnh thần kinh:</strong> Parkinson, đột quỵ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Thay đổi môi trường</li>
                  <li>Du lịch</li>
                  <li>Mang thai</li>
                  <li>Tuổi già</li>
                  <li>Bệnh tiểu đường</li>
                  <li>Suy giáp</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc táo bón hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi già:</strong> Trên 65 tuổi</li>
                  <li><strong>Phụ nữ:</strong> Phụ nữ có nguy cơ cao hơn</li>
                  <li><strong>Mang thai:</strong> Phụ nữ mang thai</li>
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Chế độ ăn:</strong> Ít chất xơ</li>
                  <li><strong>Thuốc:</strong> Dùng nhiều thuốc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Trẻ em</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                  <li><strong>Thay đổi:</strong> Thay đổi môi trường</li>
                  <li><strong>Du lịch:</strong> Đi du lịch</li>
                  <li><strong>Bệnh tật:</strong> Bệnh mạn tính</li>
                  <li><strong>Phẫu thuật:</strong> Sau phẫu thuật</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ăn nhiều chất xơ</li>
                  <li>Uống đủ nước</li>
                  <li>Tập thể dục thường xuyên</li>
                  <li>Không nhịn đi</li>
                  <li>Quản lý stress</li>
                  <li>Khám sức khỏe định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Táo bón</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán táo bón dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tần suất:</strong> Ít hơn 3 lần/tuần</li>
                  <li><strong>Phân cứng:</strong> Phân khô cứng</li>
                  <li><strong>Khó đi:</strong> Phải rặn mạnh</li>
                  <li><strong>Cảm giác:</strong> Cảm giác chưa hết</li>
                  <li><strong>Thời gian:</strong> Kéo dài trên 3 tháng</li>
                  <li><strong>Triệu chứng:</strong> Ít nhất 2 triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian</li>
                  <li><strong>Khám bụng:</strong> Khám vùng bụng</li>
                  <li><strong>Khám hậu môn:</strong> Khám hậu môn</li>
                  <li><strong>Khám trực tràng:</strong> Thăm khám trực tràng</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                  <li><strong>Nguyên nhân:</strong> Tìm nguyên nhân</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Công thức máu:</strong> Thiếu máu</li>
                  <li><strong>Chức năng tuyến giáp:</strong> TSH, T3, T4</li>
                  <li><strong>Đường huyết:</strong> Tiểu đường</li>
                  <li><strong>Điện giải:</strong> Kali, natri</li>
                  <li><strong>X-quang bụng:</strong> Hình ảnh bụng</li>
                  <li><strong>Nội soi:</strong> Nội soi đại tràng</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Táo bón</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa táo bón tập trung vào việc thay đổi lối sống và chế độ ăn uống. 
                  Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chất xơ:</strong> Ăn nhiều chất xơ</li>
                  <li><strong>Rau quả:</strong> Ăn nhiều rau quả</li>
                  <li><strong>Ngũ cốc:</strong> Ngũ cốc nguyên hạt</li>
                  <li><strong>Uống nước:</strong> Uống đủ nước</li>
                  <li><strong>Tránh:</strong> Tránh thức ăn chế biến</li>
                  <li><strong>Hạn chế:</strong> Hạn chế thịt đỏ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tập thể dục:</strong> Tập thể dục thường xuyên</li>
                  <li><strong>Đi bộ:</strong> Đi bộ hàng ngày</li>
                  <li><strong>Không nhịn:</strong> Không nhịn đi đại tiện</li>
                  <li><strong>Thời gian:</strong> Đi đại tiện đúng giờ</li>
                  <li><strong>Thư giãn:</strong> Thư giãn khi đi</li>
                  <li><strong>Stress:</strong> Quản lý stress</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Theo dõi triệu chứng</li>
                  <li>Điều trị sớm</li>
                  <li>Tránh thuốc gây táo bón</li>
                  <li>Giữ môi trường sạch</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Táo bón</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị táo bón tùy thuộc vào nguyên nhân và mức độ nghiêm trọng. 
                  Điều trị bao gồm thay đổi lối sống và sử dụng thuốc.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thay đổi lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Ăn nhiều chất xơ</li>
                  <li><strong>Uống nước:</strong> Uống đủ nước</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục thường xuyên</li>
                  <li><strong>Không nhịn:</strong> Không nhịn đi</li>
                  <li><strong>Thời gian:</strong> Đi đại tiện đúng giờ</li>
                  <li><strong>Thư giãn:</strong> Thư giãn khi đi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc nhuận tràng:</strong> Lactulose</li>
                  <li><strong>Thuốc kích thích:</strong> Bisacodyl</li>
                  <li><strong>Thuốc thẩm thấu:</strong> Polyethylene glycol</li>
                  <li><strong>Thuốc làm mềm:</strong> Docusate</li>
                  <li><strong>Thuốc bôi:</strong> Thuốc bôi hậu môn</li>
                  <li><strong>Thuốc uống:</strong> Thuốc uống</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Thụt tháo:</strong> Thụt tháo</li>
                  <li><strong>Phẫu thuật:</strong> Trong trường hợp nặng</li>
                  <li><strong>Vật lý trị liệu:</strong> Tập cơ sàn chậu</li>
                  <li><strong>Tâm lý:</strong> Điều trị tâm lý</li>
                  <li><strong>Theo dõi:</strong> Theo dõi định kỳ</li>
                  <li><strong>Giáo dục:</strong> Giáo dục bệnh nhân</li>
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
