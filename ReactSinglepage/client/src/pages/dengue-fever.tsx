import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function DengueFeverPage() {
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
    "Bệnh Người Cao Tuổi",
    "Da",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
    "Bệnh Phụ Nữ Mang Thai",
    "Bệnh Tuổi Dậy Thì",
    "Bệnh Trẻ Em"
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
                <BreadcrumbPage>Sốt xuất huyết</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">12/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sốt xuất huyết: Nguyên nhân, triệu chứng và cách điều trị
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
                  Sốt xuất huyết là bệnh xảy ra quanh năm, lây lan nhanh trong mùa mưa từ tháng 7 đến tháng 11, 
                  đây là thời điểm thuận lợi cho muỗi sinh sản. Bài viết này sẽ cung cấp thông tin toàn diện về 
                  bệnh sốt xuất huyết, bao gồm triệu chứng, biểu hiện và dấu hiệu nhận biết để giúp bạn đọc và 
                  gia đình có thể phòng ngừa bệnh hiệu quả.
                </p>

                <h3 className="text-xl font-semibold mb-3">Bệnh sốt xuất huyết là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt xuất huyết là bệnh truyền nhiễm phổ biến ở các vùng nhiệt đới, do virus Dengue gây ra 
                  và lây truyền qua muỗi cái Aedes aegypti. Bệnh có thể ảnh hưởng đến cả người lớn và trẻ em, 
                  với các đợt bùng phát mạnh trong mùa mưa khi muỗi sinh sản nhiều hơn.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Virus Dengue có 4 type huyết thanh (DEN-1, DEN-2, DEN-3, DEN-4). Khi một người đã mắc một 
                  type virus Dengue sẽ có miễn dịch suốt đời với type đó, nhưng vẫn có thể bị nhiễm các type 
                  khác, nghĩa là một người có thể mắc sốt xuất huyết nhiều lần. Nếu không được chẩn đoán và 
                  điều trị kịp thời, bệnh có thể trở nên nghiêm trọng, dẫn đến các biến chứng nguy hiểm và 
                  thậm chí tử vong, do đó việc theo dõi triệu chứng và chăm sóc đúng cách là rất quan trọng.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của sốt xuất huyết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Dengue Fever</li>
                  <li><strong>Tính chất:</strong> Bệnh truyền nhiễm cấp tính</li>
                  <li><strong>Triệu chứng chính:</strong> Sốt cao, xuất huyết</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở vùng nhiệt đới</li>
                  <li><strong>Điều trị:</strong> Điều trị triệu chứng</li>
                  <li><strong>Phòng ngừa:</strong> Diệt muỗi, tránh muỗi đốt</li>
                </ul>

                {/* Related Information Link */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Xem thêm:</strong>{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Sốt xuất huyết: nguy hiểm và cách phòng ngừa
                    </a>
                  </p>
                </div>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Sốt xuất huyết</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của sốt xuất huyết thường xuất hiện từ 4-10 ngày sau khi bị muỗi đốt. 
                  Bệnh có thể diễn biến từ nhẹ đến nặng và có thể đe dọa tính mạng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng giai đoạn đầu:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> Sốt đột ngột 39-40°C</li>
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Đau cơ:</strong> Đau cơ, khớp</li>
                  <li><strong>Buồn nôn:</strong> Buồn nôn, nôn</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi toàn thân</li>
                  <li><strong>Phát ban:</strong> Phát ban da</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng xuất huyết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Xuất huyết da:</strong> Chấm xuất huyết</li>
                  <li><strong>Chảy máu cam:</strong> Chảy máu mũi</li>
                  <li><strong>Chảy máu nướu:</strong> Chảy máu lợi</li>
                  <li><strong>Xuất huyết tiêu hóa:</strong> Nôn ra máu</li>
                  <li><strong>Xuất huyết niệu:</strong> Tiểu ra máu</li>
                  <li><strong>Xuất huyết não:</strong> Đau đầu, co giật</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nặng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sốc:</strong> Tụt huyết áp</li>
                  <li><strong>Suy tuần hoàn:</strong> Rối loạn tuần hoàn</li>
                  <li><strong>Suy hô hấp:</strong> Khó thở</li>
                  <li><strong>Suy gan:</strong> Vàng da</li>
                  <li><strong>Suy thận:</strong> Thiểu niệu</li>
                  <li><strong>Hôn mê:</strong> Mất ý thức</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Sốt xuất huyết</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sốt xuất huyết do virus Dengue gây ra và lây truyền qua muỗi Aedes aegypti. 
                  Hiểu biết về nguyên nhân giúp có biện pháp phòng ngừa hiệu quả.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Virus gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Virus Dengue:</strong> Virus chính</li>
                  <li><strong>4 type:</strong> DEN-1, DEN-2, DEN-3, DEN-4</li>
                  <li><strong>Tính chất:</strong> RNA virus</li>
                  <li><strong>Khả năng lây:</strong> Rất cao</li>
                  <li><strong>Miễn dịch:</strong> Tạm thời</li>
                  <li><strong>Biến chủng:</strong> Có thể biến đổi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Muỗi truyền bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Aedes aegypti:</strong> Muỗi chính</li>
                  <li><strong>Aedes albopictus:</strong> Muỗi phụ</li>
                  <li><strong>Hoạt động:</strong> Ban ngày</li>
                  <li><strong>Đẻ trứng:</strong> Nước sạch</li>
                  <li><strong>Phạm vi:</strong> Gần nhà</li>
                  <li><strong>Tuổi thọ:</strong> 2-4 tuần</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Đường lây truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Muỗi đốt người bệnh</li>
                  <li>Virus nhân lên trong muỗi</li>
                  <li>Muỗi đốt người khỏe</li>
                  <li>Virus xâm nhập cơ thể</li>
                  <li>Gây bệnh sốt xuất huyết</li>
                  <li>Lây lan trong cộng đồng</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc sốt xuất huyết hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Trẻ em:</strong> Dưới 15 tuổi</li>
                  <li><strong>Người già:</strong> Trên 65 tuổi</li>
                  <li><strong>Phụ nữ mang thai:</strong> Thai kỳ</li>
                  <li><strong>Bệnh mãn tính:</strong> Tim mạch, tiểu đường</li>
                  <li><strong>Miễn dịch kém:</strong> Suy giảm miễn dịch</li>
                  <li><strong>Lần mắc trước:</strong> Đã mắc sốt xuất huyết</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vùng nhiệt đới:</strong> Khí hậu nóng ẩm</li>
                  <li><strong>Mùa mưa:</strong> Tháng 7-11</li>
                  <li><strong>Đô thị:</strong> Mật độ dân số cao</li>
                  <li><strong>Vệ sinh kém:</strong> Nước đọng</li>
                  <li><strong>Nhà ở:</strong> Nhà ở chật chội</li>
                  <li><strong>Du lịch:</strong> Đi du lịch vùng dịch</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Diệt muỗi</li>
                  <li>Tránh muỗi đốt</li>
                  <li>Vệ sinh môi trường</li>
                  <li>Không để nước đọng</li>
                  <li>Mặc quần áo dài</li>
                  <li>Sử dụng thuốc chống muỗi</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Sốt xuất huyết</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán sốt xuất huyết dựa trên triệu chứng lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán sớm rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Sốt cao:</strong> Sốt đột ngột</li>
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Đau cơ:</strong> Đau cơ, khớp</li>
                  <li><strong>Phát ban:</strong> Phát ban da</li>
                  <li><strong>Xuất huyết:</strong> Chấm xuất huyết</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi toàn thân</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Giảm tiểu cầu</li>
                  <li><strong>Xét nghiệm virus:</strong> Dengue NS1</li>
                  <li><strong>Kháng thể:</strong> IgM, IgG</li>
                  <li><strong>Chức năng gan:</strong> AST, ALT</li>
                  <li><strong>Chức năng thận:</strong> Creatinine</li>
                  <li><strong>Đông máu:</strong> PT, PTT</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Sốt + xuất huyết</li>
                  <li><strong>Xét nghiệm:</strong> NS1 dương tính</li>
                  <li><strong>Tiểu cầu:</strong> Giảm tiểu cầu</li>
                  <li><strong>Loại trừ:</strong> Bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Sốt xuất huyết</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa sốt xuất huyết tập trung vào việc diệt muỗi và tránh muỗi đốt. 
                  Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Diệt muỗi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phun thuốc:</strong> Phun thuốc diệt muỗi</li>
                  <li><strong>Đốt hương:</strong> Đốt hương muỗi</li>
                  <li><strong>Màn chống muỗi:</strong> Màn chống muỗi</li>
                  <li><strong>Thuốc chống muỗi:</strong> Kem chống muỗi</li>
                  <li><strong>Máy đuổi muỗi:</strong> Máy đuổi muỗi</li>
                  <li><strong>Vợt muỗi:</strong> Vợt điện</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Không để nước đọng:</strong> Đổ nước đọng</li>
                  <li><strong>Đậy kín:</strong> Đậy kín bể nước</li>
                  <li><strong>Dọn dẹp:</strong> Dọn dẹp rác</li>
                  <li><strong>Thả cá:</strong> Thả cá diệt lăng quăng</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh nhà cửa</li>
                  <li><strong>Thông thoáng:</strong> Thông thoáng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Bảo vệ cá nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mặc quần áo dài</li>
                  <li>Sử dụng thuốc chống muỗi</li>
                  <li>Ngủ trong màn</li>
                  <li>Tránh ra ngoài lúc muỗi hoạt động</li>
                  <li>Giữ vệ sinh cá nhân</li>
                  <li>Khám sức khỏe định kỳ</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Sốt xuất huyết</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị sốt xuất huyết chủ yếu là điều trị triệu chứng và hỗ trợ. 
                  Không có thuốc đặc hiệu để điều trị virus Dengue.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hạ sốt:</strong> Paracetamol</li>
                  <li><strong>Giảm đau:</strong> Thuốc giảm đau</li>
                  <li><strong>Bù nước:</strong> Uống nhiều nước</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Dinh dưỡng:</strong> Ăn uống đầy đủ</li>
                  <li><strong>Theo dõi:</strong> Theo dõi triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Truyền dịch:</strong> Truyền dịch</li>
                  <li><strong>Truyền máu:</strong> Truyền máu</li>
                  <li><strong>Hỗ trợ hô hấp:</strong> Thở oxy</li>
                  <li><strong>Hỗ trợ tim mạch:</strong> Thuốc tim mạch</li>
                  <li><strong>Hỗ trợ gan:</strong> Thuốc bảo vệ gan</li>
                  <li><strong>Hỗ trợ thận:</strong> Thuốc bảo vệ thận</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị biến chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sốc:</strong> Điều trị sốc</li>
                  <li><strong>Xuất huyết:</strong> Cầm máu</li>
                  <li><strong>Suy gan:</strong> Hỗ trợ gan</li>
                  <li><strong>Suy thận:</strong> Lọc máu</li>
                  <li><strong>Suy hô hấp:</strong> Thở máy</li>
                  <li><strong>Nhiễm trùng:</strong> Kháng sinh</li>
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
