import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import EvidenceDisplay from '@/components/evidence-display';
import { ClipboardCheck, ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { assessmentEvidenceData } from '@/data/assessment-evidence';

const COPDAssessmentPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Bạn có ho vài lần trong ngày?"
    },
    {
      id: 2,
      question: "Bạn có khạc đờm thường xuyên?"
    },
    {
      id: 3,
      question: "Bạn có khó thở hơn người cùng tuổi?"
    },
    {
      id: 4,
      question: "Bạn có từ 40 tuổi trở lên?"
    },
    {
      id: 5,
      question: "Bạn có hút thuốc lá?"
    }
  ];

  const provincesAndHospitals = {
    "Hà Nội": [
      { name: "Bệnh viện Bạch Mai", address: "78 Giải Phóng, Đống Đa, Hà Nội", map: "https://maps.google.com/?q=Bệnh viện Bạch Mai" },
      { name: "Bệnh viện Phổi Trung ương", address: "463 Hoàng Hoa Thám, Ba Đình, Hà Nội", map: "https://maps.google.com/?q=Bệnh viện Phổi Trung ương" },
      { name: "Bệnh viện Hữu Nghị Việt Đức", address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội", map: "https://maps.google.com/?q=Bệnh viện Hữu Nghị Việt Đức" },
      { name: "Bệnh viện Đa khoa Xanh Pôn", address: "12 Chu Văn An, Ba Đình, Hà Nội", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Xanh Pôn" }
    ],
    "TP. Hồ Chí Minh": [
      { name: "Bệnh viện Chợ Rẫy", address: "201B Nguyễn Chí Thanh, Quận 5, TP.HCM", map: "https://maps.google.com/?q=Bệnh viện Chợ Rẫy" },
      { name: "Bệnh viện Phạm Ngọc Thạch", address: "120 Hồng Bàng, Quận 5, TP.HCM", map: "https://maps.google.com/?q=Bệnh viện Phạm Ngọc Thạch" },
      { name: "Bệnh viện Đại học Y Dược TP.HCM", address: "215 Hồng Bàng, Quận 5, TP.HCM", map: "https://maps.google.com/?q=Bệnh viện Đại học Y Dược TP.HCM" },
      { name: "Bệnh viện Nhân dân 115", address: "527 Sư Vạn Hạnh, Quận 10, TP.HCM", map: "https://maps.google.com/?q=Bệnh viện Nhân dân 115" }
    ],
    "Đà Nẵng": [
      { name: "Bệnh viện Đà Nẵng", address: "124 Hải Phòng, Hải Châu, Đà Nẵng", map: "https://maps.google.com/?q=Bệnh viện Đà Nẵng" },
      { name: "Bệnh viện C Đà Nẵng", address: "122 Hải Phòng, Hải Châu, Đà Nẵng", map: "https://maps.google.com/?q=Bệnh viện C Đà Nẵng" },
      { name: "Bệnh viện Phổi Đà Nẵng", address: "456 Lê Duẩn, Hải Châu, Đà Nẵng", map: "https://maps.google.com/?q=Bệnh viện Phổi Đà Nẵng" }
    ],
    "Cần Thơ": [
      { name: "Bệnh viện Đa khoa Trung ương Cần Thơ", address: "315 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Trung ương Cần Thơ" },
      { name: "Bệnh viện Chuyên khoa Phổi Cần Thơ", address: "123 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ", map: "https://maps.google.com/?q=Bệnh viện Chuyên khoa Phổi Cần Thơ" },
      { name: "Bệnh viện Đa khoa Cần Thơ", address: "789 Nguyễn Văn Linh, Ninh Kiều, Cần Thơ", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Cần Thơ" }
    ],
    "Hải Phòng": [
      { name: "Bệnh viện Việt Tiệp", address: "1 Nhà Thương, Lê Chân, Hải Phòng", map: "https://maps.google.com/?q=Bệnh viện Việt Tiệp" },
      { name: "Bệnh viện Đa khoa Hải Phòng", address: "14 Nguyễn Đức Cảnh, Lê Chân, Hải Phòng", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Hải Phòng" },
      { name: "Bệnh viện Phổi Hải Phòng", address: "456 Lê Lợi, Ngô Quyền, Hải Phòng", map: "https://maps.google.com/?q=Bệnh viện Phổi Hải Phòng" }
    ],
    "Nghệ An": [
      { name: "Bệnh viện Đa khoa Nghệ An", address: "19 Lê Lợi, Vinh, Nghệ An", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Nghệ An" },
      { name: "Bệnh viện Hữu Nghị Đa khoa Nghệ An", address: "Km5 Đường Quốc lộ 1A, Vinh, Nghệ An", map: "https://maps.google.com/?q=Bệnh viện Hữu Nghị Đa khoa Nghệ An" },
      { name: "Bệnh viện Phổi Nghệ An", address: "123 Nguyễn Thị Minh Khai, Vinh, Nghệ An", map: "https://maps.google.com/?q=Bệnh viện Phổi Nghệ An" }
    ],
    "Thanh Hóa": [
      { name: "Bệnh viện Đa khoa Thanh Hóa", address: "143 Trần Phú, Thanh Hóa", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Thanh Hóa" },
      { name: "Bệnh viện Chuyên khoa Phổi Thanh Hóa", address: "456 Lê Lợi, Thanh Hóa", map: "https://maps.google.com/?q=Bệnh viện Chuyên khoa Phổi Thanh Hóa" },
      { name: "Bệnh viện Đa khoa Bỉm Sơn", address: "789 Quang Trung, Bỉm Sơn, Thanh Hóa", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Bỉm Sơn" }
    ],
    "Quảng Nam": [
      { name: "Bệnh viện Đa khoa Quảng Nam", address: "123 Trần Hưng Đạo, Tam Kỳ, Quảng Nam", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Quảng Nam" },
      { name: "Bệnh viện Chuyên khoa Phổi Quảng Nam", address: "456 Nguyễn Huệ, Tam Kỳ, Quảng Nam", map: "https://maps.google.com/?q=Bệnh viện Chuyên khoa Phổi Quảng Nam" },
      { name: "Bệnh viện Đa khoa Hội An", address: "789 Nguyễn Duy Hiệu, Hội An, Quảng Nam", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Hội An" }
    ],
    "Thái Nguyên": [
      { name: "Bệnh viện Đa khoa Thái Nguyên", address: "123 Hoàng Văn Thụ, Thái Nguyên", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Thái Nguyên" },
      { name: "Bệnh viện A Thái Nguyên", address: "456 Đường Thành, Thái Nguyên", map: "https://maps.google.com/?q=Bệnh viện A Thái Nguyên" },
      { name: "Bệnh viện Phổi Thái Nguyên", address: "789 Lương Ngọc Quyến, Thái Nguyên", map: "https://maps.google.com/?q=Bệnh viện Phổi Thái Nguyên" }
    ],
    "Vĩnh Phúc": [
      { name: "Bệnh viện Đa khoa Vĩnh Phúc", address: "123 Nguyễn Tất Thành, Vĩnh Yên, Vĩnh Phúc", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Vĩnh Phúc" },
      { name: "Bệnh viện 74 Trung ương", address: "456 Phúc Yên, Vĩnh Phúc", map: "https://maps.google.com/?q=Bệnh viện 74 Trung ương" },
      { name: "Bệnh viện Phổi Vĩnh Phúc", address: "789 Hưng Vương, Phúc Yên, Vĩnh Phúc", map: "https://maps.google.com/?q=Bệnh viện Phổi Vĩnh Phúc" }
    ],
    "Bà Rịa - Vũng Tàu": [
      { name: "Bệnh viện Đa khoa Bà Rịa", address: "123 Nguyễn Hữu Thọ, Bà Rịa", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Bà Rịa" },
      { name: "Bệnh viện Đa khoa Vũng Tàu", address: "456 Trương Công Định, Vũng Tàu", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Vũng Tàu" },
      { name: "Bệnh viện Phổi Bà Rịa", address: "789 Lê Lợi, Bà Rịa", map: "https://maps.google.com/?q=Bệnh viện Phổi Bà Rịa" }
    ],
    "Bạc Liêu": [
      { name: "Bệnh viện Đa khoa Bạc Liêu", address: "123 Nguyễn Tất Thành, Bạc Liêu", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Bạc Liêu" },
      { name: "Bệnh viện Phổi Bạc Liêu", address: "456 Trần Phú, Bạc Liêu", map: "https://maps.google.com/?q=Bệnh viện Phổi Bạc Liêu" }
    ],
    "Cà Mau": [
      { name: "Bệnh viện Đa khoa Cà Mau", address: "123 Nguyễn Trãi, Cà Mau", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Cà Mau" },
      { name: "Bệnh viện Phổi Cà Mau", address: "456 Lý Tự Trọng, Cà Mau", map: "https://maps.google.com/?q=Bệnh viện Phổi Cà Mau" }
    ],
    "Hà Tĩnh": [
      { name: "Bệnh viện Đa khoa Hà Tĩnh", address: "123 Nguyễn Du, Hà Tĩnh", map: "https://maps.google.com/?q=Bệnh viện Đa khoa Hà Tĩnh" },
      { name: "Bệnh viện Phổi Hà Tĩnh", address: "456 Trần Phú, Hà Tĩnh", map: "https://maps.google.com/?q=Bệnh viện Phổi Hà Tĩnh" }
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
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedProvince("");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const yesCount = Object.values(answers).filter(answer => answer === 'yes').length;
  const isHighRisk = yesCount >= 3;

  if (showResults) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-2">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Trang chủ</span>
              <span className="mx-2">›</span>
              <span>Kiểm tra sức khỏe</span>
              <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">Đánh giá nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD)</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Kết quả kiểm tra
            </h1>
            <div className={`text-3xl font-bold mb-4 ${
              isHighRisk ? 'text-red-600' : 'text-green-600'
            }`}>
              {isHighRisk ? 'NGUY CƠ CAO MẮC COPD' : 'NGUY CƠ THẤP MẮC COPD'}
            </div>
            
            {/* Doctor illustration placeholder */}
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">
                {isHighRisk ? '😟' : '👍'}
              </span>
            </div>
          </div>
          
          {/* Results Card */}
          <div className="bg-white rounded-lg p-8 mb-6 shadow-lg">
            {/* Tình trạng */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tình trạng</h3>
              <p className="text-gray-700 leading-relaxed">
                {isHighRisk 
                  ? "Bạn có khả năng phát triển bệnh phổi tắc nghẽn mạn tính (COPD) CAO hơn so với mức trung bình"
                  : "Bạn có khả năng phát triển bệnh phổi tắc nghẽn mạn tính (COPD) THẤP hơn so với mức trung bình"
                }
              </p>
              <p className="text-gray-600 mt-2">
                Danh sách các cơ sở y tế khuyến nghị để kiểm tra nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD) tại đây: 
                <a href="#hospital-list" className="text-blue-600 hover:underline ml-1">
                  Danh sách bệnh viện
                </a>
              </p>
            </div>
            
            {/* Khuyến nghị */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Khuyến nghị</h3>
              <ul className="space-y-3 text-gray-700">
                {isHighRisk ? (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Bạn cần đến gặp bác sĩ chuyên khoa hô hấp để được kiểm tra sớm.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Ngừng hút thuốc lá.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Nhập viện ngay khi có các triệu chứng: sốt, khó thở, thở rít, thở khò khè, nặng ngực.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Tập vật lý trị liệu phục hồi chức năng phổi.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Bỏ/hạn chế hoặc tránh tiếp xúc với khói thuốc lá.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Vệ sinh sạch sẽ, thông thoáng nơi ở, nơi làm việc.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Khám sức khoẻ định kỳ mỗi 6 tháng hoặc 1 năm.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Kiểm soát ổn các bệnh lý mãn tính: Tăng huyết áp, đái tháo đường, hen,...</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Thể dục đều đặn, duy trì cân nặng lý tưởng (BMI từ 18.5 - 22,9).</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* COPD là gì */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bệnh phổi tắc nghẽn mạn tính (COPD) là gì?</h3>
              <p className="text-gray-700 leading-relaxed">
                {isHighRisk 
                  ? "Bệnh phổi tắc nghẽn mạn tính là bệnh lý hô hấp mạn tính đặc trưng bởi sự tắc nghẽn cố định của đường dẫn khí (phế quản), điều này khiến không khí trong phổi khó thoát ra ngoài hơn bình thường. Các triệu chứng thường gặp bao gồm ho khạc đờm kéo dài, khó thở, khò khè và biến chứng dẫn đến các đợt cấp phải nhập viện và có nguy cơ tử vong. Nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD) cao thường gặp ở những người hút thuốc lá, tiếp xúc lâu dài với khói bụi, ô nhiễm công nghiệp, hoặc làm việc trong môi trường ô nhiễm. Tiền sử bệnh hô hấp mãn tính, tuổi cao, và di truyền cũng là các yếu tố tăng nguy cơ. Để giảm thiểu rủi ro, cần ngừng hút thuốc, tránh các tác nhân gây hại, và duy trì lối sống lành mạnh."
                  : "Bệnh phổi tắc nghẽn mạn tính là bệnh lý hô hấp mạn tính đặc trưng bởi sự tắc nghẽn cố định của đường dẫn khí (phế quản), điều này khiến không khí trong phổi khó thoát ra ngoài hơn bình thường. Các triệu chứng thường gặp bao gồm ho khạc đờm kéo dài, khó thở, khò khè và biến chứng dẫn đến các đợt cấp phải nhập viện và có nguy cơ tử vong. Nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD) thấp thường gặp ở những người không hút thuốc lá, ít tiếp xúc với ô nhiễm không khí, và không có tiền sử bệnh hô hấp. Để duy trì sức khỏe phổi tốt, cần tránh khói thuốc lá, duy trì môi trường sống sạch sẽ và lối sống lành mạnh."
                }
              </p>
            </div>
            
            {/* Gợi ý bệnh viện */}
            <div id="hospital-list" className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gợi ý bệnh viện khám bệnh</h3>
              <div className="flex justify-end mb-4">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-[250px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Thành Phố/Tỉnh</option>
                  {Object.keys(provincesAndHospitals).map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(provincesAndHospitals)
                  .filter(([province]) => !selectedProvince || province === selectedProvince)
                  .flatMap(([province, hospitals]) => 
                    hospitals.map((hospital, index) => (
                      <div key={`${province}-${index}`} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{hospital.name}</h4>
                        <p className="text-gray-600 mb-2 text-sm">{hospital.address}</p>
                        <a
                          href={hospital.map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Xem bản đồ
                        </a>
                      </div>
                    ))
                  )}
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng và nguy cơ mắc bệnh COPD hãy liên hệ với bác sĩ, dược sĩ để được tư vấn chi tiết cụ thể.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-x-4">
            <Button
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
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

        <Footer />
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">Đánh giá nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD)</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Đánh giá nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD)
            </h1>
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
                assessmentId="copd"
                assessmentName="Đánh giá nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD)"
                evidence={assessmentEvidenceData.copd.evidence}
                reliability={assessmentEvidenceData.copd.reliability}
              />
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Question Counter */}
          <div className="text-sm text-gray-600 mb-6">
            Câu {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-lg max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-green-500 text-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold">
                {questions[currentQuestion].question}
              </h2>
            </div>
            
            {/* Answer Options */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === 'yes'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('yes')}
              >
                Có
              </Button>
              
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  answers[currentQuestion] === 'no'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300'
                }`}
                onClick={() => handleAnswer('no')}
              >
                Không
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-4xl mx-auto">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-8 py-4 text-lg"
          >
            Hủy
          </Button>
          
          <div className="space-x-4">
            {currentQuestion > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="px-8 py-4 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Button>
            )}
            
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Tiếp tục
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!answers[currentQuestion]}
                className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Hoàn tất
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default COPDAssessmentPage;
