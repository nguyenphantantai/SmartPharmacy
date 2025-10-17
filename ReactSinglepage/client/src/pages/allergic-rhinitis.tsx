import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart, Play } from "lucide-react";
import { useState } from "react";

export default function AllergicRhinitisPage() {
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
    "Bệnh Tai Mũi Họng"
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
                <BreadcrumbPage>Viêm mũi dị ứng</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">19/08/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Viêm mũi dị ứng là gì? Dấu hiệu, nguyên nhân, chẩn đoán và điều trị
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
                  Viêm mũi dị ứng là một bệnh lý hô hấp phổ biến, gây ra các triệu chứng như ngứa mũi, 
                  chảy nước mũi và nghẹt mũi. Bệnh có thể ảnh hưởng đến chất lượng cuộc sống và hiệu suất 
                  làm việc, học tập của người bệnh. Hiểu biết về nguyên nhân, triệu chứng và cách điều trị 
                  sẽ giúp bạn phòng ngừa và kiểm soát bệnh hiệu quả.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Bài viết dưới đây sẽ cung cấp những thông tin chi tiết và hữu ích về bệnh viêm mũi dị ứng.
                </p>

                <h3 className="text-xl font-semibold mb-3">Định nghĩa viêm mũi dị ứng:</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm mũi dị ứng là tình trạng viêm của niêm mạc mũi do phản ứng dị ứng với các chất gây dị ứng 
                  trong môi trường. Khi cơ thể tiếp xúc với các chất này, hệ miễn dịch sẽ phản ứng quá mức, 
                  giải phóng histamine và các chất trung gian khác, gây ra các triệu chứng đặc trưng của bệnh.
                </p>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Viêm mũi dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của viêm mũi dị ứng có thể khác nhau tùy thuộc vào mức độ nghiêm trọng và 
                  loại chất gây dị ứng. Các triệu chứng thường xuất hiện ngay sau khi tiếp xúc với chất gây dị ứng 
                  và có thể kéo dài trong vài giờ đến vài ngày.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ngứa mũi:</strong> Ngứa mũi, ngứa mắt</li>
                  <li><strong>Chảy nước mũi:</strong> Chảy nước mũi trong</li>
                  <li><strong>Nghẹt mũi:</strong> Nghẹt mũi, khó thở</li>
                  <li><strong>Hắt hơi:</strong> Hắt hơi liên tục</li>
                  <li><strong>Ngứa mắt:</strong> Ngứa mắt, đỏ mắt</li>
                  <li><strong>Chảy nước mắt:</strong> Chảy nước mắt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo mức độ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nhẹ:</strong> Triệu chứng nhẹ, không ảnh hưởng sinh hoạt</li>
                  <li><strong>Trung bình:</strong> Triệu chứng vừa phải, ảnh hưởng sinh hoạt</li>
                  <li><strong>Nặng:</strong> Triệu chứng nặng, ảnh hưởng nghiêm trọng</li>
                  <li><strong>Cấp tính:</strong> Triệu chứng xuất hiện đột ngột</li>
                  <li><strong>Mạn tính:</strong> Triệu chứng kéo dài</li>
                  <li><strong>Theo mùa:</strong> Triệu chứng theo mùa</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đau đầu:</strong> Đau đầu, đau mặt</li>
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi, khó chịu</li>
                  <li><strong>Khó ngủ:</strong> Khó ngủ do nghẹt mũi</li>
                  <li><strong>Giảm khứu giác:</strong> Giảm khứu giác</li>
                  <li><strong>Ho:</strong> Ho, đặc biệt vào ban đêm</li>
                  <li><strong>Khàn tiếng:</strong> Khàn tiếng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Viêm mũi dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viêm mũi dị ứng có thể do nhiều nguyên nhân khác nhau, chủ yếu là do tiếp xúc với các chất gây dị ứng 
                  trong môi trường. Hiểu biết về nguyên nhân giúp có biện pháp phòng ngừa và điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chất gây dị ứng trong không khí:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phấn hoa:</strong> Phấn hoa cây, cỏ, hoa</li>
                  <li><strong>Bụi:</strong> Bụi nhà, bụi đường</li>
                  <li><strong>Nấm mốc:</strong> Nấm mốc trong nhà</li>
                  <li><strong>Lông động vật:</strong> Lông chó, mèo</li>
                  <li><strong>Khói:</strong> Khói thuốc, khói bếp</li>
                  <li><strong>Hóa chất:</strong> Hóa chất, mùi hương</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chất gây dị ứng trong thức ăn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hải sản:</strong> Tôm, cua, cá</li>
                  <li><strong>Trứng:</strong> Trứng gà, trứng vịt</li>
                  <li><strong>Sữa:</strong> Sữa bò, sữa dê</li>
                  <li><strong>Đậu phộng:</strong> Đậu phộng, hạt</li>
                  <li><strong>Lúa mì:</strong> Lúa mì, gluten</li>
                  <li><strong>Trái cây:</strong> Trái cây có múi</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Di truyền</li>
                  <li>Tuổi tác</li>
                  <li>Giới tính</li>
                  <li>Môi trường</li>
                  <li>Stress</li>
                  <li>Hệ miễn dịch</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc viêm mũi dị ứng hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Di truyền:</strong> Gia đình có tiền sử dị ứng</li>
                  <li><strong>Tuổi:</strong> Trẻ em, thanh thiếu niên</li>
                  <li><strong>Giới tính:</strong> Nam giới</li>
                  <li><strong>Môi trường:</strong> Môi trường ô nhiễm</li>
                  <li><strong>Nghề nghiệp:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc, hút thuốc thụ động</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Thiếu ngủ:</strong> Thiếu ngủ</li>
                  <li><strong>Vận động:</strong> Ít vận động</li>
                  <li><strong>Bệnh mạn tính:</strong> Bệnh mạn tính</li>
                  <li><strong>Thuốc:</strong> Sử dụng thuốc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh môi trường</li>
                  <li>Tránh chất gây dị ứng</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Tập thể dục</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Giảm stress</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Viêm mũi dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán viêm mũi dị ứng dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử bệnh, tiền sử gia đình</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám mũi:</strong> Khám mũi</li>
                  <li><strong>Khám mắt:</strong> Khám mắt</li>
                  <li><strong>Khám họng:</strong> Khám họng</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Test da:</strong> Test da với chất gây dị ứng</li>
                  <li><strong>Xét nghiệm máu:</strong> Xét nghiệm IgE</li>
                  <li><strong>Test kích thích:</strong> Test kích thích mũi</li>
                  <li><strong>Nội soi mũi:</strong> Nội soi mũi</li>
                  <li><strong>Xét nghiệm khác:</strong> Xét nghiệm hỗ trợ</li>
                  <li><strong>Theo dõi:</strong> Theo dõi triệu chứng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Triệu chứng điển hình</li>
                  <li><strong>Khám:</strong> Khám lâm sàng</li>
                  <li><strong>Xét nghiệm:</strong> Xét nghiệm hỗ trợ</li>
                  <li><strong>Loại trừ:</strong> Loại trừ bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Viêm mũi dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa viêm mũi dị ứng tập trung vào việc tránh tiếp xúc với chất gây dị ứng và 
                  tăng cường hệ miễn dịch. Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tránh chất gây dị ứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Phấn hoa:</strong> Tránh tiếp xúc phấn hoa</li>
                  <li><strong>Bụi:</strong> Vệ sinh nhà cửa</li>
                  <li><strong>Nấm mốc:</strong> Kiểm soát độ ẩm</li>
                  <li><strong>Lông động vật:</strong> Tránh nuôi thú cưng</li>
                  <li><strong>Khói:</strong> Tránh khói thuốc</li>
                  <li><strong>Hóa chất:</strong> Tránh hóa chất</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Vệ sinh môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vệ sinh:</strong> Vệ sinh nhà cửa</li>
                  <li><strong>Lọc không khí:</strong> Sử dụng máy lọc không khí</li>
                  <li><strong>Độ ẩm:</strong> Kiểm soát độ ẩm</li>
                  <li><strong>Thông gió:</strong> Thông gió tốt</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh cá nhân</li>
                  <li><strong>Bảo vệ:</strong> Bảo vệ khỏi ô nhiễm</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tăng cường miễn dịch:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Dinh dưỡng tốt</li>
                  <li>Tập thể dục</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Giảm stress</li>
                  <li>Bổ sung vitamin</li>
                  <li>Tiêm phòng</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Viêm mũi dị ứng</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị viêm mũi dị ứng bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm triệu chứng và ngăn ngừa tái phát.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc kháng histamine:</strong> Thuốc kháng histamine</li>
                  <li><strong>Thuốc thông mũi:</strong> Thuốc thông mũi</li>
                  <li><strong>Thuốc xịt mũi:</strong> Thuốc xịt mũi</li>
                  <li><strong>Thuốc nhỏ mắt:</strong> Thuốc nhỏ mắt</li>
                  <li><strong>Thuốc khác:</strong> Thuốc hỗ trợ</li>
                  <li><strong>Liệu pháp:</strong> Liệu pháp hỗ trợ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị căn nguyên:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Miễn dịch trị liệu:</strong> Miễn dịch trị liệu</li>
                  <li><strong>Thuốc khác:</strong> Thuốc đặc hiệu</li>
                  <li><strong>Liệu pháp:</strong> Liệu pháp hỗ trợ</li>
                  <li><strong>Điều trị:</strong> Điều trị biến chứng</li>
                  <li><strong>Theo dõi:</strong> Theo dõi điều trị</li>
                  <li><strong>Phòng ngừa:</strong> Phòng ngừa tái phát</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Rửa mũi:</strong> Rửa mũi bằng nước muối</li>
                  <li><strong>Xịt mũi:</strong> Xịt mũi thường xuyên</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng tốt</li>
                  <li><strong>Tập thể dục:</strong> Tập thể dục</li>
                  <li><strong>Giảm stress:</strong> Giảm stress</li>
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
