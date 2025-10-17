import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ClipboardCheck,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function AllergicRhinitisResult() {
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

  // Dữ liệu tỉnh/thành phố và bệnh viện chuyên khoa tai mũi họng
  const provincesAndHospitals = {
    "Hà Nội": [
      { name: "Bệnh viện Bạch Mai", address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội" },
      { name: "Bệnh viện Hữu Nghị Việt Đức", address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội" },
      { name: "Bệnh viện Tai Mũi Họng Trung ương", address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội" },
      { name: "Bệnh viện Đa khoa Xanh Pôn", address: "12 Chu Văn An, Ba Đình, Hà Nội" },
      { name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội" }
    ],
    "TP. Hồ Chí Minh": [
      { name: "Bệnh viện Chợ Rẫy", address: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM" },
      { name: "Bệnh viện Nhân dân 115", address: "527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM" },
      { name: "Bệnh viện Tai Mũi Họng TP.HCM", address: "155B Trần Quốc Thảo, Phường 9, Quận 3, TP.HCM" },
      { name: "Bệnh viện Đa khoa Tâm Anh", address: "108 Hoàng Như Tiếp, Phường Bến Nghé, Quận 1, TP.HCM" },
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
    ]
  };

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const storedData = sessionStorage.getItem('allergicRhinitisAssessment');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAssessmentData(data);
      } catch (error) {
        console.error('Error parsing assessment data:', error);
        setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung");
      }
    } else {
      setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung");
    }
  }, [setLocation]);

  const handleRestart = () => {
    sessionStorage.removeItem('allergicRhinitisAssessment');
    setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung");
  };

  const handleBackToHealthCheck = () => {
    sessionStorage.removeItem('allergicRhinitisAssessment');
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
              onClick={() => setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung")}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Kết quả kiểm tra</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết quả kiểm tra</h1>
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

        {/* Status Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tình trạng</h2>
            {riskAssessment.riskLevel === 'low' ? (
              <p className="text-lg text-gray-700 mb-4">
                Bạn chưa có dấu hiệu rõ ràng cho thấy đang mắc viêm mũi dị ứng. Tuy nhiên, nếu bạn vẫn gặp phải các triệu chứng như chảy mũi trong hoặc vàng xanh, hắt hơi nhiều, nghẹt mũi tái đi tái lại hoặc có yếu tố gia đình bị dị ứng, bạn vẫn nên theo dõi sát và chủ động phòng ngừa.
              </p>
            ) : riskAssessment.riskLevel === 'medium' ? (
              <p className="text-lg text-gray-700 mb-4">
                Bạn có một số dấu hiệu có thể liên quan đến viêm mũi dị ứng. Hãy theo dõi các triệu chứng và đến gặp bác sĩ chuyên khoa tai mũi họng để được chẩn đoán chính xác.
              </p>
            ) : (
              <p className="text-lg text-gray-700 mb-4">
                Bạn có nhiều dấu hiệu cho thấy có thể đang mắc viêm mũi dị ứng. Hãy đến gặp bác sĩ chuyên khoa tai mũi họng ngay để được chẩn đoán và điều trị kịp thời.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lời khuyên dành cho bạn</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Duy trì môi trường sống sạch sẽ, tránh bụi bẩn, nấm mốc
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Theo dõi biểu hiện cơ thể nếu có các triệu chứng như hắt hơi kéo dài, nghẹt mũi hoặc ho khan không rõ nguyên nhân
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Uống đủ nước, ngủ đủ giấc, tránh stress
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Tăng cường sức đề kháng với vitamin, thực phẩm giàu dưỡng chất
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Thăm khám bác sĩ chuyên khoa tai mũi họng hoặc dị ứng – miễn dịch nếu triệu chứng kéo dài
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Allergic Rhinitis Information */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Viêm mũi dị ứng là gì?</h2>
            <p className="text-gray-700 mb-4">
              Viêm mũi dị ứng là một phản ứng viêm của niêm mạc mũi do hệ miễn dịch phản ứng quá mức với các tác nhân như bụi mịn, lông thú, phấn hoa, khí lạnh,... Đây là bệnh mạn tính nhưng có thể kiểm soát tốt bằng thuốc và thay đổi lối sống.
            </p>
            <p className="text-sm text-gray-600">
              Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng và nguy cơ mắc bệnh viêm mũi dị ứng hãy liên hệ với bác sĩ, dược sĩ để được tư vấn chi tiết cụ thể.
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
