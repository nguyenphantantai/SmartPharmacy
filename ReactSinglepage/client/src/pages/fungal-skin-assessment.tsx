import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import EvidenceDisplay from "@/components/evidence-display";
import { ArrowLeft, ArrowRight, CheckCircle, Hand, BookOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { assessmentEvidenceData } from "@/data/assessment-evidence";

export default function FungalSkinAssessmentPage() {
  const [location, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Bạn có thường bị ngứa ở vùng da có nhiều tuyến bã nhờn như hai bên mặt, ngực, lưng,... mà không rõ nguyên nhân không?",
      options: ["Có", "Không"]
    },
    {
      id: 2,
      question: "Trên các vùng da (ngực, lưng, mặt, các nếp gấp da,...) có xuất hiện:",
      options: [
        "Da đỏ, bong tróc vảy",
        "Mảng trắng hoặc nâu nhạt loang lổ", 
        "Vùng da bị ẩm, có mùi hôi nhẹ",
        "Không xuất hiện các triệu chứng nêu trên"
      ]
    },
    {
      id: 3,
      question: "Bạn đã từng bị viêm da tiết bã, nấm kẽ tay kẽ chân hoặc lang ben trước đây chưa?",
      options: ["Có", "Không"]
    },
    {
      id: 4,
      question: "Những triệu chứng như ngứa, bong tróc, nổi mẩn,... có tái đi tái lại không?",
      options: ["Có", "Không", "Không chắc"]
    },
    {
      id: 5,
      question: "Bạn có thường xuyên sinh hoạt hoặc làm việc trong môi trường nóng ẩm, dễ ra mồ hôi không?",
      options: ["Có", "Không"]
    },
    {
      id: 6,
      question: "Bạn có tiếp xúc với động vật nuôi như mèo, chó, thỏ gần đây không?",
      options: ["Có", "Không"]
    },
    {
      id: 7,
      question: "Bạn có hay dùng chung hoặc giặt chung khăn tắm, giày dép, quần áo với người khác không?",
      options: ["Có", "Không", "Không rõ"]
    },
    {
      id: 8,
      question: "Có ai trong gia đình bạn (bố/mẹ/con) từng bị viêm da hoặc nấm da không?",
      options: ["Có", "Không", "Không rõ"]
    },
    {
      id: 9,
      question: "Triệu chứng trên có khiến bạn:",
      options: [
        "Mất tự tin khi giao tiếp",
        "Thường xuyên phải gãi/ngứa gây mất ngủ",
        "Ảnh hưởng tới sinh hoạt hoặc công việc",
        "Không có ảnh hưởng gì"
      ]
    },
    {
      id: 10,
      question: "Bạn đã từng đi khám da liễu để được chẩn đoán chính xác chưa?",
      options: ["Rồi", "Chưa", "Chỉ tự mua thuốc dùng"]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    setLocation('/kiem-tra-suc-khoe');
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Risk Assessment Logic
  const calculateRisk = () => {
    let riskScore = 0;
    
    // Question 1: Itching in sebaceous areas
    if (answers[0] === 'Có') riskScore += 2;
    
    // Question 2: Skin symptoms
    if (answers[1] === 'Da đỏ, bong tróc vảy') riskScore += 3;
    else if (answers[1] === 'Mảng trắng hoặc nâu nhạt loang lổ') riskScore += 3;
    else if (answers[1] === 'Vùng da bị ẩm, có mùi hôi nhẹ') riskScore += 2;
    
    // Question 3: Previous fungal infections
    if (answers[2] === 'Có') riskScore += 2;
    
    // Question 4: Recurring symptoms
    if (answers[3] === 'Có') riskScore += 2;
    else if (answers[3] === 'Không chắc') riskScore += 1;
    
    // Question 5: Hot, humid environment
    if (answers[4] === 'Có') riskScore += 1;
    
    // Question 6: Animal contact
    if (answers[5] === 'Có') riskScore += 1;
    
    // Question 7: Sharing personal items
    if (answers[6] === 'Có') riskScore += 2;
    else if (answers[6] === 'Không rõ') riskScore += 1;
    
    // Question 8: Family history
    if (answers[7] === 'Có') riskScore += 1;
    else if (answers[7] === 'Không rõ') riskScore += 0.5;
    
    // Question 9: Impact on daily life
    if (answers[8] === 'Mất tự tin khi giao tiếp') riskScore += 1;
    else if (answers[8] === 'Thường xuyên phải gãi/ngứa gây mất ngủ') riskScore += 2;
    else if (answers[8] === 'Ảnh hưởng tới sinh hoạt hoặc công việc') riskScore += 2;
    
    // Question 10: Medical consultation
    if (answers[9] === 'Chưa') riskScore += 1;
    else if (answers[9] === 'Chỉ tự mua thuốc dùng') riskScore += 2;
    
    return {
      score: riskScore,
      level: riskScore >= 8 ? 'high' : riskScore >= 4 ? 'moderate' : 'low'
    };
  };

  const riskResult = calculateRisk();

  if (showResults) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <a href="/" className="hover:underline">Trang chủ</a>{' '}
            ›{' '}
            <a href="/kiem-tra-suc-khoe" className="hover:underline">Kiểm tra sức khỏe</a>{' '}
            › Đánh giá nguy cơ mắc bệnh nấm da › Kết quả kiểm tra
          </nav>

          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Kết quả kiểm tra
            </h2>

            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
              ĐÁNH GIÁ NGUY CƠ MẮC BỆNH NẤM DA
            </h1>

            {/* Illustration */}
            <div className="text-center mb-8">
              <Hand className="w-16 h-16 text-blue-400 mx-auto" />
            </div>

            {/* Results Card */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              {/* Risk Level */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {riskResult.level === 'high' ? (
                    <span className="text-red-600">CÓ NGUY CƠ CAO</span>
                  ) : riskResult.level === 'moderate' ? (
                    <span className="text-yellow-600">NGUY CƠ TRUNG BÌNH</span>
                  ) : (
                    <span className="text-green-600">NGUY CƠ THẤP</span>
                  )}
                </h3>
              </div>

              {/* Tình trạng */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tình trạng</h3>
                <p className="text-gray-700 mb-4">
                  {riskResult.level === 'high' ? (
                    <>Bạn có dấu hiệu cho thấy đang ở nhóm nguy cơ cao bị nhiễm nấm da hoặc đang trong giai đoạn đầu của bệnh. Việc theo dõi kỹ và điều trị sớm sẽ giúp phòng ngừa bệnh lan rộng hoặc tái phát.</>
                  ) : riskResult.level === 'moderate' ? (
                    <>Bạn có một số dấu hiệu có thể liên quan đến bệnh nấm da. Nên theo dõi và thực hiện các biện pháp phòng ngừa để tránh nguy cơ phát triển thành bệnh.</>
                  ) : (
                    <>Hiện tại bạn có ít dấu hiệu nguy cơ mắc bệnh nấm da. Hãy tiếp tục duy trì các thói quen vệ sinh tốt để phòng ngừa.</>
                  )}
                </p>
                
                <p className="text-gray-700">
                  Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng và nguy cơ mắc bệnh nấm da hãy liên hệ với bác sĩ, dược sĩ để được tư vấn chi tiết cụ thể.
                </p>
              </div>

              {/* Khuyến nghị */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lời khuyên dành cho bạn</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Vệ sinh cá nhân:</strong> Giặt sạch và phơi khô hoàn toàn quần áo, khăn, mũ, khẩu trang vải sau mỗi lần sử dụng.
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Môi trường sống:</strong> Tránh môi trường nóng ẩm, giữ da khô ráo, đặc biệt ở các vùng dễ ra mồ hôi.
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Chăm sóc da:</strong> Hạn chế dùng mỹ phẩm hoặc sản phẩm gây bí da khi đang có dấu hiệu nghi ngờ nấm.
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Khám bác sĩ:</strong> Nên đến nhà thuốc hoặc gặp chuyên gia da liễu để được tư vấn và chọn sản phẩm phù hợp.
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Gia đình:</strong> Kiểm tra thêm người thân nếu có dấu hiệu tương tự (nấm da có thể lây khi dùng chung đồ).
                  </p>
                </div>
              </div>

              {/* Thông tin về bệnh */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nấm da là gì?</h3>
                <p className="text-gray-700">
                  Nấm da là bệnh nhiễm trùng da do vi nấm gây ra. Thường xuất hiện ở vùng da ẩm, dễ ra mồ hôi như lưng, ngực, cổ, mặt, bẹn... Bệnh thường không nguy hiểm nhưng dễ tái phát nếu không chăm sóc đúng cách.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="px-8 py-4 text-xl font-semibold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Làm lại đánh giá
              </Button>
              <Button
                onClick={() => setLocation('/kiem-tra-suc-khoe')}
                className="px-8 py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:underline">Trang chủ</a>{' '}
          ›{' '}
          <a href="/kiem-tra-suc-khoe" className="hover:underline">Kiểm tra sức khỏe</a>{' '}
          › Đánh giá nguy cơ mắc bệnh nấm da
        </nav>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            <Hand className="w-8 h-8 inline-block mr-3" />
            Đánh giá nguy cơ mắc bệnh nấm da
          </h1>

          <div className="flex justify-center mb-8">
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
                assessmentId="fungal-skin"
                assessmentName="Đánh giá nguy cơ mắc bệnh nấm da"
                evidence={assessmentEvidenceData['fungal-skin'].evidence}
                reliability={assessmentEvidenceData['fungal-skin'].reliability}
              />
            </div>
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-700">
                Câu {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-green-500 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-white text-center">
                {questions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  variant={answers[currentQuestion] === option ? "default" : "outline"}
                  className={`w-full p-4 h-auto text-center font-semibold text-lg whitespace-normal break-words ${
                    answers[currentQuestion] === option 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-8 py-4 text-xl font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
            
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-8 py-4 text-xl font-semibold"
            >
              Hủy
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="px-8 py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  Hoàn tất
                  <CheckCircle className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
