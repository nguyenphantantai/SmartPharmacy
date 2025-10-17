import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EvidenceDisplay from "@/components/evidence-display";
import { 
  Brain,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { assessmentEvidenceData } from "@/data/assessment-evidence";

export default function TNmindtest() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Images, setStep1Images] = useState<string[]>([]);
  const [step1CurrentImage, setStep1CurrentImage] = useState(0);
  const [step1Timer, setStep1Timer] = useState(3);
  const [step1Started, setStep1Started] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  
  const [step2VideoPlaying, setStep2VideoPlaying] = useState(false);
  const [step2VideoCompleted, setStep2VideoCompleted] = useState(false);
  const [step2Answer, setStep2Answer] = useState<string>("");
  const [step2SelectedVideo, setStep2SelectedVideo] = useState<string>("");
  const [step2Question, setStep2Question] = useState({
    question: "",
    options: [""],
    correct: ""
  });
  
  const [step3Images, setStep3Images] = useState<string[]>([]);
  const [step3CurrentImage, setStep3CurrentImage] = useState(0);
  const [step3SelectedImages, setStep3SelectedImages] = useState<number[]>([]);
  const [step3Timer, setStep3Timer] = useState(3);
  const [step3Started, setStep3Started] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  
  const [testResults, setTestResults] = useState({
    accuracy: 0,
    riskLevel: "Nguy cơ thấp",
    correctAnswers: 0,
    totalQuestions: 15
  });
  
  // Form thông tin
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: ""
  });
  const [showResults, setShowResults] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: ""
  });

  const step1IntervalRef = useRef<NodeJS.Timeout | null>(null);
  const step3IntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dữ liệu hình ảnh cho bước 1 và 3
  const allImages = [
    // 15 hình ảnh chính để ghi nhớ
    "/images/test-images/BinhMinh.jpg",
    "/images/test-images/cat.jpg",
    "/images/test-images/chimcanhcut.jpg",
    "/images/test-images/dau.jpg",
    "/images/test-images/DenGiaoThong.jpg",
    "/images/test-images/dianhac.jpg",
    "/images/test-images/dog.jpg",
    "/images/test-images/goi.jpg",
    "/images/test-images/Hoa.jpg",
    "/images/test-images/hoanghon.jpg",
    "/images/test-images/nam.jpg",
    "/images/test-images/nui.jpg",
    "/images/test-images/phongcanh.jpg",
    "/images/test-images/shark.jpg",
    "/images/test-images/suoi.jpg",
    // 5 hình ảnh nhiễu
    "/images/test-images/distractor-1.jpg",
    "/images/test-images/distractor-2.jpg",
    "/images/test-images/distractor-3.jpg",
    "/images/test-images/distractor-4.jpg",
    "/images/test-images/distractor-5.jpg"
  ];

  // Khởi tạo dữ liệu test
  useEffect(() => {
    // Chọn ngẫu nhiên 15 hình ảnh từ 20 hình cho bước 1
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    const selected15Images = shuffled.slice(0, 15); // Chọn 15 hình đầu sau khi shuffle
    setStep1Images(selected15Images);
    console.log("Step 1 images (15 selected from 20):", selected15Images.length, selected15Images);
    
    // Tạo danh sách hình ảnh cho bước 3 (15 hình đã xem + 5 hình nhiễu)
    const remaining5Images = shuffled.slice(15, 20); // 5 hình còn lại làm nhiễu
    const step3Shuffled = [...selected15Images, ...remaining5Images].sort(() => Math.random() - 0.5);
    setStep3Images(step3Shuffled);
    console.log("Step 3 images (15 seen + 5 distractors):", step3Shuffled.length, step3Shuffled);
    
    // Random chọn video và câu hỏi
    const videos = [
      {
        file: "tnmindtest-video.mp4",
        question: "Bé Trai nhỏ mặc quần màu gì?",
        options: ["A. Màu đen", "B. Màu Xanh dương", "C. Màu đỏ", "D. Màu nâu"],
        correct: "B. Màu Xanh dương"
      },
      {
        file: "tnmindtest-video2.mp4", 
        question: "Trong Video có bao nhiêu bé trai và bao nhiêu bé gái?",
        options: ["A. 1 bé Trai, 3 bé gái", "B. 3 Bé Trai, 1 bé gái", "C. 2 Bé trai, 2 Bé Gái", "D. 3 Bé Trai, 2 bé gái"],
        correct: "C. 2 Bé trai, 2 Bé Gái"
      }
    ];
    
    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    setStep2SelectedVideo(selectedVideo.file);
    setStep2Question({
      question: selectedVideo.question,
      options: selectedVideo.options,
      correct: selectedVideo.correct
    });
  }, []);

  // Bước 1: Hiển thị hình ảnh
  const startStep1 = () => {
    console.log("Starting Step 1 with", step1Images.length, "images");
    setStep1Started(true);
    setStep1CurrentImage(0);
    setStep1Timer(3);
    
    step1IntervalRef.current = setInterval(() => {
      setStep1Timer(prev => {
        if (prev <= 1) {
          // Sử dụng callback để lấy giá trị mới nhất của step1CurrentImage
          setStep1CurrentImage(currentImage => {
            console.log("Current image:", currentImage);
            // Kiểm tra xem đã hiển thị hết 15 hình chưa
            if (currentImage < 14) { // 0-14 = 15 hình
              console.log("Moving to next image:", currentImage + 1);
              return currentImage + 1;
            } else {
              // Đã hiển thị hết 15 hình, chuyển sang bước 2
              console.log("Step 1 completed, moving to step 2");
              setStep1Completed(true);
              setStep1Started(false);
              if (step1IntervalRef.current) {
                clearInterval(step1IntervalRef.current);
              }
              return currentImage; // Giữ nguyên giá trị
            }
          });
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Bước 2: Video và câu hỏi
  const handleStep2Answer = (answer: string) => {
    setStep2Answer(answer);
  };

  // Bước 3: Chọn hình ảnh
  const startStep3 = () => {
    setStep3Started(true);
    setStep3CurrentImage(0);
    setStep3Timer(3);
    
    step3IntervalRef.current = setInterval(() => {
      setStep3Timer(prev => {
        if (prev <= 1) {
          // Sử dụng callback để lấy giá trị mới nhất của step3CurrentImage
          setStep3CurrentImage(currentImage => {
            console.log("Step 3 current image:", currentImage);
            // Kiểm tra xem đã hiển thị hết 20 hình chưa
            if (currentImage < 19) { // 0-19 = 20 hình
              console.log("Moving to next image:", currentImage + 1);
              return currentImage + 1;
            } else {
              // Đã hiển thị hết 20 hình, nhưng không tự động chuyển sang bước 4
              // Chỉ dừng timer, người dùng có thể chọn hình hoặc nhấn "Tiếp tục"
              console.log("Step 3 completed showing all 20 images");
              setStep3Started(false);
              if (step3IntervalRef.current) {
                clearInterval(step3IntervalRef.current);
              }
              return currentImage; // Giữ nguyên giá trị
            }
          });
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStep3ImageClick = () => {
    if (!step3SelectedImages.includes(step3CurrentImage)) {
      const newSelectedImages = [...step3SelectedImages, step3CurrentImage];
      setStep3SelectedImages(newSelectedImages);
      
      // Kiểm tra nếu đã chọn đủ 15 hình thì chuyển sang bước 4
      if (newSelectedImages.length === 15) {
        setStep3Completed(true);
        setStep3Started(false);
        if (step3IntervalRef.current) {
          clearInterval(step3IntervalRef.current);
        }
      }
    }
  };

  const handleStep3KeyPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleStep3ImageClick();
    }
  };

  // Tính kết quả
  const calculateResults = () => {
    let correctCount = 0;
    
    // Kiểm tra câu hỏi video
    if (step2Answer === step2Question.correct) {
      correctCount += 1;
    }
    
    // Kiểm tra hình ảnh đã chọn trong bước 3
    // step3Images chứa 20 hình: 15 hình đã xem + 5 hình nhiễu
    // step1Images chứa 15 hình đã xem ở bước 1
    const correctImageIndices: number[] = [];
    
    // Tìm index của những hình đã xem ở bước 1 trong step3Images
    step1Images.forEach(step1Image => {
      const index = step3Images.findIndex(step3Image => step3Image === step1Image);
      if (index !== -1) {
        correctImageIndices.push(index);
      }
    });
    
    console.log("Correct image indices in step 3:", correctImageIndices);
    console.log("Selected images:", step3SelectedImages);
    
    // Đếm số hình đã chọn đúng
    const selectedCorrectImages = step3SelectedImages.filter(index => 
      correctImageIndices.includes(index)
    );
    
    correctCount += selectedCorrectImages.length;
    
    const accuracy = Math.round((correctCount / 16) * 100);
    const riskLevel = accuracy < 75 ? "Có dấu hiệu suy giảm" : "Tốt";
    
    setTestResults({
      accuracy,
      riskLevel,
      correctAnswers: correctCount,
      totalQuestions: 16
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setLocation("/kiem-tra-suc-khoe");
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setStep1Completed(false);
    setStep1Started(false);
    setStep2VideoCompleted(false);
    setStep2Answer("");
    setStep3Completed(false);
    setStep3Started(false);
    setStep3SelectedImages([]);
    setTestResults({
      accuracy: 0,
      riskLevel: "Nguy cơ thấp",
      correctAnswers: 0,
      totalQuestions: 16
    });
    setUserInfo({
      name: "",
      phone: "",
      email: "",
      gender: "",
      birthDate: ""
    });
    setShowResults(false);
    setFormErrors({
      name: "",
      phone: "",
      email: "",
      gender: "",
      birthDate: ""
    });
    
    // Random chọn lại video và câu hỏi
    const videos = [
      {
        file: "tnmindtest-video.mp4",
        question: "Bé Trai nhỏ mặc quần màu gì?",
        options: ["A. Màu đen", "B. Màu Xanh dương", "C. Màu đỏ", "D. Màu nâu"],
        correct: "B. Màu Xanh dương"
      },
      {
        file: "tnmindtest-video2.mp4", 
        question: "Trong Video có bao nhiêu bé trai và bao nhiêu bé gái?",
        options: ["A. 1 bé Trai, 3 bé gái", "B. 3 Bé Trai, 1 bé gái", "C. 2 Bé trai, 2 Bé Gái", "D. 3 Bé Trai, 2 bé gái"],
        correct: "C. 2 Bé trai, 2 Bé Gái"
      }
    ];
    
    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    setStep2SelectedVideo(selectedVideo.file);
    setStep2Question({
      question: selectedVideo.question,
      options: selectedVideo.options,
      correct: selectedVideo.correct
    });
  };

  // Xử lý form thông tin
  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return "Họ và tên không được để trống";
    if (name.trim().length < 2) return "Họ và tên phải có ít nhất 2 ký tự";
    if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s]+$/.test(name.trim())) {
      return "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Số điện thoại không được để trống";
    if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""))) {
      return "Số điện thoại phải có 10-11 chữ số";
    }
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(phone.replace(/\s/g, ""))) {
      return "Số điện thoại không đúng định dạng Việt Nam";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return ""; // Email is optional
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Email không đúng định dạng";
    }
    return "";
  };

  const validateGender = (gender: string): string => {
    if (!gender) return "Vui lòng chọn giới tính";
    return "";
  };

  const validateBirthDate = (birthDate: string): string => {
    if (!birthDate) return "Vui lòng chọn ngày sinh";
    
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      const actualAge = age - 1;
      if (actualAge < 12) return "Bạn phải từ 12 tuổi trở lên";
    } else {
      if (age < 12) return "Bạn phải từ 12 tuổi trở lên";
    }
    
    if (birth > today) return "Ngày sinh không thể là ngày tương lai";
    
    return "";
  };

  const validateForm = (): boolean => {
    const errors = {
      name: validateName(userInfo.name),
      phone: validatePhone(userInfo.phone),
      email: validateEmail(userInfo.email),
      gender: validateGender(userInfo.gender),
      birthDate: validateBirthDate(userInfo.birthDate)
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error !== "");
  };

  const handleSubmitInfo = () => {
    if (validateForm()) {
      calculateResults();
      setShowResults(true);
    }
  };

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (step1IntervalRef.current) {
        clearInterval(step1IntervalRef.current);
      }
      if (step3IntervalRef.current) {
        clearInterval(step3IntervalRef.current);
      }
    };
  }, []);

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
            <span className="text-gray-900 font-medium">Trí nhớ và mức độ tập trung chú ý TNmindtest</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CÁC BƯỚC THỰC HIỆN</h1>
          </div>
          <h2 className="text-2xl font-bold text-blue-600">TNmindtest</h2>
        </div>

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
              assessmentId="tnmindtest"
              assessmentName="Trí nhớ và mức độ tập trung chú ý TNmindtest"
              evidence={assessmentEvidenceData.tnmindtest.evidence}
              reliability={assessmentEvidenceData.tnmindtest.reliability}
            />
          </div>
        )}

        {/* Step Navigation */}
        <div className="flex justify-center items-center mb-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentStep === 4}
            className="ml-4"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  BƯỚC 1: XEM VÀ GHI NHỚ 15 HÌNH ẢNH
                </h3>
                <p className="text-gray-600 mb-6">
                  mỗi bức hình xuất hiện trong 3 giây.
                </p>
                
                {!step1Started && !step1Completed && (
                  <Button
                    onClick={startStep1}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Bắt đầu
                  </Button>
                )}
                
                {step1Started && !step1Completed && (
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {step1Timer}
                    </div>
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                      {step1Images[step1CurrentImage] ? (
                        <img
                          src={step1Images[step1CurrentImage]}
                          alt={`Hình ${step1CurrentImage + 1}`}
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="text-center text-gray-500">
                                  <div class="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-4xl">📷</span>
                                  </div>
                                  <p class="text-lg font-medium">Hình ${step1CurrentImage + 1}</p>
                                  <p class="text-sm">Hình ảnh sẽ được thêm vào thư mục public/images/test-images/</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">📷</span>
                          </div>
                          <p className="text-lg font-medium">Hình {step1CurrentImage + 1}</p>
                          <p className="text-sm">Hình ảnh không tồn tại</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Hình {step1CurrentImage + 1}/15
                    </div>
                  </div>
                )}
                
                {step1Completed && (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-green-600 mb-2">
                      Hoàn thành bước 1!
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Bạn đã xem xong 15 hình ảnh. Hãy nhớ những hình ảnh này để làm bài test tiếp theo.
                    </p>
                    <Button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Tiếp tục
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  BƯỚC 2: XEM MỘT ĐOẠN VIDEO 20 GIÂY
                </h3>
                <p className="text-gray-600 mb-6">
                  và trả lời một câu hỏi.
                </p>
                
                {!step2VideoCompleted ? (
                  <div className="space-y-4">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                      <video 
                        controls 
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                        onEnded={() => setStep2VideoCompleted(true)}
                      >
                        <source src={`/videos/${step2SelectedVideo}`} type="video/mp4" />
                        <div className="text-center text-gray-500">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Play className="w-16 h-16 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium mb-2">Video 20 giây</p>
                          <p className="text-sm">Trình duyệt không hỗ trợ video</p>
                        </div>
                      </video>
                    </div>
                    
                    <div className="text-gray-600 mb-4">
                      <p className="text-lg font-medium mb-2">Hướng dẫn:</p>
                      <p className="text-sm">Nhấn nút "Phát video" để xem video 20 giây</p>
                      <p className="text-sm">Sau khi xem hết video, câu hỏi sẽ xuất hiện</p>
                    </div>
                    
                    <Button
                      onClick={() => {
                        const video = document.querySelector('video') as HTMLVideoElement;
                        if (video) {
                          video.play();
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      Phát video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                        <span className="text-lg font-medium text-green-700">Đã xem hết video!</span>
                      </div>
                      <p className="text-sm text-green-600">Bây giờ hãy trả lời câu hỏi bên dưới</p>
                    </div>
                  </div>
                )}
                
                {step2VideoCompleted && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      Câu hỏi: {step2Question.question}
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {step2Question.options.map((option, index) => {
                        const isSelected = step2Answer === option;
                        const isCorrect = option === step2Question.correct;
                        const isWrong = isSelected && !isCorrect;
                        
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            disabled={step2Answer !== ""}
                            className={`h-16 text-lg ${
                              isCorrect && step2Answer
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : isWrong
                                ? 'bg-red-50 border-red-500 text-red-700'
                                : isSelected
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : step2Answer !== ""
                                ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 hover:border-blue-500'
                            }`}
                            onClick={() => handleStep2Answer(option)}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </div>
                    {step2Answer && (
                      <div className="mt-6">
                        <Button
                          onClick={handleNext}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                        >
                          Tiếp tục
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  BƯỚC 3: NHỚ LẠI & CHỌN 15 HÌNH ẢNH ĐÃ XEM Ở BƯỚC 1
                </h3>
                <p className="text-gray-600 mb-6">
                  Khi bạn thấy hình ảnh giống với hình ảnh đã xem ở bước 1, hãy nhấp chuột vào bất kỳ vị trí nào của ảnh hoặc nhấn vào phím cách trên bàn phím để chọn hình ảnh đó.
                </p>
                <p className="text-gray-600 mb-6">
                  Mỗi hình ảnh sẽ xuất hiện trong vòng 3 giây trước khi chuyển qua ảnh khác.
                </p>
                
                {!step3Started && !step3Completed && (
                  <Button
                    onClick={startStep3}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Bắt đầu
                  </Button>
                )}
                
                {step3Started && !step3Completed && (
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {step3Timer}
                    </div>
                    <div 
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer"
                      onClick={handleStep3ImageClick}
                      onKeyDown={handleStep3KeyPress}
                      tabIndex={0}
                    >
                      <img
                        src={step3Images[step3CurrentImage]}
                        alt={`Hình ${step3CurrentImage + 1}`}
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center text-gray-500">
                                <div class="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                  <span class="text-4xl">📷</span>
                                </div>
                                <p class="text-lg font-medium">Hình ${step3CurrentImage + 1}</p>
                                <p class="text-sm">Hình ảnh sẽ được thêm vào thư mục public/images/test-images/</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Đã chọn: {step3SelectedImages.length}/15
                    </div>
                    <div className="text-xs text-gray-500">
                      Nhấp chuột vào hình hoặc nhấn phím cách để chọn
                    </div>
                  </div>
                )}
                
                {!step3Started && !step3Completed && step3CurrentImage === 19 && (
                  <div className="text-center">
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-yellow-600 mr-2" />
                        <span className="text-lg font-medium text-yellow-700">Đã xem hết 20 hình!</span>
                      </div>
                      <p className="text-sm text-yellow-600 mb-4">
                        Bạn đã chọn {step3SelectedImages.length}/15 hình ảnh.
                      </p>
                      {step3SelectedImages.length < 15 ? (
                        <p className="text-sm text-yellow-600">
                          Bạn cần chọn thêm {15 - step3SelectedImages.length} hình nữa để hoàn thành.
                        </p>
                      ) : (
                        <p className="text-sm text-green-600 font-medium">
                          Bạn đã chọn đủ 15 hình! Nhấn "Tiếp tục" để chuyển sang bước tiếp theo.
                        </p>
                      )}
                    </div>
                    
                    {step3SelectedImages.length === 15 && (
                      <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                      >
                        Tiếp tục
                      </Button>
                    )}
                  </div>
                )}
                
                {step3Completed && (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-green-600 mb-2">
                      Hoàn thành bước 3!
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Bạn đã chọn {step3SelectedImages.length}/15 hình ảnh.
                    </p>
                    {step3SelectedImages.length === 15 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                      >
                        Tiếp tục
                      </Button>
                    ) : (
                      <div className="text-red-600 mb-4">
                        <p className="text-lg font-medium">Bạn cần chọn đủ 15 hình ảnh!</p>
                        <p className="text-sm">Hiện tại bạn đã chọn {step3SelectedImages.length} hình</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && !showResults && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Điền thông tin của bạn để nhận kết quả TNmindtest
                </h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng điền thông tin để nhận kết quả và khuyến nghị chăm sóc sức khỏe não bộ
                </p>
                
                {/* Form thông tin */}
                <div className="bg-white rounded-lg p-8 mb-6 max-w-lg mx-auto shadow-lg">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => handleUserInfoChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập số điện thoại"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Email (Tùy chọn)
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleUserInfoChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Giới tính *
                      </label>
                      <select
                        value={userInfo.gender}
                        onChange={(e) => handleUserInfoChange('gender', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      {formErrors.gender && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Ngày sinh *
                      </label>
                      <input
                        type="date"
                        value={userInfo.birthDate}
                        onChange={(e) => handleUserInfoChange('birthDate', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.birthDate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      onClick={handleSubmitInfo}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                    >
                      Đăng ký
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && showResults && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  KẾT QUẢ TNmindtest
                </h3>
                <p className="text-gray-600 mb-6">
                  Kết quả đánh giá trí nhớ và mức độ tập trung chú ý của bạn
                </p>
                
                {/* Results Card */}
                <div className="bg-white rounded-lg p-8 mb-6 shadow-lg">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kết quả kiểm tra
                    </h2>
                    <div className={`text-3xl font-bold mb-4 ${
                      testResults.accuracy >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      CHÍNH XÁC {testResults.accuracy}% - {testResults.riskLevel.toUpperCase()}
                    </div>
                    
                    {/* Doctor illustration placeholder */}
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">👨‍⚕️</span>
                    </div>
                  </div>
                  
                  {/* Tình trạng */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tình trạng</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {testResults.accuracy >= 75 
                        ? "Kết quả này cho thấy khả năng ghi nhớ và tập trung của bạn đang ở mức tốt. Hãy tiếp tục duy trì các thói quen tích cực để cải thiện thêm trí nhớ và sự tập trung."
                        : "Kết quả này cho thấy khả năng ghi nhớ và tập trung của bạn đang có dấu hiệu suy giảm. Đây có thể là biểu hiện ban đầu của rối loạn trí nhớ hoặc liên quan đến căng thẳng, thiếu ngủ, tuổi tác hoặc các yếu tố môi trường."
                      }
                    </p>
                  </div>
                  
                  {/* Lời khuyên */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Lời khuyên dành cho bạn</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>Nên sắp xếp thời gian khám chuyên khoa nội thần kinh hoặc tâm thần kinh nếu tình trạng quên và mất tập trung chú ý kéo dài hoặc ảnh hưởng đến công việc, sinh hoạt...</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>Tạm thời, bạn có thể cải thiện trí nhớ bằng cách:</span>
                      </li>
                      <li className="ml-6 space-y-2">
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span>Ngủ đủ giấc (7-8 tiếng mỗi ngày)</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span>Giảm căng thẳng, duy trì tâm trạng tích cực</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span>Tập thể dục nhẹ, vận động đều đặn</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span>Tham gia các hoạt động kích thích và luyện tập trí não như đọc sách, học ngoại ngữ, chơi ô chữ, đánh cờ...</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span>Có thể tham khảo các sản phẩm hỗ trợ tuần hoàn não và trí nhớ, như: Ginkgo biloba chuẩn hóa- chiết xuất từ cây bạch quả có nghiên cứu hỗ trợ cải thiện tuần hoàn máu não, tăng cường tập trung chú ý & trí nhớ</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Các thông tin trên mang tính chất tham khảo, để biết rõ về tình trạng liên quan đến trí não và mức độ tập trung chú ý, hãy liên hệ với bác sĩ, dược sĩ để được tư vấn chi tiết cụ thể.
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-x-4">
                  <Button
                    onClick={handleRestart}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Làm lại bài test
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
          </CardContent>
        </Card>

        {/* Cancel Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-gray-600"
          >
            Hủy
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
