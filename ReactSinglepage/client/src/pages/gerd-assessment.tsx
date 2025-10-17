import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EvidenceDisplay from "@/components/evidence-display";
import { 
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { assessmentEvidenceData } from "@/data/assessment-evidence";

export default function GerdAssessment() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Trong 7 ngày qua, bạn buồn nôn trong bao nhiêu ngày?",
    },
    {
      id: 2,
      question: "Trong 7 ngày qua, bạn bị đau phần giữa bụng trong bao nhiêu ngày?",
    },
    {
      id: 3,
      question: "Trong 7 ngày qua, bạn có cảm giác nóng rát sau xương ức (ợ nóng) trong bao nhiêu ngày?",
    },
    {
      id: 4,
      question: "Trong 7 ngày qua, bạn bị ợ nước chua hay thức ăn từ dạ dày lên cổ họng/miệng (trào ngược) trong bao nhiêu ngày?",
    },
    {
      id: 5,
      question: "Trong 7 ngày qua, bạn bị khó ngủ về đêm do chứng ợ nóng và/hoặc trào ngược trong bao nhiêu ngày?",
    },
    {
      id: 6,
      question: "Trong 7 ngày qua, bạn dùng thêm thuốc điều trị chứng ợ nóng và/hoặc trào ngược ngoài những thuốc mà bác sĩ kê trong toa bao nhiêu ngày?",
    }
  ];

  // Dữ liệu tỉnh/thành phố và bệnh viện chuyên khoa tiêu hóa
  const provincesAndHospitals = {
    "Hà Nội": [
      { name: "Bệnh viện Bạch Mai - Khoa Tiêu hóa", address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội" },
      { name: "Bệnh viện Hữu Nghị Việt Đức - Khoa Tiêu hóa", address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội" },
      { name: "Bệnh viện Đa khoa Xanh Pôn - Khoa Tiêu hóa", address: "12 Chu Văn An, Ba Đình, Hà Nội" },
      { name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội" }
    ],
    "TP. Hồ Chí Minh": [
      { name: "Bệnh viện Chợ Rẫy - Khoa Tiêu hóa", address: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM" },
      { name: "Bệnh viện Nhân dân 115 - Khoa Tiêu hóa", address: "527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM" },
      { name: "Bệnh viện Đa khoa Tâm Anh - Khoa Tiêu hóa", address: "108 Hoàng Như Tiếp, Phường Bến Nghé, Quận 1, TP.HCM" },
      { name: "Bệnh viện Đa khoa Quốc tế Vinmec Central Park", address: "208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP.HCM" }
    ],
    "Đà Nẵng": [
      { name: "Bệnh viện Đa khoa Đà Nẵng - Khoa Tiêu hóa", address: "124 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng" },
      { name: "Bệnh viện C Đà Nẵng - Khoa Tiêu hóa", address: "122 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng" },
      { name: "Bệnh viện Hoàn Mỹ Đà Nẵng - Khoa Tiêu hóa", address: "161 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng" }
    ],
    "Cần Thơ": [
      { name: "Bệnh viện Đa khoa Trung ương Cần Thơ - Khoa Tiêu hóa", address: "315 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ" },
      { name: "Bệnh viện Đa khoa Hoàn Mỹ Cần Thơ - Khoa Tiêu hóa", address: "133 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ" }
    ],
    "Hải Phòng": [
      { name: "Bệnh viện Đa khoa Hải Phòng - Khoa Tiêu hóa", address: "14 Nguyễn Đức Cảnh, Lê Lợi, Ngô Quyền, Hải Phòng" },
      { name: "Bệnh viện Việt Tiệp - Khoa Tiêu hóa", address: "1 Nhà Thương, Lê Lợi, Ngô Quyền, Hải Phòng" }
    ],
    "Thái Nguyên": [
      { name: "Bệnh viện A Thái Nguyên - Khoa Tiêu hóa", address: "Đường Quang Trung, Phường Thịnh Đán, TP. Thái Nguyên" },
      { name: "Bệnh viện Đa khoa Thái Nguyên - Khoa Tiêu hóa", address: "479 Lương Ngọc Quyến, TP. Thái Nguyên" }
    ],
    "Nghệ An": [
      { name: "Bệnh viện Đa khoa 115 - Khoa Tiêu hóa", address: "Xóm 10 Xã Nghĩ Phú, TP. Vinh, Nghệ An" },
      { name: "Bệnh viện Đa khoa Nghệ An - Khoa Tiêu hóa", address: "19 Tôn Thất Tùng, TP. Vinh, Nghệ An" }
    ],
    "Thanh Hóa": [
      { name: "Bệnh viện Đa khoa Thanh Hóa - Khoa Tiêu hóa", address: "143 Trần Phú, TP. Thanh Hóa" },
      { name: "Bệnh viện Đa khoa Hoàng Anh Gia Lai - Khoa Tiêu hóa", address: "Đường Lê Lợi, TP. Thanh Hóa" }
    ],
    "Quảng Ninh": [
      { name: "Bệnh viện Đa khoa Quảng Ninh - Khoa Tiêu hóa", address: "Đường Hạ Long, TP. Hạ Long, Quảng Ninh" },
      { name: "Bệnh viện Đa khoa Cẩm Phả - Khoa Tiêu hóa", address: "Phường Cẩm Thành, TP. Cẩm Phả, Quảng Ninh" }
    ],
    "Bình Dương": [
      { name: "Bệnh viện Đa khoa Bình Dương - Khoa Tiêu hóa", address: "Đường 30/4, TP. Thủ Dầu Một, Bình Dương" },
      { name: "Bệnh viện Đa khoa Becamex - Khoa Tiêu hóa", address: "Đường Bình Dương, TP. Thủ Dầu Một, Bình Dương" }
    ]
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete assessment
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    setShowResults(true);
  };

  const handleCancel = () => {
    setLocation("/kiem-tra-suc-khoe");
  };

  const handleRestart = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedProvince("");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  // Tính điểm: đếm số câu trả lời "Từ 2-3 ngày" hoặc "Từ 4-7 ngày"
  const highRiskAnswers = Object.values(answers).filter(answer => 
    answer === '2-3' || answer === '4-7'
  ).length;
  const isHighRisk = highRiskAnswers >= 3;

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
            <span className="text-gray-900 font-medium">Đánh giá nguy cơ mắc bệnh trào ngược dạ dày thực quản (GERD)</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Assessment Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Đánh giá nguy cơ mắc bệnh trào ngược dạ dày thực quản (GERD)</h1>
          </div>
          
          <div className="flex justify-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowEvidence(!showEvidence)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {showEvidence ? 'Ẩn dẫn chứng khoa học' : 'Xem dẫn chứng khoa học'}
            </Button>
          </div>
          
          {/* Evidence Display */}
          {showEvidence && (
            <div className="mb-8">
              <EvidenceDisplay 
                assessmentId="gerd"
                assessmentName="Đánh giá nguy cơ mắc bệnh trào ngược dạ dày thực quản (GERD)"
                evidence={assessmentEvidenceData.gerd.evidence}
                reliability={assessmentEvidenceData.gerd.reliability}
              />
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="p-8">
            {/* Question Number */}
            <div className="text-sm text-gray-600 mb-4">
              Câu {currentQuestion + 1}/{questions.length}
            </div>

            {/* Question */}
            <div className="bg-green-500 text-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-center">
                {questions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === '0' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('0')}
              >
                0 ngày
              </Button>
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === '1' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('1')}
              >
                1 ngày
              </Button>
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === '2-3' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('2-3')}
              >
                Từ 2-3 ngày
              </Button>
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === '4-7' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('4-7')}
              >
                Từ 4-7 ngày
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <span>Hủy</span>
              </Button>
              
              <div className="flex space-x-4">
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion]}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <span>
                    {currentQuestion === questions.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Info */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</h3>
                <p className="text-sm text-blue-800">
                  Đây là công cụ sàng lọc ban đầu. Nếu bạn trả lời "Từ 2-3 ngày" hoặc "Từ 4-7 ngày" 
                  từ 3 câu trở lên, hãy đến gặp bác sĩ ngay để được chẩn đoán và điều trị kịp thời.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết quả kiểm tra</h1>
            <div className={`text-4xl font-bold ${isHighRisk ? 'text-red-600' : 'text-green-600'} mb-6`}>
              {isHighRisk ? 'BẠN CÓ KHẢ NĂNG BỊ TRÀO NGƯỢC DẠ DÀY THỰC QUẢN' : 'NGUY CƠ THẤP TRÀO NGƯỢC DẠ DÀY'}
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
              <p className="text-lg text-gray-700 mb-4">
                {isHighRisk 
                  ? "Bạn có khả năng bị trào ngược dạ dày thực quản (GERD), bệnh xuất hiện khi người bệnh có một số yếu tố nguy cơ như thừa cân, ăn uống không điều độ, hoặc căng thẳng và thỉnh thoảng có triệu chứng trào ngược axit, nhưng chưa thường xuyên hoặc nghiêm trọng."
                  : "Bạn có nguy cơ thấp mắc bệnh trào ngược dạ dày thực quản (GERD). Tuy nhiên, hãy duy trì lối sống lành mạnh để phòng ngừa."
                }
              </p>
              <p className="text-gray-600">
                Danh sách các cơ sở y tế khuyến nghị để kiểm tra nguy cơ bệnh trào ngược dạ dày thực quản (GERD) tại đây: 
                <a href="#hospitals" className="text-blue-600 hover:text-blue-800 underline ml-1">
                  Danh sách bệnh viện
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Recommendations Section */}
          <Card className="max-w-4xl mx-auto mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Khuyến nghị</h2>
              <p className="text-gray-700 mb-4">
                Một số việc NÊN LÀM giúp bạn phòng ngừa GERD và duy trì sức khỏe tốt:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Loại bỏ các yếu tố gây trào ngược đã biết (stress, thuốc, thuốc lá, bia, rượu, cà phê,...)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Thể dục đều đặn, duy trì cân nặng lý tưởng (BMI từ 18.5 – 22,9)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tránh ăn quá no, chia thành nhiều bữa nhỏ trong ngày
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tránh ăn trong vòng 3 giờ trước khi đi ngủ
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Không nằm ngay sau khi ăn vào bất kỳ thời điểm nào trong ngày
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sử dụng gối cao hoặc nâng đầu giường
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tránh làm việc quá sức, cúi người hoặc khom lưng khi no
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tránh mặc quần áo chật làm tăng áp lực lên bụng
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Nằm nghiêng trái giúp giảm trào ngược
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* GERD Information */}
          <Card className="max-w-4xl mx-auto mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">GERD là gì?</h2>
              <p className="text-gray-700 mb-4">
                Trào ngược dạ dày thực quản (GERD) là tình trạng axit dạ dày trào ngược lên thực quản, 
                gây ra các triệu chứng như ợ nóng, ợ chua, đau ngực, khó nuốt. Bệnh có thể gây biến chứng 
                nghiêm trọng nếu không được điều trị kịp thời.
              </p>
              <p className="text-sm text-gray-600">
                Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng và nguy cơ mắc bệnh 
                trào ngược dạ dày thực quản hãy liên hệ với Bác sĩ để được tư vấn chi tiết cụ thể.
              </p>
            </CardContent>
          </Card>

          {/* Hospital List Section */}
          <Card className="max-w-4xl mx-auto mb-8" id="hospitals">
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
              onClick={() => setLocation("/kiem-tra-suc-khoe")}
              variant="outline"
              className="px-8 py-3"
            >
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
