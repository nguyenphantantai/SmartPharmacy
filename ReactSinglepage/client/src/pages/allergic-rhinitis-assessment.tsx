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

export default function AllergicRhinitisAssessment() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showEvidence, setShowEvidence] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Bạn có gặp triệu chứng ho hay không?",
      options: [
        "Thường xuyên, thường ho khan",
        "Thường xuyên, thường ho có đờm", 
        "Không có",
        "Hiếm khi ho, thường là ho khan"
      ]
    },
    {
      id: 2,
      question: "Bạn có gặp tình trạng chảy mũi, hắt xì không?",
      options: [
        "Không",
        "Thường xuyên",
        "Hiếm khi",
        "Thỉnh thoảng"
      ]
    },
    {
      id: 3,
      question: "Bạn có sốt không?",
      options: [
        "Không sốt",
        "Thỉnh thoảng có sốt",
        "Sốt nhẹ",
        "Thường xuyên sốt"
      ]
    },
    {
      id: 4,
      question: "Bạn có đau nhức cơ thể và tiêu chảy không?",
      options: [
        "Thường xuyên",
        "Không",
        "Hiếm khi",
        "Thỉnh thoảng"
      ]
    },
    {
      id: 5,
      question: "Bạn có từng tiếp xúc với các tác nhân như là phấn hoa, côn trùng, bụi bẩn thời gian gần đây hay không?",
      options: [
        "Có",
        "Không"
      ]
    },
    {
      id: 6,
      question: "Triệu chứng thường kéo dài bao lâu?",
      options: [
        "7 - 25 ngày",
        "Vài tuần",
        "Ít hơn 14 ngày",
        "7 - 14 ngày"
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
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
    // Tính toán kết quả đánh giá
    const riskAssessment = calculateRiskScore();
    
    // Lưu dữ liệu vào sessionStorage
    const assessmentData = {
      answers,
      riskAssessment
    };
    sessionStorage.setItem('allergicRhinitisAssessment', JSON.stringify(assessmentData));
    
    // Chuyển hướng đến trang kết quả
    setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung/ket-qua");
  };

  const handleCancel = () => {
    setLocation("/kiem-tra-suc-khoe");
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
  };

  // Tính toán điểm số và đánh giá nguy cơ
  const calculateRiskScore = () => {
    const scores = Object.values(answers);
    if (scores.length === 0) return { score: 0, riskLevel: 'low', message: '' };
    
    let totalScore = 0;
    
    // Câu 1: Ho
    if (answers[0] !== undefined) {
      const coughScores = [3, 2, 0, 1]; // Thường xuyên ho khan, thường xuyên ho đờm, không có, hiếm khi ho khan
      totalScore += coughScores[answers[0]];
    }
    
    // Câu 2: Chảy mũi, hắt xì
    if (answers[1] !== undefined) {
      const rhinitisScores = [0, 3, 1, 2]; // Không, thường xuyên, hiếm khi, thỉnh thoảng
      totalScore += rhinitisScores[answers[1]];
    }
    
    // Câu 3: Sốt
    if (answers[2] !== undefined) {
      const feverScores = [0, 1, 1, 2]; // Không sốt, thỉnh thoảng, sốt nhẹ, thường xuyên sốt
      totalScore += feverScores[answers[2]];
    }
    
    // Câu 4: Đau nhức cơ thể và tiêu chảy
    if (answers[3] !== undefined) {
      const bodyAcheScores = [2, 0, 1, 1]; // Thường xuyên, không, hiếm khi, thỉnh thoảng
      totalScore += bodyAcheScores[answers[3]];
    }
    
    // Câu 5: Tiếp xúc với tác nhân dị ứng
    if (answers[4] !== undefined) {
      const exposureScores = [3, 0]; // Có, không
      totalScore += exposureScores[answers[4]];
    }
    
    // Câu 6: Thời gian triệu chứng
    if (answers[5] !== undefined) {
      const durationScores = [2, 3, 0, 1]; // 7-25 ngày, vài tuần, ít hơn 14 ngày, 7-14 ngày
      totalScore += durationScores[answers[5]];
    }
    
    // Đánh giá nguy cơ dựa trên tổng điểm
    if (totalScore >= 8) {
      return {
        score: totalScore,
        riskLevel: 'high',
        message: 'NGUY CƠ CAO MẮC VIÊM MŨI DỊ ỨNG'
      };
    } else if (totalScore >= 5) {
      return {
        score: totalScore,
        riskLevel: 'medium',
        message: 'NGUY CƠ TRUNG BÌNH MẮC VIÊM MŨI DỊ ỨNG'
      };
    } else {
      return {
        score: totalScore,
        riskLevel: 'low',
        message: 'CÓ THỂ BẠN KHÔNG MẮC PHẢI TÌNH TRẠNG VIÊM MŨI DỊ ỨNG'
      };
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
            <span className="text-gray-900 font-medium">Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng</h1>
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
                assessmentId="allergic-rhinitis"
                assessmentName="Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng"
                evidence={assessmentEvidenceData['allergic-rhinitis'].evidence}
                reliability={assessmentEvidenceData['allergic-rhinitis'].reliability}
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
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full h-16 text-lg ${
                    answers[currentQuestion] === index 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
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
                  disabled={answers[currentQuestion] === undefined}
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
                  Đây là công cụ đánh giá nguy cơ viêm mũi dị ứng. 
                  Nếu bạn có nguy cơ cao, hãy đến gặp bác sĩ chuyên khoa tai mũi họng để được tư vấn và điều trị phù hợp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
