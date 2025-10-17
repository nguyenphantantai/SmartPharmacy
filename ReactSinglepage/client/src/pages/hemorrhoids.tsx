import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function HemorrhoidsPage() {
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
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Tiêu Hóa",
    "Bệnh Người Cao Tuổi",
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
                <BreadcrumbPage>Bệnh trĩ</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">12/07/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh trĩ là gì? Nguyên nhân và triệu chứng cần biết
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
                  Bệnh trĩ là một tình trạng phổ biến ảnh hưởng đến nhiều người, đặc biệt là những người làm việc văn phòng ít vận động. 
                  Theo Hội Hậu môn trực tràng học Việt Nam, bệnh trĩ chiếm tới 35% – 50% các bệnh thuộc về đại trực tràng. 
                  Nhiều người đi khám trễ vì xấu hổ khiến bệnh biến chứng nặng. Hãy cùng tìm hiểu chi tiết về bệnh trĩ, nguyên nhân và triệu chứng cần biết.
                </p>

                <h3 className="text-xl font-semibold mb-3">Bệnh trĩ là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh trĩ (Hemorrhoids) là tình trạng các tĩnh mạch ở hậu môn và trực tràng dưới bị giãn ra.
                </p>

                <h3 className="text-xl font-semibold mb-3">Phân loại bệnh trĩ:</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Trĩ nội (Internal hemorrhoids)</h4>
                    <p className="text-gray-700">
                      Các tĩnh mạch cuối trực tràng giãn ra tạo thành búi trĩ nổi trên niêm mạc – phần ranh giới của hậu môn và trực tràng. 
                      Trĩ nội nằm sâu bên trong trực tràng, không thể sờ thấy hoặc nhìn thấy được. 
                      Khi trĩ phát triển, người bệnh có thể thấy búi trĩ lòi ra khi đi tiêu.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Trĩ ngoại (External hemorrhoids)</h4>
                    <p className="text-gray-700">
                      Búi trĩ hình thành ngay dưới lớp da hậu môn, dễ nhìn và sờ thấy. 
                      Trĩ ngoại dễ cọ sát với quần áo, ghế ngồi gây đau đớn.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Hemorrhoids</li>
                  <li><strong>Tính chất:</strong> Cấp tính hoặc mạn tính</li>
                  <li><strong>Triệu chứng chính:</strong> Đau, chảy máu, sa búi trĩ</li>
                  <li><strong>Tần suất:</strong> Rất phổ biến</li>
                  <li><strong>Điều trị:</strong> Nội khoa hoặc ngoại khoa</li>
                  <li><strong>Phòng ngừa:</strong> Chế độ ăn, tập thể dục</li>
                </ul>
            </div>
              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh trĩ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của bệnh trĩ phụ thuộc vào loại trĩ và mức độ nghiêm trọng. 
                  Triệu chứng có thể từ nhẹ đến nặng và ảnh hưởng đến chất lượng cuộc sống.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chảy máu:</strong> Chảy máu khi đi đại tiện</li>
                  <li><strong>Sa búi trĩ:</strong> Búi trĩ lòi ra ngoài</li>
                  <li><strong>Đau:</strong> Đau vùng hậu môn</li>
                  <li><strong>Ngứa:</strong> Ngứa hậu môn</li>
                  <li><strong>Khó chịu:</strong> Cảm giác khó chịu</li>
                  <li><strong>Chảy dịch:</strong> Chảy dịch nhầy</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo loại:</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Trĩ nội</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Chảy máu không đau</li>
                      <li>Sa búi trĩ</li>
                      <li>Cảm giác chưa đi hết</li>
                      <li>Chảy dịch nhầy</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Trĩ ngoại</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Đau dữ dội</li>
                      <li>Sưng tấy</li>
                      <li>Ngứa ngáy</li>
                      <li>Khó ngồi</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nghẹt búi trĩ:</strong> Búi trĩ bị nghẹt</li>
                  <li><strong>Hoại tử:</strong> Búi trĩ bị hoại tử</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng hậu môn</li>
                  <li><strong>Thiếu máu:</strong> Thiếu máu do chảy máu</li>
                  <li><strong>Đau không chịu nổi:</strong> Đau dữ dội</li>
                  <li><strong>Sốt:</strong> Sốt cao</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh trĩ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh trĩ có thể do nhiều nguyên nhân khác nhau, từ áp lực tăng lên các tĩnh mạch hậu môn 
                  đến các yếu tố lối sống và bệnh lý.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Áp lực tăng:</strong> Áp lực lên tĩnh mạch hậu môn</li>
                  <li><strong>Táo bón:</strong> Rặn mạnh khi đi đại tiện</li>
                  <li><strong>Tiêu chảy:</strong> Tiêu chảy kéo dài</li>
                  <li><strong>Mang thai:</strong> Áp lực từ thai nhi</li>
                  <li><strong>Ngồi lâu:</strong> Ngồi lâu không vận động</li>
                  <li><strong>Tuổi già:</strong> Suy yếu cơ sàn chậu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Ít chất xơ</li>
                  <li><strong>Uống ít nước:</strong> Thiếu nước</li>
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Béo phì:</strong> Thừa cân</li>
                  <li><strong>Di truyền:</strong> Tiền sử gia đình</li>
                  <li><strong>Stress:</strong> Căng thẳng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Lao động nặng</li>
                  <li>Chơi thể thao</li>
                  <li>Quan hệ tình dục qua đường hậu môn</li>
                  <li>Bệnh gan</li>
                  <li>Bệnh tim</li>
                  <li>Thuốc</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc bệnh trĩ hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trên 50 tuổi</li>
                  <li><strong>Mang thai:</strong> Phụ nữ mang thai</li>
                  <li><strong>Sinh đẻ:</strong> Sau khi sinh</li>
                  <li><strong>Nghề nghiệp:</strong> Ngồi lâu, đứng lâu</li>
                  <li><strong>Táo bón:</strong> Táo bón mạn tính</li>
                  <li><strong>Béo phì:</strong> Thừa cân</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Di truyền:</strong> Tiền sử gia đình</li>
                  <li><strong>Chế độ ăn:</strong> Ít chất xơ</li>
                  <li><strong>Ít vận động:</strong> Lối sống tĩnh tại</li>
                  <li><strong>Stress:</strong> Căng thẳng</li>
                  <li><strong>Thuốc:</strong> Một số loại thuốc</li>
                  <li><strong>Bệnh tật:</strong> Bệnh mạn tính</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ăn nhiều chất xơ</li>
                  <li>Uống đủ nước</li>
                  <li>Tập thể dục thường xuyên</li>
                  <li>Không rặn mạnh</li>
                  <li>Đi đại tiện đúng giờ</li>
                  <li>Giữ cân nặng hợp lý</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh trĩ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bệnh trĩ dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian</li>
                  <li><strong>Khám hậu môn:</strong> Khám vùng hậu môn</li>
                  <li><strong>Khám trực tràng:</strong> Thăm khám trực tràng</li>
                  <li><strong>Nội soi:</strong> Nội soi hậu môn</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                  <li><strong>Phân loại:</strong> Phân loại trĩ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Thiếu máu</li>
                  <li><strong>X-quang:</strong> Hình ảnh bụng</li>
                  <li><strong>Siêu âm:</strong> Siêu âm bụng</li>
                  <li><strong>Nội soi:</strong> Nội soi đại tràng</li>
                  <li><strong>Sinh thiết:</strong> Nếu cần</li>
                  <li><strong>CT/MRI:</strong> Trong trường hợp đặc biệt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phân độ trĩ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Độ 1:</strong> Chỉ chảy máu</li>
                  <li><strong>Độ 2:</strong> Sa khi rặn, tự co</li>
                  <li><strong>Độ 3:</strong> Sa khi rặn, đẩy vào được</li>
                  <li><strong>Độ 4:</strong> Sa thường xuyên</li>
                  <li><strong>Nghẹt:</strong> Búi trĩ bị nghẹt</li>
                  <li><strong>Hoại tử:</strong> Búi trĩ bị hoại tử</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh trĩ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa bệnh trĩ tập trung vào việc thay đổi lối sống và chế độ ăn uống. 
                  Đây là cách hiệu quả nhất để giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chế độ ăn uống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chất xơ:</strong> Ăn nhiều chất xơ</li>
                  <li><strong>Rau quả:</strong> Ăn nhiều rau quả</li>
                  <li><strong>Ngũ cốc:</strong> Ngũ cốc nguyên hạt</li>
                  <li><strong>Uống nước:</strong> Uống đủ nước</li>
                  <li><strong>Tránh:</strong> Tránh thức ăn cay</li>
                  <li><strong>Hạn chế:</strong> Hạn chế rượu bia</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tập thể dục:</strong> Tập thể dục thường xuyên</li>
                  <li><strong>Đi bộ:</strong> Đi bộ hàng ngày</li>
                  <li><strong>Không rặn:</strong> Không rặn mạnh</li>
                  <li><strong>Thời gian:</strong> Đi đại tiện đúng giờ</li>
                  <li><strong>Không ngồi lâu:</strong> Tránh ngồi lâu</li>
                  <li><strong>Stress:</strong> Quản lý stress</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Theo dõi triệu chứng</li>
                  <li>Điều trị sớm</li>
                  <li>Tránh táo bón</li>
                  <li>Giữ vệ sinh</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh trĩ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị bệnh trĩ tùy thuộc vào loại trĩ và mức độ nghiêm trọng. 
                  Điều trị bao gồm thay đổi lối sống, thuốc và phẫu thuật.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị nội khoa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc bôi:</strong> Thuốc bôi hậu môn</li>
                  <li><strong>Thuốc uống:</strong> Thuốc giảm đau</li>
                  <li><strong>Thuốc nhuận tràng:</strong> Lactulose</li>
                  <li><strong>Thuốc co mạch:</strong> Giảm sưng</li>
                  <li><strong>Thuốc kháng viêm:</strong> Giảm viêm</li>
                  <li><strong>Thuốc kháng sinh:</strong> Nếu nhiễm trùng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị ngoại khoa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thắt trĩ:</strong> Thắt búi trĩ</li>
                  <li><strong>Tiêm xơ:</strong> Tiêm thuốc xơ</li>
                  <li><strong>Đốt laser:</strong> Đốt bằng laser</li>
                  <li><strong>Cắt trĩ:</strong> Phẫu thuật cắt</li>
                  <li><strong>Khâu treo:</strong> Khâu treo búi trĩ</li>
                  <li><strong>Longo:</strong> Phẫu thuật Longo</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Ngâm nước ấm:</strong> Ngâm hậu môn</li>
                  <li><strong>Vật lý trị liệu:</strong> Tập cơ sàn chậu</li>
                  <li><strong>Tâm lý:</strong> Điều trị tâm lý</li>
                  <li><strong>Theo dõi:</strong> Theo dõi định kỳ</li>
                  <li><strong>Giáo dục:</strong> Giáo dục bệnh nhân</li>
                  <li><strong>Phòng ngừa:</strong> Phòng ngừa tái phát</li>
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
