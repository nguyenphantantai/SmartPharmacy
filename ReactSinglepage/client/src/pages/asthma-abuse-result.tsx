import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ClipboardCheck,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function AsthmaAbuseResult() {
  const [, setLocation] = useLocation();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [assessmentData, setAssessmentData] = useState<{
    answers: { [key: number]: number };
    riskAssessment: {
      score: number;
      riskLevel: string;
      message: string;
    };
  } | null>(null);

  // Dữ liệu tỉnh/thành phố và bệnh viện chuyên khoa hô hấp
  const provincesAndHospitals = {
    "Hà Nội": [
      { name: "Bệnh viện Bạch Mai", address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội" },
      { name: "Bệnh viện Hữu Nghị Việt Đức", address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội" },
      { name: "Bệnh viện Phổi Trung ương", address: "463 Hoàng Hoa Thám, Ba Đình, Hà Nội" },
      { name: "Bệnh viện Đa khoa Xanh Pôn", address: "12 Chu Văn An, Ba Đình, Hà Nội" },
      { name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội" }
    ],
    "TP. Hồ Chí Minh": [
      { name: "Bệnh viện Chợ Rẫy", address: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM" },
      { name: "Bệnh viện Nhân dân 115", address: "527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM" },
      { name: "Bệnh viện Đa khoa Tâm Anh", address: "108 Hoàng Như Tiếp, Phường Bến Nghé, Quận 1, TP.HCM" },
      { name: "Bệnh viện Phổi TP.HCM", address: "120 Hồng Bàng, Phường 12, Quận 5, TP.HCM" },
      { name: "Bệnh viện Đa khoa Quốc tế Vinmec Central Park", address: "208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM" }
    ],
    "Đà Nẵng": [
      { name: "Bệnh viện Đa khoa Đà Nẵng", address: "124 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng" },
      { name: "Bệnh viện C Đà Nẵng", address: "122 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng" },
      { name: "Bệnh viện Hoàn Mỹ Đà Nẵng", address: "161 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng" }
    ],
    "Cần Thơ": [
      { name: "Bệnh viện Đa khoa Trung ương Cần Thơ", address: "315 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ" },
      { name: "Bệnh viện Đa khoa Hoàn Mỹ Cần Thơ", address: "133 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ" }
    ],
    "Hải Phòng": [
      { name: "Bệnh viện Đa khoa Hải Phòng", address: "14 Nguyễn Đức Cảnh, Lê Lợi, Ngô Quyền, Hải Phòng" },
      { name: "Bệnh viện Việt Tiệp", address: "1 Nhà Thương, Lê Lợi, Ngô Quyền, Hải Phòng" }
    ],
    "Thái Nguyên": [
      { name: "Bệnh viện A Thái Nguyên", address: "Đường Quang Trung, Phường Thịnh Đán, TP. Thái Nguyên" },
      { name: "Bệnh viện Đa khoa Thái Nguyên", address: "479 Lương Ngọc Quyến, TP. Thái Nguyên" }
    ],
    "Nghệ An": [
      { name: "Bệnh viện Đa khoa 115", address: "Xóm 10 Xã Nghĩ Phú, TP. Vinh, Nghệ An" },
      { name: "Bệnh viện Đa khoa Nghệ An", address: "19 Tôn Thất Tùng, TP. Vinh, Nghệ An" }
    ],
    "Thanh Hóa": [
      { name: "Bệnh viện Đa khoa Thanh Hóa", address: "143 Trần Phú, TP. Thanh Hóa" },
      { name: "Bệnh viện Đa khoa Hoàng Anh Gia Lai", address: "Đường Lê Lợi, TP. Thanh Hóa" }
    ],
    "Quảng Ninh": [
      { name: "Bệnh viện Đa khoa Quảng Ninh", address: "Đường Hạ Long, TP. Hạ Long, Quảng Ninh" },
      { name: "Bệnh viện Đa khoa Cẩm Phả", address: "Phường Cẩm Thành, TP. Cẩm Phả, Quảng Ninh" }
    ],
    "Bình Dương": [
      { name: "Bệnh viện Đa khoa Bình Dương", address: "Đường 30/4, TP. Thủ Dầu Một, Bình Dương" },
      { name: "Bệnh viện Đa khoa Becamex", address: "Đường Bình Dương, TP. Thủ Dầu Một, Bình Dương" }
    ],
    "Vĩnh Phúc": [
      { name: "Bệnh viện 74 Trung ương", address: "Phường Hưng Vương, Thị xã Phúc Yên, Vĩnh Phúc" }
    ],
    "Bạc Liêu": [
      { name: "Bệnh viện Đa khoa Bạc Liêu", address: "6 Nguyên Huệ, P. 3, TP. Bạc Liêu" }
    ],
    "Cà Mau": [
      { name: "Bệnh viện Đa khoa Cái Nước", address: "Thị trấn Cái Nước, H. Cái Nước, Cà Mau" },
      { name: "Bệnh viện Đa khoa Cà Mau", address: "16 Hải Thượng Lãn Ông, Phường 6, TP. Cà Mau" }
    ],
    "Hà Tĩnh": [
      { name: "Bệnh viện Đa khoa Hương Sơn", address: "Tổ dân phố 2, Thị trấn Phố Châu, H. Hương Sơn, Hà Tĩnh" },
      { name: "Bệnh viện Đa khoa Hà Tĩnh", address: "75 Hải Thượng Lãn Ông, TX. Hà Tĩnh" },
      { name: "Bệnh viện Đa khoa Huyện Cẩm Xuyên", address: "Tổ 10, Thị trấn Cẩm Xuyên, H. Cẩm Xuyên, Hà Tĩnh" }
    ],
    "Bà Rịa - Vũng Tàu": [
      { name: "Bệnh viện Đa khoa Bà Rịa", address: "686 Võ Văn Kiệt, P. Long Tâm, TX. Bà Rịa" }
    ]
  };

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage hoặc localStorage
    const storedData = sessionStorage.getItem('asthmaAbuseAssessment');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAssessmentData(data);
      } catch (error) {
        console.error('Error parsing assessment data:', error);
        // Nếu không có dữ liệu hợp lệ, chuyển về trang đánh giá
        setLocation("/danh-gia-nguy-co-lam-dung-thuoc-cat-con-hen");
      }
    } else {
      // Nếu không có dữ liệu, chuyển về trang đánh giá
      setLocation("/danh-gia-nguy-co-lam-dung-thuoc-cat-con-hen");
    }
  }, [setLocation]);

  const handleRestart = () => {
    // Xóa dữ liệu đã lưu
    sessionStorage.removeItem('asthmaAbuseAssessment');
    setLocation("/danh-gia-nguy-co-lam-dung-thuoc-cat-con-hen");
  };

  const handleBackToHealthCheck = () => {
    // Xóa dữ liệu đã lưu
    sessionStorage.removeItem('asthmaAbuseAssessment');
    setLocation("/kiem-tra-suc-khoe");
  };

  if (!assessmentData) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  const { riskAssessment } = assessmentData;

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <button 
              onClick={() => setLocation("/")}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Trang chủ
            </button>
            <span className="mx-2">›</span>
            <button 
              onClick={() => setLocation("/kiem-tra-suc-khoe")}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Kiểm tra sức khỏe
            </button>
            <span className="mx-2">›</span>
            <button 
              onClick={() => setLocation("/danh-gia-nguy-co-lam-dung-thuoc-cat-con-hen")}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Đánh giá nguy cơ lạm dụng thuốc cắt cơn hen
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Kết quả đánh giá</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết quả đánh giá</h1>
          <div className={`text-4xl font-bold mb-6 ${
            riskAssessment.riskLevel === 'high' ? 'text-red-600' : 
            riskAssessment.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {riskAssessment.message}
          </div>
          
          {/* Doctor Illustration */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-blue-100 rounded-full">
              <ClipboardCheck className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Khuyến nghị</h2>
            <p className="text-lg text-gray-700 mb-4">
              Bạn cần đến gặp bác sĩ chuyên khoa hô hấp để được kiểm tra sớm.
            </p>
            <p className="text-gray-700 mb-4">
              Một số việc làm sau sẽ giúp bạn kiểm soát hen và duy trì sức khỏe tốt:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Luôn tuân thủ sử dụng thuốc duy trì, không tự ý mua và chỉ sử dụng thuốc cắt cơn khi cần theo chỉ định của bác sĩ.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Hãy gặp bác sĩ nếu gần đây bạn phải hít thuốc cắt cơn ≥ 2 lần/tuần.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Nhận biết các dấu hiệu khi lên cơn hen như ho, khó thở, khò khè, nặng ngực.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Gọi bác sĩ hoặc đi cấp cứu ngay nếu thuốc cắt cơn không giúp khống chế được cơn hen: nói không nổi, mệt lả, không đi được, môi và móng tay chân tím tái, cánh mũi phập phồng khi thở, vùng cổ, khe giữa xương sườn bị rút lõm khi thở.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Luôn mang theo thẻ ghi chú các dị ứng nguyên như thuốc, thức ăn, vi sinh vật,...
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Tiêm ngừa vắc xin phòng cúm, phế cầu,...
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Thực hiện các bài tập thở mỗi ngày.
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng và nguy cơ phụ thuộc thuốc cắt cơn hen hãy liên hệ với bác sĩ, dược sĩ để được tư vấn chi tiết cụ thể.
            </p>
          </CardContent>
        </Card>

        {/* Hospital List Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Gợi ý bệnh viện khám bệnh</h2>
              <select 
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Thành Phố/Tỉnh</option>
                {Object.keys(provincesAndHospitals).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedProvince ? provincesAndHospitals[selectedProvince as keyof typeof provincesAndHospitals] : 
                Object.values(provincesAndHospitals).flat()).map((hospital, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{hospital.address}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Xem bản đồ
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <Button
            onClick={handleRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 mr-4"
          >
            Làm lại đánh giá
          </Button>
          <Button
            onClick={handleBackToHealthCheck}
            variant="outline"
            className="px-8 py-3"
          >
            Quay lại trang chủ
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
