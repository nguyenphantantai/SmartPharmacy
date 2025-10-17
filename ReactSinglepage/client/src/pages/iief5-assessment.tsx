import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EvidenceDisplay from '@/components/evidence-display';
import { ClipboardCheck, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { assessmentEvidenceData } from '@/data/assessment-evidence';

const IIEF5AssessmentPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Trong vòng 6 tháng qua, mức độ tự tin của bạn về khả năng đạt được và duy trì sự cương cứng như thế nào?",
      options: [
        "Rất thấp",
        "Thấp", 
        "Trung bình",
        "Cao",
        "Rất cao"
      ]
    },
    {
      id: 2,
      text: "Trong vòng 6 tháng qua, khi cương cứng do kích thích tình dục, số lần bạn đạt đủ độ cương cứng để thâm nhập?",
      options: [
        "Không bao giờ hay gần như không bao giờ đạt",
        "Chỉ vài lần (<1/2 số lần)",
        "Đôi khi (1/2 số lần)",
        "Hầu hết thời gian (>1/2 số lần)",
        "Luôn luôn hay hầu như luôn luôn đạt"
      ]
    },
    {
      id: 3,
      text: "Trong vòng 6 tháng qua, trong khi quan hệ, số lần bạn có thể duy trì sự cương cứng sau khi thâm nhập?",
      options: [
        "Không bao giờ hay gần như không bao giờ đạt",
        "Chỉ vài lần (<1/2 số lần)",
        "Đôi khi (1/2 số lần)",
        "Hầu hết thời gian (>1/2 số lần)",
        "Luôn luôn hay hầu như luôn luôn đạt"
      ]
    },
    {
      id: 4,
      text: "Trong vòng 6 tháng qua, trong khi quan hệ, bạn có gặp khó khăn trong việc duy trì sự cương cứng cho đến khi quan hệ xong?",
      options: [
        "Vô cùng khó khăn",
        "Rất khó khăn",
        "Khó khăn",
        "Hơi khó khăn",
        "Không khó khăn"
      ]
    },
    {
      id: 5,
      text: "Trong vòng 6 tháng qua, khi bạn quan hệ, bạn có thường đạt được cảm giác thỏa mãn không?",
      options: [
        "Không bao giờ hay gần như không bao giờ đạt",
        "Chỉ vài lần (<1/2 số lần)",
        "Đôi khi (1/2 số lần)",
        "Hầu hết thời gian (>1/2 số lần)",
        "Luôn luôn hay hầu như luôn luôn đạt"
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
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
    // Tính điểm IIEF-5
    const calculateScore = () => {
      let totalScore = 0;
      
      // Câu 1: Tự tin về khả năng cương cứng (1-5 điểm)
      if (answers[0] !== undefined) {
        totalScore += answers[0] + 1;
      }
      
      // Câu 2: Đạt đủ độ cương cứng để thâm nhập (0-4 điểm)
      if (answers[1] !== undefined) {
        totalScore += answers[1];
      }
      
      // Câu 3: Duy trì cương cứng sau thâm nhập (0-4 điểm)
      if (answers[2] !== undefined) {
        totalScore += answers[2];
      }
      
      // Câu 4: Khó khăn duy trì cương cứng (0-4 điểm, đảo ngược)
      if (answers[3] !== undefined) {
        totalScore += (4 - answers[3]);
      }
      
      // Câu 5: Đạt được cảm giác thỏa mãn (0-4 điểm)
      if (answers[4] !== undefined) {
        totalScore += answers[4];
      }
      
      return totalScore;
    };

    const score = calculateScore();
    
    // Phân loại mức độ RLCD theo IIEF-5
    let riskLevel = '';
    let message = '';
    
    if (score >= 22) {
      riskLevel = 'normal';
      message = 'KHÔNG CÓ RỐI LOẠN CƯƠNG DƯƠNG';
    } else if (score >= 17) {
      riskLevel = 'mild';
      message = 'RLCD MỨC ĐỘ NHẸ';
    } else if (score >= 12) {
      riskLevel = 'mild-moderate';
      message = 'RLCD MỨC ĐỘ NHẸ - TRUNG BÌNH';
    } else if (score >= 8) {
      riskLevel = 'moderate';
      message = 'RLCD MỨC ĐỘ TRUNG BÌNH';
    } else {
      riskLevel = 'severe';
      message = 'RLCD MỨC ĐỘ NẶNG';
    }

    const riskAssessment = {
      score,
      riskLevel,
      message,
      answers: answers.map((answer, index) => ({
        question: questions[index].text,
        answer: questions[index].options[answer],
        answerIndex: answer
      }))
    };

    // Lưu kết quả vào sessionStorage
    sessionStorage.setItem('iief5Assessment', JSON.stringify(riskAssessment));
    
    // Chuyển đến trang kết quả
    setLocation('/danh-gia-muc-do-cuong-cung-duong-vat-iief5/ket-qua');
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
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
          <span className="text-gray-900 font-medium">Đánh giá mức độ cương cứng của dương vật IIEF-5 (SHIM)</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-center mb-6">
                <ClipboardCheck className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Đánh giá mức độ cương cứng của dương vật IIEF-5 (SHIM)
                </h1>
              </div>

              <div className="flex justify-center mb-6">
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
                <div className="mb-6">
                  <EvidenceDisplay 
                    assessmentId="iief5"
                    assessmentName="Đánh giá mức độ cương cứng dương vật IIEF-5 (SHIM)"
                    evidence={assessmentEvidenceData.iief5.evidence}
                    reliability={assessmentEvidenceData.iief5.reliability}
                  />
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Câu {currentQuestion + 1}/{questions.length}</span>
                  <span>{Math.round(progress)}% hoàn thành</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {questions[currentQuestion].text}
                  </h2>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="text-gray-600"
                  >
                    Làm lại
                  </Button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleComplete}
                      disabled={answers[currentQuestion] === undefined}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                    >
                      Hoàn tất
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === undefined}
                      className="flex items-center"
                    >
                      Tiếp tục
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IIEF5AssessmentPage;
