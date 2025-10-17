import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function DelayedPeriodPage() {
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
    "Bệnh Nội Tiết - Chuyển Hóa",
    "Bệnh Nữ Giới",
    "Sinh dục",
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
                <BreadcrumbPage>Chậm kinh</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">19/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Chậm kinh: Nguyên nhân, triệu chứng và cách điều trị
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
                <h2 className="text-2xl font-bold mb-4">Tổng quan chung về chậm kinh là gì</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chậm kinh là một tình trạng phổ biến ở phụ nữ, có thể do nhiều nguyên nhân khác nhau. 
                  Tình trạng này có thể ảnh hưởng đến sức khỏe tinh thần và thể chất của phụ nữ, 
                  và có thể là dấu hiệu của các vấn đề sức khỏe tiềm ẩn. Hãy cùng tìm hiểu chi tiết về chậm kinh, 
                  nguyên nhân và cách điều trị trong bài viết dưới đây.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Chậm kinh (hay còn gọi là trễ kinh) là hiện tượng bất thường của chu kỳ kinh nguyệt, 
                  trong đó kinh nguyệt được dự kiến sẽ xuất hiện nhưng lại không đến. 
                  Nếu sau hơn 35 ngày kể từ lần kinh cuối cùng mà kinh nguyệt vẫn chưa xuất hiện, 
                  thì được coi là chậm kinh. Nếu kinh nguyệt không xuất hiện trong 3 chu kỳ liên tiếp mà không có thai, 
                  thì được gọi là mất kinh (hay vô kinh).
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số phụ nữ có chu kỳ kinh nguyệt đều đặn, trong khi những người khác có thể có chu kỳ hơi khác nhau. 
                  Tuy nhiên, kinh nguyệt vẫn được coi là đều đặn nếu nó xuất hiện trong khoảng từ 21 đến 35 ngày.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của chậm kinh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Oligomenorrhea</li>
                  <li><strong>Tính chất:</strong> Chu kỳ kinh nguyệt bất thường</li>
                  <li><strong>Triệu chứng chính:</strong> Kinh nguyệt đến muộn</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở phụ nữ</li>
                  <li><strong>Điều trị:</strong> Tùy thuộc nguyên nhân</li>
                  <li><strong>Phòng ngừa:</strong> Lối sống lành mạnh</li>
                </ul>
            </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Chậm kinh</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng chính của chậm kinh là kinh nguyệt không xuất hiện đúng thời gian dự kiến. 
                  Tuy nhiên, có thể có các triệu chứng khác đi kèm tùy thuộc vào nguyên nhân gây bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kinh nguyệt muộn:</strong> Không xuất hiện đúng thời gian</li>
                  <li><strong>Chu kỳ không đều:</strong> Thay đổi thời gian</li>
                  <li><strong>Lượng máu bất thường:</strong> Ít hoặc nhiều hơn</li>
                  <li><strong>Đau bụng:</strong> Đau vùng bụng dưới</li>
                  <li><strong>Thay đổi tâm trạng:</strong> Lo âu, căng thẳng</li>
                  <li><strong>Mệt mỏi:</strong> Cảm giác yếu ớt</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo nguyên nhân:</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Mang thai</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Buồn nôn</li>
                      <li>Mệt mỏi</li>
                      <li>Ngực căng tức</li>
                      <li>Thay đổi khẩu vị</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Stress</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Lo âu</li>
                      <li>Mất ngủ</li>
                      <li>Thay đổi cân nặng</li>
                      <li>Khó tập trung</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nghiêm trọng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Đau bụng dữ dội:</strong> Đau không chịu nổi</li>
                  <li><strong>Sốt:</strong> Sốt cao</li>
                  <li><strong>Chảy máu bất thường:</strong> Chảy máu nhiều</li>
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Thay đổi thị lực:</strong> Nhìn mờ</li>
                  <li><strong>Khó thở:</strong> Thở gấp</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Chậm kinh</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chậm kinh có thể do nhiều nguyên nhân khác nhau, từ các yếu tố sinh lý bình thường 
                  đến các bệnh lý nghiêm trọng cần điều trị.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân sinh lý:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mang thai:</strong> Nguyên nhân phổ biến nhất</li>
                  <li><strong>Cho con bú:</strong> Prolactin cao</li>
                  <li><strong>Tuổi dậy thì:</strong> Chu kỳ chưa ổn định</li>
                  <li><strong>Tiền mãn kinh:</strong> Chu kỳ không đều</li>
                  <li><strong>Mãn kinh:</strong> Ngừng kinh nguyệt</li>
                  <li><strong>Di truyền:</strong> Tiền sử gia đình</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân bệnh lý:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Hội chứng buồng trứng đa nang:</strong> PCOS</li>
                  <li><strong>Bệnh tuyến giáp:</strong> Suy giáp, cường giáp</li>
                  <li><strong>Bệnh tiểu đường:</strong> Type 1, Type 2</li>
                  <li><strong>U tuyến yên:</strong> Prolactinoma</li>
                  <li><strong>U buồng trứng:</strong> U nang, u xơ</li>
                  <li><strong>Bệnh gan:</strong> Xơ gan</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Stress kéo dài</li>
                  <li>Thay đổi cân nặng</li>
                  <li>Tập thể dục quá mức</li>
                  <li>Chế độ ăn không đủ</li>
                  <li>Hút thuốc lá</li>
                  <li>Uống rượu nhiều</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số phụ nữ có nguy cơ cao bị chậm kinh hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Tuổi dậy thì, tiền mãn kinh</li>
                  <li><strong>Tiền sử gia đình:</strong> Di truyền</li>
                  <li><strong>Bệnh mạn tính:</strong> Tiểu đường, tuyến giáp</li>
                  <li><strong>Stress:</strong> Căng thẳng kéo dài</li>
                  <li><strong>Thay đổi cân nặng:</strong> Tăng/giảm cân đột ngột</li>
                  <li><strong>Tập thể dục:</strong> Quá mức</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Không đủ dinh dưỡng</li>
                  <li><strong>Hút thuốc:</strong> Thuốc lá</li>
                  <li><strong>Uống rượu:</strong> Nhiều</li>
                  <li><strong>Thuốc:</strong> Một số loại thuốc</li>
                  <li><strong>Phẫu thuật:</strong> Buồng trứng</li>
                  <li><strong>Xạ trị:</strong> Vùng chậu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Lối sống lành mạnh</li>
                  <li>Chế độ ăn cân bằng</li>
                  <li>Tập thể dục vừa phải</li>
                  <li>Quản lý stress</li>
                  <li>Không hút thuốc</li>
                  <li>Khám sức khỏe định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Chậm kinh</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán chậm kinh dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Chu kỳ kinh, triệu chứng</li>
                  <li><strong>Khám tổng quát:</strong> Cân nặng, huyết áp</li>
                  <li><strong>Khám vú:</strong> Kiểm tra vú</li>
                  <li><strong>Khám bụng:</strong> Khám vùng bụng</li>
                  <li><strong>Khám phụ khoa:</strong> Khám âm đạo</li>
                  <li><strong>Đánh giá:</strong> Đánh giá tổng thể</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Test thai:</strong> Xét nghiệm thai</li>
                  <li><strong>Hormone:</strong> FSH, LH, Estrogen</li>
                  <li><strong>Prolactin:</strong> Hormone prolactin</li>
                  <li><strong>Tuyến giáp:</strong> TSH, T3, T4</li>
                  <li><strong>Công thức máu:</strong> Thiếu máu</li>
                  <li><strong>Siêu âm:</strong> Siêu âm tử cung</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm bổ sung:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>MRI:</strong> Tuyến yên</li>
                  <li><strong>CT:</strong> Vùng chậu</li>
                  <li><strong>Nội soi:</strong> Buồng tử cung</li>
                  <li><strong>Sinh thiết:</strong> Nếu cần</li>
                  <li><strong>Xét nghiệm gen:</strong> Nếu nghi ngờ</li>
                  <li><strong>Đánh giá tâm lý:</strong> Stress</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Chậm kinh</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa chậm kinh tập trung vào việc duy trì lối sống lành mạnh và 
                  quản lý các yếu tố nguy cơ có thể kiểm soát được.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Lối sống lành mạnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chế độ ăn:</strong> Cân bằng dinh dưỡng</li>
                  <li><strong>Tập thể dục:</strong> Vừa phải</li>
                  <li><strong>Ngủ đủ:</strong> 7-8 giờ/đêm</li>
                  <li><strong>Quản lý stress:</strong> Thiền, yoga</li>
                  <li><strong>Không hút thuốc:</strong> Bỏ thuốc lá</li>
                  <li><strong>Hạn chế rượu:</strong> Uống ít</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc sức khỏe:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khám định kỳ:</strong> Khám phụ khoa</li>
                  <li><strong>Theo dõi chu kỳ:</strong> Ghi chép</li>
                  <li><strong>Kiểm soát cân nặng:</strong> Duy trì BMI</li>
                  <li><strong>Điều trị bệnh:</strong> Bệnh mạn tính</li>
                  <li><strong>Tránh thuốc:</strong> Gây rối loạn</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về sức khỏe</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Phòng ngừa đặc biệt:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tránh stress quá mức</li>
                  <li>Không tập thể dục quá mức</li>
                  <li>Chế độ ăn đủ dinh dưỡng</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Hỗ trợ tâm lý</li>
                  <li>Giáo dục sức khỏe sinh sản</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Chậm kinh</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị chậm kinh tùy thuộc vào nguyên nhân gây bệnh. 
                  Điều trị có thể bao gồm thay đổi lối sống, thuốc hoặc phẫu thuật.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị theo nguyên nhân:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mang thai:</strong> Chăm sóc thai kỳ</li>
                  <li><strong>PCOS:</strong> Thuốc điều hòa hormone</li>
                  <li><strong>Suy giáp:</strong> Hormone tuyến giáp</li>
                  <li><strong>Cường giáp:</strong> Thuốc kháng giáp</li>
                  <li><strong>Prolactinoma:</strong> Thuốc giảm prolactin</li>
                  <li><strong>Stress:</strong> Điều trị tâm lý</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Progesterone:</strong> Gây kinh</li>
                  <li><strong>Estrogen:</strong> Điều hòa hormone</li>
                  <li><strong>Thuốc tránh thai:</strong> Điều hòa chu kỳ</li>
                  <li><strong>Metformin:</strong> PCOS</li>
                  <li><strong>Clomiphene:</strong> Kích thích rụng trứng</li>
                  <li><strong>Thuốc giảm stress:</strong> Anxiolytic</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Thay đổi lối sống:</strong> Chế độ ăn, tập thể dục</li>
                  <li><strong>Tâm lý trị liệu:</strong> Điều trị stress</li>
                  <li><strong>Vật lý trị liệu:</strong> Tập thể dục</li>
                  <li><strong>Giáo dục:</strong> Hiểu biết về bệnh</li>
                  <li><strong>Theo dõi:</strong> Khám định kỳ</li>
                  <li><strong>Hỗ trợ:</strong> Gia đình, bạn bè</li>
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
