import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function TetanusPage() {
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
    "Bệnh Thần Kinh"
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
                <BreadcrumbPage>Uốn ván</BreadcrumbPage>
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
              <div className="text-sm text-gray-500 mb-2">26/06/2024</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Uốn ván là gì? Những điều cần biết về uốn ván
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
                  Uốn ván là một bệnh nhiễm trùng cấp tính nguy hiểm do vi khuẩn Clostridium tetani gây ra, 
                  thường xuất phát từ những vết thương nhỏ. Bệnh có thể tiến triển nghiêm trọng và gây ra 
                  những hậu quả đe dọa tính mạng nếu không được tiêm phòng.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Uốn ván là một bệnh nhiễm trùng cấp tính nghiêm trọng do độc tố protein mạnh (tetanospasmin) 
                  của vi khuẩn Clostridium tetani gây ra. Vi khuẩn này phát triển trong điều kiện yếm khí tại vết thương. 
                  Độc tố này ảnh hưởng đến toàn bộ cơ thể, gây tổn thương não và hệ thần kinh trung ương, 
                  dẫn đến tình trạng co cứng cơ và có thể gây tử vong nhanh chóng.
                </p>

                <h3 className="text-xl font-semibold mb-3">Đặc điểm của uốn ván:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Tên khoa học:</strong> Tetanus</li>
                  <li><strong>Tính chất:</strong> Nhiễm trùng cấp tính</li>
                  <li><strong>Triệu chứng chính:</strong> Co cứng cơ</li>
                  <li><strong>Tần suất:</strong> Hiếm gặp ở các nước phát triển</li>
                  <li><strong>Điều trị:</strong> Kháng độc tố, kháng sinh</li>
                  <li><strong>Phòng ngừa:</strong> Tiêm vắc-xin</li>
                </ul>
              </div>

              {/* Triệu chứng */}
              <div id="symptoms" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Triệu chứng của Uốn ván</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Triệu chứng của uốn ván thường xuất hiện từ 3-21 ngày sau khi nhiễm trùng. 
                  Các triệu chứng có thể từ nhẹ đến nặng và có thể đe dọa tính mạng.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Triệu chứng sớm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Co cứng cơ:</strong> Cơ hàm, cổ</li>
                  <li><strong>Khó nuốt:</strong> Khó nuốt thức ăn</li>
                  <li><strong>Đau đầu:</strong> Đau đầu dữ dội</li>
                  <li><strong>Sốt:</strong> Sốt cao</li>
                  <li><strong>Đổ mồ hôi:</strong> Đổ mồ hôi nhiều</li>
                  <li><strong>Nhịp tim nhanh:</strong> Tim đập nhanh</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng nặng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Co cứng toàn thân:</strong> Cơ toàn thân</li>
                  <li><strong>Co giật:</strong> Co giật cơ</li>
                  <li><strong>Khó thở:</strong> Khó thở</li>
                  <li><strong>Huyết áp cao:</strong> Tăng huyết áp</li>
                  <li><strong>Rối loạn nhịp tim:</strong> Nhịp tim bất thường</li>
                  <li><strong>Hôn mê:</strong> Mất ý thức</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Triệu chứng đặc trưng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Nụ cười sardonicus:</strong> Nụ cười cưỡng bức</li>
                  <li><strong>Opisthotonus:</strong> Cong lưng</li>
                  <li><strong>Risus sardonicus:</strong> Nụ cười sardonic</li>
                  <li><strong>Trismus:</strong> Co cứng hàm</li>
                  <li><strong>Dysphagia:</strong> Khó nuốt</li>
                  <li><strong>Rigidity:</strong> Cứng cơ</li>
                </ul>
              </div>

              {/* Nguyên nhân */}
              <div id="causes" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Nguyên nhân gây Uốn ván</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Uốn ván do vi khuẩn Clostridium tetani gây ra. Vi khuẩn này có thể xâm nhập vào cơ thể 
                  qua các vết thương và sản xuất độc tố gây bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Vi khuẩn gây bệnh:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Clostridium tetani:</strong> Vi khuẩn chính</li>
                  <li><strong>Tính chất:</strong> Kỵ khí, hình que</li>
                  <li><strong>Độc tố:</strong> Tetanospasmin</li>
                  <li><strong>Môi trường:</strong> Đất, phân</li>
                  <li><strong>Khả năng sống:</strong> Rất bền vững</li>
                  <li><strong>Điều kiện:</strong> Yếm khí</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Đường lây nhiễm:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vết thương:</strong> Vết thương hở</li>
                  <li><strong>Vết cắt:</strong> Vết cắt sâu</li>
                  <li><strong>Vết đâm:</strong> Vết đâm</li>
                  <li><strong>Vết bỏng:</strong> Vết bỏng</li>
                  <li><strong>Vết thương bẩn:</strong> Vết thương bẩn</li>
                  <li><strong>Vết thương hoại tử:</strong> Vết thương hoại tử</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vết thương sâu</li>
                  <li>Vết thương bẩn</li>
                  <li>Vết thương hoại tử</li>
                  <li>Không tiêm phòng</li>
                  <li>Tiêm phòng không đầy đủ</li>
                  <li>Môi trường bẩn</li>
                </ul>
              </div>

              {/* Đối tượng nguy cơ */}
              <div id="risk-factors" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Đối tượng nguy cơ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Một số người có nguy cơ cao mắc uốn ván hơn những người khác. 
                  Hiểu biết về các yếu tố nguy cơ giúp có biện pháp phòng ngừa phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ cao:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Không tiêm phòng:</strong> Chưa tiêm vắc-xin</li>
                  <li><strong>Tiêm phòng không đầy đủ:</strong> Thiếu liều</li>
                  <li><strong>Vết thương sâu:</strong> Vết thương sâu</li>
                  <li><strong>Vết thương bẩn:</strong> Vết thương bẩn</li>
                  <li><strong>Vết thương hoại tử:</strong> Vết thương hoại tử</li>
                  <li><strong>Môi trường bẩn:</strong> Môi trường bẩn</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố nguy cơ trung bình:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tuổi:</strong> Trẻ em, người già</li>
                  <li><strong>Nghề nghiệp:</strong> Nông dân, công nhân</li>
                  <li><strong>Địa lý:</strong> Vùng nông thôn</li>
                  <li><strong>Điều kiện sống:</strong> Điều kiện sống kém</li>
                  <li><strong>Tiếp xúc:</strong> Tiếp xúc với đất</li>
                  <li><strong>Vệ sinh:</strong> Vệ sinh kém</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Yếu tố bảo vệ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Tiêm phòng đầy đủ</li>
                  <li>Tiêm phòng định kỳ</li>
                  <li>Xử lý vết thương đúng cách</li>
                  <li>Vệ sinh tốt</li>
                  <li>Môi trường sạch</li>
                  <li>Giáo dục sức khỏe</li>
                </ul>
              </div>

              {/* Chẩn đoán */}
              <div id="diagnosis" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Chẩn đoán Uốn ván</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chẩn đoán uốn ván dựa trên tiền sử bệnh, khám lâm sàng và các xét nghiệm cần thiết. 
                  Việc chẩn đoán sớm rất quan trọng để có phương pháp điều trị phù hợp.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Khám lâm sàng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Tiền sử:</strong> Vết thương, tiêm phòng</li>
                  <li><strong>Triệu chứng:</strong> Co cứng cơ</li>
                  <li><strong>Khám thần kinh:</strong> Phản xạ, cảm giác</li>
                  <li><strong>Khám cơ:</strong> Co cứng cơ</li>
                  <li><strong>Khám tổng quát:</strong> Tim mạch, hô hấp</li>
                  <li><strong>Đánh giá:</strong> Đánh giá tổng thể</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xét nghiệm cần thiết:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Công thức máu:</strong> Bạch cầu</li>
                  <li><strong>Xét nghiệm độc tố:</strong> Tetanospasmin</li>
                  <li><strong>Cấy vi khuẩn:</strong> Clostridium tetani</li>
                  <li><strong>Xét nghiệm kháng thể:</strong> Kháng thể</li>
                  <li><strong>Xét nghiệm chức năng:</strong> Chức năng cơ</li>
                  <li><strong>Xét nghiệm tim:</strong> ECG</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tiêu chuẩn chẩn đoán:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Triệu chứng:</strong> Co cứng cơ</li>
                  <li><strong>Tiền sử:</strong> Vết thương</li>
                  <li><strong>Xét nghiệm:</strong> Độc tố</li>
                  <li><strong>Loại trừ:</strong> Bệnh khác</li>
                  <li><strong>Đánh giá:</strong> Đánh giá toàn diện</li>
                  <li><strong>Theo dõi:</strong> Theo dõi lâu dài</li>
                </ul>
              </div>

              {/* Phòng ngừa */}
              <div id="prevention" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Phòng ngừa Uốn ván</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Phòng ngừa uốn ván tập trung vào việc tiêm phòng và xử lý vết thương đúng cách. 
                  Đây là cách hiệu quả nhất để ngăn ngừa bệnh.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Tiêm phòng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Vắc-xin DPT:</strong> Bạch hầu, ho gà, uốn ván</li>
                  <li><strong>Vắc-xin Td:</strong> Uốn ván, bạch hầu</li>
                  <li><strong>Lịch tiêm:</strong> 2, 4, 6, 18 tháng</li>
                  <li><strong>Tiêm nhắc:</strong> 4-6 tuổi, 11-12 tuổi</li>
                  <li><strong>Tiêm định kỳ:</strong> Mỗi 10 năm</li>
                  <li><strong>Tiêm sau chấn thương:</strong> Nếu cần</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Xử lý vết thương:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Rửa sạch:</strong> Rửa vết thương</li>
                  <li><strong>Khử trùng:</strong> Khử trùng</li>
                  <li><strong>Băng bó:</strong> Băng bó vết thương</li>
                  <li><strong>Theo dõi:</strong> Theo dõi vết thương</li>
                  <li><strong>Khám bác sĩ:</strong> Khám bác sĩ</li>
                  <li><strong>Tiêm phòng:</strong> Tiêm phòng nếu cần</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Biện pháp khác:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vệ sinh tốt</li>
                  <li>Môi trường sạch</li>
                  <li>Giáo dục sức khỏe</li>
                  <li>Khám sức khỏe định kỳ</li>
                  <li>Tiêm phòng đầy đủ</li>
                  <li>Xử lý vết thương đúng cách</li>
                </ul>
              </div>

              {/* Điều trị */}
              <div id="treatment" className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4">Điều trị Uốn ván</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Điều trị uốn ván tập trung vào việc trung hòa độc tố, điều trị nhiễm trùng và 
                  hỗ trợ các chức năng sống. Điều trị sớm rất quan trọng để giảm tỷ lệ tử vong.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Điều trị chính:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Kháng độc tố:</strong> Tetanus immune globulin</li>
                  <li><strong>Kháng sinh:</strong> Penicillin, metronidazole</li>
                  <li><strong>Giãn cơ:</strong> Diazepam, baclofen</li>
                  <li><strong>An thần:</strong> Midazolam, propofol</li>
                  <li><strong>Hỗ trợ hô hấp:</strong> Thở máy</li>
                  <li><strong>Hỗ trợ tim mạch:</strong> Thuốc tim mạch</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị hỗ trợ:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Dinh dưỡng:</strong> Dinh dưỡng qua sonde</li>
                  <li><strong>Vật lý trị liệu:</strong> Vật lý trị liệu</li>
                  <li><strong>Chăm sóc vết thương:</strong> Chăm sóc vết thương</li>
                  <li><strong>Phòng ngừa:</strong> Phòng ngừa biến chứng</li>
                  <li><strong>Theo dõi:</strong> Theo dõi chặt chẽ</li>
                  <li><strong>Hỗ trợ:</strong> Hỗ trợ gia đình</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Điều trị biến chứng:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Viêm phổi:</strong> Kháng sinh</li>
                  <li><strong>Suy hô hấp:</strong> Thở máy</li>
                  <li><strong>Rối loạn nhịp tim:</strong> Thuốc tim mạch</li>
                  <li><strong>Co giật:</strong> Thuốc chống co giật</li>
                  <li><strong>Nhiễm trùng:</strong> Kháng sinh</li>
                  <li><strong>Biến chứng khác:</strong> Điều trị triệu chứng</li>
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
