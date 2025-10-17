import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function MusculoskeletalPainPage() {
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
    "Bệnh Cơ Xương Khớp",
    "Bệnh Người Cao Tuổi",
    "Tứ chi"
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
                <BreadcrumbPage>Đau cơ xương khớp</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">28/05/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Đau cơ xương khớp là gì? Những điều cần biết về bệnh
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
                  Đau cơ xương khớp là tình trạng đau nhức ảnh hưởng đến cơ bắp, xương và khớp, 
                  gây ra cảm giác khó chịu và ảnh hưởng đến chất lượng cuộc sống. Tình trạng này 
                  có thể xảy ra ở mọi lứa tuổi nhưng đặc biệt phổ biến ở người trung niên và 
                  những người thường xuyên lao động nặng nhọc.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Hãy cùng Pharmacity tìm hiểu về bệnh đau cơ xương khớp, cách điều trị và 
                  phòng ngừa qua bài viết dưới đây.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của đau cơ xương khớp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tính chất:</strong> Đau nhức, mỏi mệt</li>
                  <li><strong>Vị trí:</strong> Cổ, vai gáy, lưng, gót chân, khớp</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở người trung niên</li>
                  <li><strong>Nguyên nhân:</strong> Lao động nặng, tuổi tác</li>
                  <li><strong>Điều trị:</strong> Điều trị triệu chứng</li>
                  <li><strong>Phòng ngừa:</strong> Tập thể dục, nghỉ ngơi</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Những triệu chứng cho biết bạn đang mắc bệnh đau cơ xương khớp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Đau cơ xương khớp có thể xuất hiện ở nhiều bộ phận khác nhau của cơ thể như cổ, 
                  vai gáy, lưng dưới, gót chân và các khớp khác.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đau nhức:</strong> Xuất hiện cảm giác đau nhức và mỏi</li>
                  <li><strong>Cứng khớp:</strong> Cứng khớp, khó cử động</li>
                  <li><strong>Sưng đỏ:</strong> Sưng đỏ tại vùng bị đau</li>
                  <li><strong>Nóng ran:</strong> Nóng ran ở các khớp xương</li>
                  <li><strong>Âm thanh:</strong> Khớp phát ra âm thanh khi di chuyển</li>
                  <li><strong>Hạn chế vận động:</strong> Khó khăn trong cử động</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng theo vị trí:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Cổ vai gáy:</strong> Đau cổ, vai, gáy</li>
                  <li><strong>Lưng:</strong> Đau lưng dưới</li>
                  <li><strong>Khớp gối:</strong> Đau khớp gối</li>
                  <li><strong>Khớp háng:</strong> Đau khớp háng</li>
                  <li><strong>Gót chân:</strong> Đau gót chân</li>
                  <li><strong>Cổ tay:</strong> Đau cổ tay</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Mệt mỏi:</strong> Mệt mỏi toàn thân</li>
                  <li><strong>Khó ngủ:</strong> Khó ngủ do đau</li>
                  <li><strong>Stress:</strong> Stress, lo âu</li>
                  <li><strong>Giảm chất lượng:</strong> Giảm chất lượng cuộc sống</li>
                  <li><strong>Hạn chế:</strong> Hạn chế hoạt động</li>
                  <li><strong>Trầm cảm:</strong> Trầm cảm nhẹ</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Đau cơ xương khớp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Đau cơ xương khớp có nhiều nguyên nhân khác nhau, từ các yếu tố cơ học đến 
                  các bệnh lý tiềm ẩn. Hiểu biết về nguyên nhân giúp có biện pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân cơ học:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Lao động:</strong> Lao động nặng nhọc</li>
                  <li><strong>Tư thế:</strong> Tư thế sai</li>
                  <li><strong>Chấn thương:</strong> Chấn thương</li>
                  <li><strong>Lạm dụng:</strong> Lạm dụng khớp</li>
                  <li><strong>Thiếu vận động:</strong> Thiếu vận động</li>
                  <li><strong>Thừa cân:</strong> Thừa cân, béo phì</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Nguyên nhân bệnh lý:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Viêm khớp:</strong> Viêm khớp dạng thấp</li>
                  <li><strong>Thoái hóa:</strong> Thoái hóa khớp</li>
                  <li><strong>Loãng xương:</strong> Loãng xương</li>
                  <li><strong>Viêm cơ:</strong> Viêm cơ</li>
                  <li><strong>Viêm gân:</strong> Viêm gân</li>
                  <li><strong>Bệnh tự miễn:</strong> Bệnh tự miễn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố thuận lợi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tuổi tác</li>
                  <li>Giới tính</li>
                  <li>Di truyền</li>
                  <li>Môi trường</li>
                  <li>Stress</li>
                  <li>Dinh dưỡng</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc đau cơ xương khớp hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Người trung niên, cao tuổi</li>
                  <li><strong>Giới tính:</strong> Nữ giới</li>
                  <li><strong>Nghề nghiệp:</strong> Lao động nặng</li>
                  <li><strong>Thừa cân:</strong> Thừa cân, béo phì</li>
                  <li><strong>Di truyền:</strong> Gia đình có tiền sử</li>
                  <li><strong>Chấn thương:</strong> Chấn thương trước đó</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thể thao:</strong> Vận động viên</li>
                  <li><strong>Tư thế:</strong> Tư thế làm việc sai</li>
                  <li><strong>Stress:</strong> Stress tâm lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng kém</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc</li>
                  <li><strong>Rượu bia:</strong> Uống rượu bia</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tập thể dục thường xuyên</li>
                  <li>Duy trì cân nặng hợp lý</li>
                  <li>Tư thế đúng</li>
                  <li>Nghỉ ngơi đầy đủ</li>
                  <li>Dinh dưỡng tốt</li>
                  <li>Giảm stress</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Đau cơ xương khớp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán đau cơ xương khớp dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Tiền sử bệnh</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng hiện tại</li>
                  <li><strong>Khám khớp:</strong> Khám khớp</li>
                  <li><strong>Khám cơ:</strong> Khám cơ</li>
                  <li><strong>Khám xương:</strong> Khám xương</li>
                  <li><strong>Đánh giá:</strong> Đánh giá mức độ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>X-quang:</strong> Chụp X-quang</li>
                  <li><strong>MRI:</strong> Chụp cộng hưởng từ</li>
                  <li><strong>CT:</strong> Chụp cắt lớp</li>
                  <li><strong>Siêu âm:</strong> Siêu âm khớp</li>
                  <li><strong>Xét nghiệm máu:</strong> Xét nghiệm máu</li>
                  <li><strong>Sinh thiết:</strong> Sinh thiết</li>
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
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Đau cơ xương khớp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa đau cơ xương khớp tập trung vào việc duy trì lối sống lành mạnh và 
                  tránh các yếu tố nguy cơ. Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tập thể dục:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thường xuyên:</strong> Tập thể dục thường xuyên</li>
                  <li><strong>Phù hợp:</strong> Bài tập phù hợp</li>
                  <li><strong>Khởi động:</strong> Khởi động trước khi tập</li>
                  <li><strong>Giãn cơ:</strong> Giãn cơ sau khi tập</li>
                  <li><strong>Đi bộ:</strong> Đi bộ hàng ngày</li>
                  <li><strong>Bơi lội:</strong> Bơi lội</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tư thế và lối sống:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tư thế:</strong> Duy trì tư thế đúng</li>
                  <li><strong>Nghỉ ngơi:</strong> Nghỉ ngơi đầy đủ</li>
                  <li><strong>Cân nặng:</strong> Duy trì cân nặng hợp lý</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng tốt</li>
                  <li><strong>Stress:</strong> Giảm stress</li>
                  <li><strong>Ngủ:</strong> Ngủ đủ giấc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tránh lao động quá sức</li>
                  <li>Sử dụng dụng cụ hỗ trợ</li>
                  <li>Massage thường xuyên</li>
                  <li>Vật lý trị liệu</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Đau cơ xương khớp</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị đau cơ xương khớp bao gồm điều trị triệu chứng và điều trị căn nguyên. 
                  Mục tiêu là giảm đau, cải thiện chức năng và ngăn ngừa tái phát.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị triệu chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Thuốc giảm đau:</strong> Paracetamol, ibuprofen</li>
                  <li><strong>Thuốc kháng viêm:</strong> NSAIDs</li>
                  <li><strong>Thuốc giãn cơ:</strong> Thuốc giãn cơ</li>
                  <li><strong>Thuốc bôi:</strong> Thuốc bôi ngoài da</li>
                  <li><strong>Tiêm:</strong> Tiêm corticosteroid</li>
                  <li><strong>Thuốc khác:</strong> Thuốc hỗ trợ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị không dùng thuốc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vật lý trị liệu:</strong> Vật lý trị liệu</li>
                  <li><strong>Massage:</strong> Massage</li>
                  <li><strong>Chườm nóng:</strong> Chườm nóng</li>
                  <li><strong>Chườm lạnh:</strong> Chườm lạnh</li>
                  <li><strong>Kéo giãn:</strong> Kéo giãn</li>
                  <li><strong>Tập luyện:</strong> Tập luyện</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị phẫu thuật:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nội soi:</strong> Phẫu thuật nội soi</li>
                  <li><strong>Thay khớp:</strong> Thay khớp</li>
                  <li><strong>Sửa chữa:</strong> Sửa chữa khớp</li>
                  <li><strong>Ghép:</strong> Ghép xương</li>
                  <li><strong>Cắt bỏ:</strong> Cắt bỏ phần bị tổn thương</li>
                  <li><strong>Hỗ trợ:</strong> Hỗ trợ sau phẫu thuật</li>
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
