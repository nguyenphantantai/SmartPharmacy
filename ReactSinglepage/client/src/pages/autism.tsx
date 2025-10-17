import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AutismPage() {
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
    "Bệnh Thần Kinh",
    "Đối tượng",
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
                <BreadcrumbPage>Tự kỷ</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">16/07/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tự kỷ: nguyên nhân, triệu chứng, cách điều trị
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
                  Tự kỷ là một rối loạn phát triển thần kinh phức tạp, ảnh hưởng đến cách một người giao tiếp, 
                  tương tác xã hội và xử lý thông tin. Bài viết này sẽ cung cấp cái nhìn toàn diện về rối loạn phổ tự kỷ, 
                  bao gồm định nghĩa, nguyên nhân, dấu hiệu và các phương pháp can thiệp hiệu quả để hỗ trợ tốt hơn 
                  cho những người thân yêu bị ảnh hưởng.
                </p>

                <h3 className="text-xl font-semibold mb-3">Tự kỷ là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tự kỷ (Autism Spectrum Disorder - ASD) là một rối loạn phát triển thần kinh xuất hiện từ sớm, 
                  thường được phát hiện trong 3 năm đầu đời. Đây là một tình trạng suốt đời ảnh hưởng đến cách 
                  một người giao tiếp, tương tác xã hội và xử lý thông tin từ môi trường xung quanh.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của tự kỷ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Autism Spectrum Disorder (ASD)</li>
                  <li><strong>Tính chất:</strong> Rối loạn phát triển thần kinh</li>
                  <li><strong>Triệu chứng chính:</strong> Khó khăn giao tiếp, tương tác xã hội</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở trẻ em</li>
                  <li><strong>Điều trị:</strong> Can thiệp sớm, hỗ trợ</li>
                  <li><strong>Phòng ngừa:</strong> Chưa có cách phòng ngừa</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Tự kỷ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của tự kỷ rất đa dạng và có thể khác nhau ở mỗi người. 
                  Các triệu chứng thường xuất hiện từ sớm và có thể được chia thành các nhóm chính.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng giao tiếp:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chậm nói:</strong> Không nói được từ đầu tiên</li>
                  <li><strong>Lặp lại:</strong> Lặp lại từ hoặc cụm từ</li>
                  <li><strong>Khó hiểu:</strong> Khó hiểu ngôn ngữ</li>
                  <li><strong>Không giao tiếp:</strong> Không giao tiếp bằng mắt</li>
                  <li><strong>Ngôn ngữ cơ thể:</strong> Khó hiểu cử chỉ</li>
                  <li><strong>Giọng điệu:</strong> Giọng điệu đơn điệu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng tương tác xã hội:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khó kết bạn:</strong> Khó kết bạn</li>
                  <li><strong>Không chia sẻ:</strong> Không chia sẻ cảm xúc</li>
                  <li><strong>Khó hiểu:</strong> Khó hiểu cảm xúc người khác</li>
                  <li><strong>Không chơi:</strong> Không chơi với trẻ khác</li>
                  <li><strong>Khó hiểu:</strong> Khó hiểu quy tắc xã hội</li>
                  <li><strong>Không thích:</strong> Không thích tiếp xúc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng hành vi:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Hành vi lặp lại:</strong> Lặp lại hành vi</li>
                  <li><strong>Sở thích hẹp:</strong> Sở thích hẹp</li>
                  <li><strong>Khó thay đổi:</strong> Khó thay đổi thói quen</li>
                  <li><strong>Phản ứng:</strong> Phản ứng quá mức</li>
                  <li><strong>Vận động:</strong> Vận động lặp lại</li>
                  <li><strong>Khó thích nghi:</strong> Khó thích nghi</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Tự kỷ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nguyên nhân chính xác của tự kỷ vẫn chưa được hiểu rõ hoàn toàn. 
                  Tuy nhiên, các nghiên cứu cho thấy có sự kết hợp của nhiều yếu tố.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố di truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Gen:</strong> Đột biến gen</li>
                  <li><strong>Tiền sử gia đình:</strong> Có người tự kỷ</li>
                  <li><strong>Nhiễm sắc thể:</strong> Bất thường nhiễm sắc thể</li>
                  <li><strong>Di truyền:</strong> Di truyền từ cha mẹ</li>
                  <li><strong>Đột biến:</strong> Đột biến mới</li>
                  <li><strong>Gen liên quan:</strong> Gen liên quan đến não</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi cha mẹ:</strong> Tuổi cha mẹ cao</li>
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng khi mang thai</li>
                  <li><strong>Thuốc:</strong> Thuốc khi mang thai</li>
                  <li><strong>Hóa chất:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Ô nhiễm:</strong> Ô nhiễm không khí</li>
                  <li><strong>Stress:</strong> Stress khi mang thai</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố sinh học:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Hormone:</strong> Mất cân bằng hormone</li>
                  <li><strong>Chuyển hóa:</strong> Rối loạn chuyển hóa</li>
                  <li><strong>Miễn dịch:</strong> Rối loạn miễn dịch</li>
                  <li><strong>Viêm:</strong> Viêm não</li>
                  <li><strong>Oxy hóa:</strong> Stress oxy hóa</li>
                  <li><strong>Vi khuẩn:</strong> Vi khuẩn đường ruột</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số yếu tố có thể làm tăng nguy cơ mắc tự kỷ. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp can thiệp sớm.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giới tính:</strong> Nam giới</li>
                  <li><strong>Tiền sử gia đình:</strong> Có người tự kỷ</li>
                  <li><strong>Tuổi cha mẹ:</strong> Tuổi cha mẹ cao</li>
                  <li><strong>Sinh non:</strong> Sinh non</li>
                  <li><strong>Cân nặng:</strong> Cân nặng khi sinh thấp</li>
                  <li><strong>Đa thai:</strong> Đa thai</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Nhiễm trùng:</strong> Nhiễm trùng khi mang thai</li>
                  <li><strong>Thuốc:</strong> Thuốc khi mang thai</li>
                  <li><strong>Hóa chất:</strong> Tiếp xúc hóa chất</li>
                  <li><strong>Ô nhiễm:</strong> Ô nhiễm không khí</li>
                  <li><strong>Stress:</strong> Stress khi mang thai</li>
                  <li><strong>Dinh dưỡng:</strong> Thiếu dinh dưỡng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chăm sóc thai kỳ tốt</li>
                  <li>Dinh dưỡng đầy đủ</li>
                  <li>Tránh stress</li>
                  <li>Không hút thuốc</li>
                  <li>Không uống rượu</li>
                  <li>Khám thai định kỳ</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Tự kỷ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán tự kỷ dựa trên quan sát hành vi và đánh giá phát triển. 
                  Việc chẩn đoán sớm rất quan trọng để có can thiệp hiệu quả.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Đánh giá phát triển:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Quan sát:</strong> Quan sát hành vi</li>
                  <li><strong>Phỏng vấn:</strong> Phỏng vấn cha mẹ</li>
                  <li><strong>Đánh giá:</strong> Đánh giá phát triển</li>
                  <li><strong>Test:</strong> Test tâm lý</li>
                  <li><strong>Khám:</strong> Khám thần kinh</li>
                  <li><strong>Đánh giá:</strong> Đánh giá tổng thể</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Công cụ đánh giá:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>ADOS:</strong> Autism Diagnostic Observation Schedule</li>
                  <li><strong>ADI-R:</strong> Autism Diagnostic Interview-Revised</li>
                  <li><strong>CARS:</strong> Childhood Autism Rating Scale</li>
                  <li><strong>M-CHAT:</strong> Modified Checklist for Autism</li>
                  <li><strong>SCQ:</strong> Social Communication Questionnaire</li>
                  <li><strong>ASQ:</strong> Ages and Stages Questionnaire</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>DSM-5:</strong> Tiêu chuẩn chẩn đoán</li>
                  <li><strong>Triệu chứng:</strong> Triệu chứng từ sớm</li>
                  <li><strong>Ảnh hưởng:</strong> Ảnh hưởng chức năng</li>
                  <li><strong>Loại trừ:</strong> Loại trừ bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Tự kỷ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại chưa có cách phòng ngừa tự kỷ hoàn toàn, nhưng có một số biện pháp 
                  có thể giúp giảm nguy cơ và hỗ trợ phát triển tốt nhất.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Chăm sóc thai kỳ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Khám thai:</strong> Khám thai định kỳ</li>
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng đầy đủ</li>
                  <li><strong>Tránh stress:</strong> Tránh stress</li>
                  <li><strong>Không hút thuốc:</strong> Không hút thuốc</li>
                  <li><strong>Không uống rượu:</strong> Không uống rượu</li>
                  <li><strong>Tránh thuốc:</strong> Tránh thuốc không cần thiết</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc trẻ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Chăm sóc sớm:</strong> Chăm sóc sớm</li>
                  <li><strong>Kích thích:</strong> Kích thích phát triển</li>
                  <li><strong>Giao tiếp:</strong> Giao tiếp tích cực</li>
                  <li><strong>Chơi:</strong> Chơi với trẻ</li>
                  <li><strong>Đọc sách:</strong> Đọc sách cho trẻ</li>
                  <li><strong>Âm nhạc:</strong> Âm nhạc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Theo dõi phát triển:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Theo dõi các mốc phát triển</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Đánh giá phát triển</li>
                  <li>Can thiệp sớm nếu cần</li>
                  <li>Hỗ trợ gia đình</li>
                  <li>Giáo dục cha mẹ</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Tự kỷ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị tự kỷ tập trung vào can thiệp sớm và hỗ trợ phát triển. 
                  Không có cách chữa khỏi tự kỷ, nhưng can thiệp sớm có thể cải thiện đáng kể chất lượng cuộc sống.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Can thiệp sớm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>ABA:</strong> Applied Behavior Analysis</li>
                  <li><strong>TEACCH:</strong> Treatment and Education</li>
                  <li><strong>Floortime:</strong> Developmental Individual</li>
                  <li><strong>PECS:</strong> Picture Exchange Communication</li>
                  <li><strong>RDI:</strong> Relationship Development</li>
                  <li><strong>SCERTS:</strong> Social Communication</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Liệu pháp hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Ngôn ngữ:</strong> Liệu pháp ngôn ngữ</li>
                  <li><strong>Vận động:</strong> Liệu pháp vận động</li>
                  <li><strong>Âm nhạc:</strong> Liệu pháp âm nhạc</li>
                  <li><strong>Nghệ thuật:</strong> Liệu pháp nghệ thuật</li>
                  <li><strong>Động vật:</strong> Liệu pháp động vật</li>
                  <li><strong>Thể thao:</strong> Thể thao</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Hỗ trợ gia đình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Giáo dục:</strong> Giáo dục cha mẹ</li>
                  <li><strong>Hỗ trợ:</strong> Hỗ trợ tâm lý</li>
                  <li><strong>Nhóm:</strong> Nhóm hỗ trợ</li>
                  <li><strong>Tài nguyên:</strong> Tài nguyên</li>
                  <li><strong>Dịch vụ:</strong> Dịch vụ hỗ trợ</li>
                  <li><strong>Kết nối:</strong> Kết nối cộng đồng</li>
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
