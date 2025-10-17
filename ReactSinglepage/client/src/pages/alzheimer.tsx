import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function AlzheimerPage() {
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
    "Bệnh Người Cao Tuổi",
    "Bệnh Nam Giới",
    "Bệnh Nữ Giới",
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
                <BreadcrumbPage>Alzheimer</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">03/07/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bệnh Alzheimer là gì? Nguyên nhân, triệu chứng và cách phòng ngừa
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
                  Bệnh Alzheimer là nguyên nhân hàng đầu gây nên tình trạng sa sút trí tuệ, ảnh hưởng đến suy nghĩ và hành vi của con người. 
                  Không có cách nào để đảo ngược quá trình tiến triển bệnh, nhưng việc phát hiện và điều trị sớm có thể giúp nâng cao chất lượng cuộc sống cho người bệnh.
                </p>

                <h3 className="text-xl font-semibold mb-3">Bệnh Alzheimer là gì?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bệnh Alzheimer là một bệnh thoái hóa thần kinh tiến triển, gây ra sự mất mát không thể phục hồi của các tế bào thần kinh và các kết nối giữa chúng. 
                  Đây là nguyên nhân phổ biến nhất của chứng sa sút trí tuệ ở người cao tuổi.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Alzheimer's Disease</li>
                  <li><strong>Tính chất:</strong> Thoái hóa thần kinh tiến triển</li>
                  <li><strong>Triệu chứng chính:</strong> Suy giảm trí nhớ, nhận thức</li>
                  <li><strong>Tần suất:</strong> Phổ biến ở người cao tuổi</li>
                  <li><strong>Điều trị:</strong> Hỗ trợ, không thể chữa khỏi</li>
                  <li><strong>Phòng ngừa:</strong> Lối sống lành mạnh</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Bệnh Alzheimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của bệnh Alzheimer phát triển từ từ và trở nên nghiêm trọng hơn theo thời gian. 
                  Các triệu chứng có thể khác nhau tùy thuộc vào giai đoạn của bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng sớm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Suy giảm trí nhớ:</strong> Quên những việc vừa xảy ra</li>
                  <li><strong>Khó khăn trong ngôn ngữ:</strong> Khó tìm từ ngữ</li>
                  <li><strong>Thay đổi tâm trạng:</strong> Trầm cảm, lo âu</li>
                  <li><strong>Mất định hướng:</strong> Lạc đường ở nơi quen thuộc</li>
                  <li><strong>Khó khăn trong công việc:</strong> Giảm hiệu suất</li>
                  <li><strong>Thay đổi tính cách:</strong> Cáu gắt, nghi ngờ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng giai đoạn giữa:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Mất trí nhớ nghiêm trọng:</strong> Quên tên người thân</li>
                  <li><strong>Khó khăn trong sinh hoạt:</strong> Cần hỗ trợ</li>
                  <li><strong>Thay đổi hành vi:</strong> Đi lang thang</li>
                  <li><strong>Ảo giác:</strong> Nhìn thấy người không có</li>
                  <li><strong>Hoang tưởng:</strong> Nghi ngờ người khác</li>
                  <li><strong>Rối loạn giấc ngủ:</strong> Mất ngủ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng giai đoạn cuối:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Mất hoàn toàn trí nhớ:</strong> Không nhận ra ai</li>
                  <li><strong>Mất khả năng giao tiếp:</strong> Không nói được</li>
                  <li><strong>Mất khả năng vận động:</strong> Nằm liệt giường</li>
                  <li><strong>Mất khả năng ăn uống:</strong> Cần hỗ trợ</li>
                  <li><strong>Nhiễm trùng:</strong> Viêm phổi, nhiễm trùng</li>
                  <li><strong>Tử vong:</strong> Do biến chứng</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Bệnh Alzheimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nguyên nhân chính xác của bệnh Alzheimer vẫn chưa được hiểu rõ hoàn toàn. 
                  Tuy nhiên, các nhà khoa học đã xác định được một số yếu tố có thể góp phần gây bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Nguyên nhân chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Protein amyloid:</strong> Tích tụ trong não</li>
                  <li><strong>Protein tau:</strong> Tạo thành đám rối</li>
                  <li><strong>Viêm não:</strong> Phản ứng viêm</li>
                  <li><strong>Stress oxy hóa:</strong> Tổn thương tế bào</li>
                  <li><strong>Rối loạn chuyển hóa:</strong> Glucose</li>
                  <li><strong>Thiếu máu não:</strong> Giảm lưu lượng máu</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố di truyền:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Gen APOE4:</strong> Tăng nguy cơ</li>
                  <li><strong>Gen APP:</strong> Protein amyloid</li>
                  <li><strong>Gen PSEN1:</strong> Presenilin 1</li>
                  <li><strong>Gen PSEN2:</strong> Presenilin 2</li>
                  <li><strong>Tiền sử gia đình:</strong> Di truyền</li>
                  <li><strong>Hội chứng Down:</strong> Tăng nguy cơ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố môi trường:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chấn thương đầu</li>
                  <li>Tiếp xúc kim loại nặng</li>
                  <li>Nhiễm virus</li>
                  <li>Stress kéo dài</li>
                  <li>Thiếu ngủ</li>
                  <li>Ô nhiễm không khí</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc bệnh Alzheimer hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trên 65 tuổi</li>
                  <li><strong>Di truyền:</strong> Tiền sử gia đình</li>
                  <li><strong>Gen APOE4:</strong> Có gen này</li>
                  <li><strong>Hội chứng Down:</strong> Trisomy 21</li>
                  <li><strong>Chấn thương đầu:</strong> Nghiêm trọng</li>
                  <li><strong>Bệnh tim mạch:</strong> Đột quỵ</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Giới tính:</strong> Nữ giới</li>
                  <li><strong>Trình độ học vấn:</strong> Thấp</li>
                  <li><strong>Bệnh tiểu đường:</strong> Type 2</li>
                  <li><strong>Tăng huyết áp:</strong> Không kiểm soát</li>
                  <li><strong>Béo phì:</strong> Thừa cân</li>
                  <li><strong>Hút thuốc:</strong> Hút thuốc lá</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Giáo dục cao</li>
                  <li>Hoạt động trí óc</li>
                  <li>Tập thể dục thường xuyên</li>
                  <li>Chế độ ăn lành mạnh</li>
                  <li>Kiểm soát huyết áp</li>
                  <li>Không hút thuốc</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Bệnh Alzheimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán bệnh Alzheimer dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán chính xác rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Triệu chứng, thời gian</li>
                  <li><strong>Khám thần kinh:</strong> Phản xạ, cảm giác</li>
                  <li><strong>Đánh giá nhận thức:</strong> MMSE, MoCA</li>
                  <li><strong>Đánh giá tâm lý:</strong> Trầm cảm, lo âu</li>
                  <li><strong>Khám tổng quát:</strong> Tim mạch, huyết áp</li>
                  <li><strong>Phân biệt:</strong> Loại trừ bệnh khác</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Thiếu máu, nhiễm trùng</li>
                  <li><strong>Chức năng tuyến giáp:</strong> TSH, T3, T4</li>
                  <li><strong>Vitamin B12:</strong> Thiếu vitamin</li>
                  <li><strong>MRI não:</strong> Hình ảnh não</li>
                  <li><strong>PET scan:</strong> Chuyển hóa não</li>
                  <li><strong>Xét nghiệm gen:</strong> APOE4</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sa sút trí tuệ:</strong> Suy giảm nhận thức</li>
                  <li><strong>Khởi phát:</strong> Từ từ, tiến triển</li>
                  <li><strong>Loại trừ:</strong> Bệnh khác</li>
                  <li><strong>Hình ảnh:</strong> Teo não</li>
                  <li><strong>Protein:</strong> Amyloid, tau</li>
                  <li><strong>Gen:</strong> APOE4</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Bệnh Alzheimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mặc dù không có cách nào để ngăn ngừa hoàn toàn bệnh Alzheimer, 
                  nhưng có một số biện pháp có thể giúp giảm nguy cơ mắc bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Lối sống lành mạnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tập thể dục:</strong> Thường xuyên</li>
                  <li><strong>Chế độ ăn:</strong> Mediterranean diet</li>
                  <li><strong>Ngủ đủ:</strong> 7-8 giờ/đêm</li>
                  <li><strong>Quản lý stress:</strong> Thiền, yoga</li>
                  <li><strong>Không hút thuốc:</strong> Bỏ thuốc lá</li>
                  <li><strong>Hạn chế rượu:</strong> Uống ít</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Hoạt động trí óc:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Đọc sách:</strong> Thường xuyên</li>
                  <li><strong>Học tập:</strong> Tiếp tục học</li>
                  <li><strong>Chơi game:</strong> Trò chơi trí tuệ</li>
                  <li><strong>Giao tiếp:</strong> Xã hội</li>
                  <li><strong>Sở thích:</strong> Nuôi dưỡng</li>
                  <li><strong>Làm việc:</strong> Hoạt động trí óc</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Kiểm soát sức khỏe:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kiểm soát huyết áp</li>
                  <li>Kiểm soát đường huyết</li>
                  <li>Kiểm soát cholesterol</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Điều trị bệnh tim mạch</li>
                  <li>Tránh chấn thương đầu</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Bệnh Alzheimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hiện tại không có cách chữa khỏi bệnh Alzheimer, nhưng có các phương pháp điều trị 
                  có thể giúp làm chậm tiến triển bệnh và cải thiện chất lượng cuộc sống.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Thuốc điều trị:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Donepezil:</strong> Ức chế cholinesterase</li>
                  <li><strong>Rivastigmine:</strong> Ức chế cholinesterase</li>
                  <li><strong>Galantamine:</strong> Ức chế cholinesterase</li>
                  <li><strong>Memantine:</strong> Ức chế NMDA</li>
                  <li><strong>Aducanumab:</strong> Kháng thể đơn dòng</li>
                  <li><strong>Lecanemab:</strong> Kháng thể đơn dòng</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vật lý trị liệu:</strong> Duy trì vận động</li>
                  <li><strong>Ngôn ngữ trị liệu:</strong> Cải thiện giao tiếp</li>
                  <li><strong>Hoạt động trị liệu:</strong> Sinh hoạt hàng ngày</li>
                  <li><strong>Tâm lý trị liệu:</strong> Hỗ trợ tâm lý</li>
                  <li><strong>Âm nhạc trị liệu:</strong> Kích thích trí nhớ</li>
                  <li><strong>Nghệ thuật trị liệu:</strong> Sáng tạo</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Chăm sóc tại nhà:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Môi trường an toàn:</strong> Tránh nguy hiểm</li>
                  <li><strong>Lịch trình:</strong> Cố định</li>
                  <li><strong>Giao tiếp:</strong> Đơn giản, rõ ràng</li>
                  <li><strong>Hỗ trợ:</strong> Gia đình, bạn bè</li>
                  <li><strong>Nghỉ ngơi:</strong> Người chăm sóc</li>
                  <li><strong>Hỗ trợ:</strong> Nhóm hỗ trợ</li>
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
