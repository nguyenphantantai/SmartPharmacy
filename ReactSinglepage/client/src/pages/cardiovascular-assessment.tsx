import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import EvidenceDisplay from '@/components/evidence-display';
import { ArrowLeft, ArrowRight, CheckCircle, ClipboardCheck, BookOpen } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useLocation } from 'wouter';
import { assessmentEvidenceData } from '@/data/assessment-evidence';

interface Question {
  id: number;
  question: string;
  options: string[];
  section: string;
}

interface LabResult {
  mmolL: string;
  mgdL: string;
  unknown: boolean;
}

const questions: Question[] = [
  // Thông tin chung
  { id: 1, question: 'Giới tính', options: ['Nam', 'Nữ'], section: 'general' },
  { id: 2, question: 'Tuổi', options: [], section: 'general' }, // Empty options for text input
  { id: 3, question: 'Hút thuốc lá', options: ['Có', 'Không'], section: 'general' },
  { id: 4, question: 'Đái tháo đường', options: ['Có', 'Không', 'Không biết'], section: 'general' },
  { id: 5, question: 'Mắc đái tháo đường trên 10 năm', options: ['Có', 'Không', 'Không biết'], section: 'general' },
  { id: 6, question: 'Tăng huyết áp', options: ['Có', 'Không', 'Không biết'], section: 'general' },
  { id: 7, question: 'Rối loạn mỡ máu', options: ['Có', 'Không', 'Không biết'], section: 'general' },
  
  // Bệnh lý tim mạch do xơ vữa
  { id: 8, question: 'Đột quỵ hoặc cơn thiếu máu não cục bộ thoáng qua', options: ['Có', 'Không', 'Không biết'], section: 'cardiovascular' },
  { id: 9, question: 'Nhồi máu cơ tim', options: ['Có', 'Không', 'Không biết'], section: 'cardiovascular' },
  { id: 10, question: 'Đã từng thông tim (đặt stent/mổ bắc cầu mạch vành)', options: ['Có', 'Không', 'Không biết'], section: 'cardiovascular' },
  { id: 11, question: 'Đau thắt ngực', options: ['Có', 'Không', 'Không biết'], section: 'cardiovascular' },
  { id: 12, question: 'Bệnh lý khác: phình/tách động mạch chủ, tắc động mạch chân', options: ['Có', 'Không', 'Không biết'], section: 'cardiovascular' },
  
  // Đánh giá nguy cơ thận
  { id: 13, question: 'Có bị bệnh thận mạn hoặc suy giảm chức năng thận?', options: ['Có, suy giảm chức năng thận giai đoạn 3', 'Có, suy giảm chức năng thận giai đoạn 4,5', 'Không biết', 'Không'], section: 'kidney' },
  { id: 14, question: 'Ông/Bà có đang hoặc từng được bác sĩ chẩn đoán thiếu máu không?', options: ['Có', 'Không', 'Không biết'], section: 'kidney' },
  { id: 15, question: 'Ông/Bà trước đây có bị suy tim sung huyết hoặc suy tim không?', options: ['Có', 'Không', 'Không biết'], section: 'kidney' },
  { id: 16, question: 'Ông/Bà có bị bệnh lý mạch máu ngoại biên (hẹp, tắc động mạch ở tay, chân,...) không?', options: ['Có', 'Không', 'Không biết'], section: 'kidney' },
  { id: 17, question: 'Ông/Bà có tiều đạm (protein/albumin niệu)?', options: ['Có', 'Không', 'Không biết'], section: 'kidney' },
];

const sections = [
  { id: 'general', title: 'Thông tin chung', color: 'bg-green-500' },
  { id: 'cardiovascular', title: 'Bệnh lý tim mạch do xơ vữa', color: 'bg-green-500' },
  { id: 'kidney', title: 'Đánh giá nguy cơ thận', color: 'bg-green-500' },
  { id: 'lab', title: 'Chỉ số từ kết quả xét nghiệm', color: 'bg-green-500' },
];

const CardiovascularAssessmentPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [ageInput, setAgeInput] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const [labResults, setLabResults] = useState<{
    cholesterol: LabResult;
    hdlc: LabResult;
    systolicBP: LabResult;
  }>({
    cholesterol: { mmolL: '', mgdL: '', unknown: false },
    hdlc: { mmolL: '', mgdL: '', unknown: false },
    systolicBP: { mmolL: '', mgdL: '', unknown: false },
  });
  const [, setLocation] = useLocation();

  // Filter questions by current section
  const currentSectionQuestions = questions.filter(q => q.section === sections[currentSection].id);
  const totalQuestions = questions.length + 3; // +3 for lab results

  const handleAnswer = (answer: string, questionId?: number) => {
    const questionIdToUse = questionId || currentQuestion;
    setAnswers((prev) => ({ ...prev, [questionIdToUse]: answer }));
    
    // Logic for diabetes question
    if (questionIdToUse === 4 && (answer === 'Không' || answer === 'Không biết')) {
      setAnswers((prev) => ({ ...prev, [5]: '' })); // Clear diabetes duration answer
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      // Validate current section before proceeding
      if (!validateCurrentSection()) {
        alert('Vui lòng trả lời tất cả các câu hỏi trong phần này trước khi tiếp tục');
        return;
      }
      setCurrentSection((prev) => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Validate age input before completing
      if (!ageInput || parseInt(ageInput) < 1) {
        alert('Vui lòng nhập tuổi hợp lệ');
        return;
      }
      // Validate lab results section
      if (!validateLabResults()) {
        alert('Vui lòng nhập thông tin hoặc chọn "Không biết" cho tất cả các chỉ số xét nghiệm');
        return;
      }
      setShowResults(true);
    }
  };

  const validateCurrentSection = () => {
    const currentSectionQuestions = questions.filter(q => q.section === sections[currentSection].id);
    
    for (const question of currentSectionQuestions) {
      if (question.id === 2) {
        // Age question - check if ageInput is filled
        if (!ageInput || parseInt(ageInput) < 1) {
          return false;
        }
      } else if (question.id === 5) {
        // "Mắc đái tháo đường trên 10 năm" - only required if diabetes is "Có"
        if (answers[4] === 'Có' && !answers[question.id]) {
          return false;
        }
        // If diabetes is "Không" or "Không biết", this question is not required
      } else {
        // Other questions - check if answer is selected
        if (!answers[question.id]) {
          return false;
        }
      }
    }
    return true;
  };

  const validateLabResults = () => {
    const { cholesterol, hdlc, systolicBP } = labResults;
    
    // Check if each lab result has either a value or is marked as unknown
    const cholesterolValid = (cholesterol.mmolL !== '' || cholesterol.mgdL !== '') || cholesterol.unknown;
    const hdlcValid = (hdlc.mmolL !== '' || hdlc.mgdL !== '') || hdlc.unknown;
    const systolicBPValid = systolicBP.mmolL !== '' || systolicBP.unknown;
    
    return cholesterolValid && hdlcValid && systolicBPValid;
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setCurrentQuestion(0);
    }
  };

  const handleCancel = () => {
    setLocation('/kiem-tra-suc-khoe');
  };

  const handleRestart = () => {
    setCurrentSection(0);
    setCurrentQuestion(0);
    setAnswers({});
    setAgeInput('');
    setShowResults(false);
    setLabResults({
      cholesterol: { mmolL: '', mgdL: '', unknown: false },
      hdlc: { mmolL: '', mgdL: '', unknown: false },
      systolicBP: { mmolL: '', mgdL: '', unknown: false },
    });
  };

  const handleLabResultChange = (type: 'cholesterol' | 'hdlc' | 'systolicBP', field: 'mmolL' | 'mgdL', value: string) => {
    setLabResults(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
        // Clear the other field when one is filled
        [field === 'mmolL' ? 'mgdL' : 'mmolL']: '',
        unknown: false,
      }
    }));
  };

  const handleLabUnknown = (type: 'cholesterol' | 'hdlc' | 'systolicBP') => {
    setLabResults(prev => ({
      ...prev,
      [type]: {
        mmolL: '',
        mgdL: '',
        unknown: true,
      }
    }));
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  // Risk Assessment Logic
  const calculateRisk = () => {
    const age = parseInt(ageInput) || 0;
    const diabetes = answers[4];
    const diabetesDuration = answers[5];
    const hypertension = answers[6];
    const dyslipidemia = answers[7];
    const smoking = answers[3];
    
    // Age-based risk (only for people > 40)
    if (age >= 40) {
      let riskScore = 0;
      
      // Age risk
      if (age >= 40 && age < 50) riskScore += 1;
      else if (age >= 50 && age < 60) riskScore += 2;
      else if (age >= 60 && age < 70) riskScore += 3;
      else if (age >= 70) riskScore += 4;
      
      // Diabetes risk
      if (diabetes === 'Có') {
        riskScore += 2;
        if (diabetesDuration === 'Có') riskScore += 1; // Additional risk for long-term diabetes
      }
      
      // Hypertension risk
      if (hypertension === 'Có') riskScore += 1;
      
      // Dyslipidemia risk
      if (dyslipidemia === 'Có') riskScore += 1;
      
      // Smoking risk
      if (smoking === 'Có') riskScore += 1;
      
      // Cardiovascular disease history
      const cardiovascularAnswers = [8, 9, 10, 11, 12];
      const cardiovascularYes = cardiovascularAnswers.filter(qId => answers[qId] === 'Có').length;
      riskScore += cardiovascularYes * 2; // High risk for existing cardiovascular disease
      
      // Kidney disease risk
      const kidneyAnswers = [13, 14, 15, 16, 17];
      const kidneyYes = kidneyAnswers.filter(qId => answers[qId] === 'Có').length;
      riskScore += kidneyYes;
      
      return {
        score: riskScore,
        level: riskScore >= 5 ? 'high' : riskScore >= 3 ? 'moderate' : 'low',
        kidneyRisk: answers[13] === 'Có, suy giảm chức năng thận giai đoạn 3' || 
                   answers[13] === 'Có, suy giảm chức năng thận giai đoạn 4,5' ? 'high' : 'low'
      };
    } else {
      // For people < 40, only kidney risk assessment
      return {
        score: 0,
        level: 'low',
        kidneyRisk: answers[13] === 'Có, suy giảm chức năng thận giai đoạn 3' || 
                   answers[13] === 'Có, suy giảm chức năng thận giai đoạn 4,5' ? 'high' : 'low'
      };
    }
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
            › Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa › Kết quả kiểm tra
          </nav>

          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Kết quả kiểm tra
            </h2>

            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
              ĐÁNH GIÁ NGUY CƠ TIM MẠCH - THẬN
            </h1>

            {/* Illustration */}
            <div className="text-center mb-8">
              <ClipboardCheck className="w-16 h-16 text-blue-400 mx-auto" />
            </div>

            {/* Results Card */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              {/* Tình trạng */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tình trạng</h3>
                <p className="text-gray-700 mb-4">
                  {parseInt(ageInput) >= 40 ? (
                    <>
                      Dựa trên các thông tin bạn cung cấp, chúng tôi đã đánh giá nguy cơ tim mạch và thận của bạn.
                      {riskResult.level === 'high' && (
                        <> Bạn có nguy cơ <span className="text-black font-bold">CAO</span> mắc các bệnh tim mạch và thận.</>
                      )}
                      {riskResult.level === 'moderate' && (
                        <> Bạn có nguy cơ <span className="text-black font-bold">TRUNG BÌNH</span> mắc các bệnh tim mạch và thận.</>
                      )}
                      {riskResult.level === 'low' && (
                        <> Bạn có nguy cơ <span className="text-black font-bold">THẤP</span> mắc các bệnh tim mạch và thận.</>
                      )}
                    </>
                  ) : (
                    <>
                      Việc đánh giá yếu tố nguy cơ Tim mạch - Thận hiện chỉ đang áp dụng cho người &gt; 40 tuổi. 
                      Bạn hãy duy trì lối sống lành mạnh, và tham khảo lời khuyên ở cuối trang để giảm nguy cơ bị mắc bệnh Tim mạch - Thận trong tương lai.
                    </>
                  )}
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Nguy cơ thận:</strong> {parseInt(ageInput) >= 40 ? (
                    riskResult.kidneyRisk === 'high' ? (
                      <>Có nguy cơ <span className="text-black font-bold">bệnh thận mạn hiện tại</span></>
                    ) : (
                      <>Không có nguy cơ <span className="text-black font-bold">bệnh thận mạn hiện tại</span></>
                    )
                  ) : (
                    <>Không có nguy cơ <span className="text-black font-bold">bệnh thận mạn hiện tại</span></>
                  )}
                </p>
                
                <p className="text-gray-700">
                  Ông/bà hãy liên hệ bác sĩ để được tư vấn thêm thông tin.
                </p>
              </div>

              {/* Khuyến nghị */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Khuyến nghị</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Thuốc lá:</strong> Ngừng/không hút thuốc
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Chế độ ăn:</strong> nhiều rau củ quả, cá, ngũ cốc nguyên cám, chất béo không bão hòa và hạn chế chất béo bão hòa, giảm muối
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Hoạt động thể chất:</strong> tập thể dục với cường độ vừa phải từ 150 đến 300 phút mỗi tuần, hoặc hoạt động thể dục cường độ mạnh từ 75 đến 150 phút mỗi tuần, hoặc kết hợp cả hai một cách hợp lý
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Cân nặng:</strong> giảm cân ở người thừa cân béo phì, giảm lượng năng lượng nạp vào ở người mắc đái tháo đường để giảm cân, làm chậm hoặc ngăn ngừa tăng cân. Giảm cân sẽ giúp giảm huyết áp, giảm rối loạn lipid máu, và nguy cơ mắc đái tháo đường típ 2, qua đó làm giảm nguy cơ tim mạch.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="px-6 py-3 text-xl font-semibold"
              >
                Làm lại đánh giá
              </Button>
              <Button
                onClick={() => setLocation('/')}
                className="px-6 py-3 text-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
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
          › Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa
        </nav>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa
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
              assessmentId="cardiovascular"
              assessmentName="Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa"
              evidence={assessmentEvidenceData.cardiovascular.evidence}
              reliability={assessmentEvidenceData.cardiovascular.reliability}
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="w-full h-3 bg-gray-200" />
            <p className="text-right text-sm text-gray-600 mt-2">
              Bước {currentSection + 1} / {sections.length}
            </p>
          </div>

          {/* Section Header */}
          <div className="text-center mb-8">
            <div className={`${sections[currentSection].color} text-white p-4 rounded-lg w-full max-w-4xl mx-auto`}>
              <h2 className="text-xl font-bold text-center">
                {sections[currentSection].title}
              </h2>
            </div>
          </div>

          {/* Questions */}
          {sections[currentSection].id !== 'lab' ? (
            <div className="space-y-6">
              {currentSectionQuestions.map((question) => (
                <div key={question.id} className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {question.question}
                  </h3>
                  
                  {/* Special handling for gender dropdown */}
                  {question.id === 1 ? (
                    <select
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(e.target.value, question.id)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Giới tính</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : question.id === 2 ? (
                    /* Special handling for age input */
                    <input
                      type="number"
                      placeholder="Tuổi"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    /* Regular button options */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {question.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className={`p-4 h-auto text-center font-semibold text-lg whitespace-normal break-words ${
                            answers[question.id] === option
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-300'
                          } ${
                            question.id === 5 && (answers[4] === 'Không' || answers[4] === 'Không biết')
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          onClick={() => {
                            if (!(question.id === 5 && (answers[4] === 'Không' || answers[4] === 'Không biết'))) {
                              handleAnswer(option, question.id);
                            }
                          }}
                          disabled={question.id === 5 && (answers[4] === 'Không' || answers[4] === 'Không biết')}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Lab Results Section */
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Chỉ số từ kết quả xét nghiệm
              </h3>
              
              {/* Cholesterol */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Cholesterol toàn phần</h4>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-1">Đơn vị mmol/L khoảng 0-10.3</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10.3"
                      placeholder="Vui lòng nhập thông tin"
                      value={labResults.cholesterol.mmolL}
                      onChange={(e) => handleLabResultChange('cholesterol', 'mmolL', e.target.value)}
                      disabled={labResults.cholesterol.mgdL !== '' || labResults.cholesterol.unknown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-1">Đơn vị mg/dL khoảng 0 - 397.7</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="397.7"
                      placeholder="Vui lòng nhập thông tin"
                      value={labResults.cholesterol.mgdL}
                      onChange={(e) => handleLabResultChange('cholesterol', 'mgdL', e.target.value)}
                      disabled={labResults.cholesterol.mmolL !== '' || labResults.cholesterol.unknown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => handleLabUnknown('cholesterol')}
                      className={`font-semibold text-lg ${labResults.cholesterol.unknown ? 'bg-gray-100' : ''}`}
                    >
                      Không biết
                    </Button>
                  </div>
                </div>
              </div>

              {/* HDL-C */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">HDL-C</h4>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-1">Đơn vị mmol/L khoảng 0-4</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      placeholder="Vui lòng nhập thông tin"
                      value={labResults.hdlc.mmolL}
                      onChange={(e) => handleLabResultChange('hdlc', 'mmolL', e.target.value)}
                      disabled={labResults.hdlc.mgdL !== '' || labResults.hdlc.unknown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-1">Đơn vị mg/dL khoảng 0-155.5</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="155.5"
                      placeholder="Vui lòng nhập thông tin"
                      value={labResults.hdlc.mgdL}
                      onChange={(e) => handleLabResultChange('hdlc', 'mgdL', e.target.value)}
                      disabled={labResults.hdlc.mmolL !== '' || labResults.hdlc.unknown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => handleLabUnknown('hdlc')}
                      className={`font-semibold text-lg ${labResults.hdlc.unknown ? 'bg-gray-100' : ''}`}
                    >
                      Không biết
                    </Button>
                  </div>
                </div>
              </div>

              {/* Systolic BP */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Huyết áp tâm thu</h4>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-1">Đơn vị mmHg khoảng 0-200</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      placeholder="Vui lòng nhập thông tin"
                      value={labResults.systolicBP.mmolL}
                      onChange={(e) => handleLabResultChange('systolicBP', 'mmolL', e.target.value)}
                      disabled={labResults.systolicBP.unknown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => handleLabUnknown('systolicBP')}
                      className={`font-semibold text-lg ${labResults.systolicBP.unknown ? 'bg-gray-100' : ''}`}
                    >
                      Không biết
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-8 py-4 text-xl font-semibold"
            >
              Hủy
            </Button>
            
            <div className="space-x-4">
              {currentSection > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-8 py-4 text-xl font-semibold"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Quay lại
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {currentSection === sections.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CardiovascularAssessmentPage;
