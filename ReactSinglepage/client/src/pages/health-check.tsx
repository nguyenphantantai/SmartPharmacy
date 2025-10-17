import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Leaf, 
  Brain, 
  Hand, 
  User, 
  Activity,
  Stethoscope,
  Shield,
  AlertCircle,
  Wind,
  Pill,
  CircleDot,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function HealthCheck() {
  const [, setLocation] = useLocation();
  
  const healthChecks = [
    {
      id: 1,
      icon: Wind,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      title: "Đánh giá nguy cơ mắc bệnh hen",
      description: "Kiểm tra nguy cơ mắc bệnh hen phế quản"
    },
    {
      id: 2,
      icon: Wind,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      title: "Đánh giá nguy cơ mắc bệnh phổi tắc nghẽn mạn tính (COPD)",
      description: "Kiểm tra nguy cơ COPD và các vấn đề hô hấp mạn tính"
    },
    {
      id: 3,
      icon: Pill,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      title: "Đánh giá nguy cơ lạm dụng thuốc cắt cơn hen",
      description: "Kiểm tra nguy cơ lạm dụng thuốc điều trị hen"
    },
    {
      id: 4,
      icon: CircleDot,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      title: "Đánh giá nguy cơ mắc bệnh trào ngược dạ dày thực quản (GERD)",
      description: "Kiểm tra nguy cơ GERD và các vấn đề tiêu hóa"
    },
    {
      id: 5,
      icon: Heart,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50",
      title: "Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa",
      description: "Kiểm tra nguy cơ các bệnh tim mạch, thận và rối loạn chuyển hóa"
    },
    {
      id: 6,
      icon: Leaf,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      title: "Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng",
      description: "Kiểm tra nguy cơ viêm mũi dị ứng và các vấn đề hô hấp"
    },
    {
      id: 7,
      icon: Brain,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      title: "Trí nhớ và mức độ tập trung chú ý TNmindtest",
      description: "Đánh giá khả năng nhận thức và tập trung"
    },
    {
      id: 8,
      icon: Hand,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      title: "Đánh giá nguy cơ mắc bệnh nấm da",
      description: "Kiểm tra nguy cơ các bệnh nấm da và vấn đề da liễu"
    },
    {
      id: 9,
      icon: User,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      title: "Đánh giá mức độ cương cứng của dương vật IIEF-5 (SHIM)",
      description: "Kiểm tra chức năng sinh lý nam giới"
    }
  ];

  const handleHealthCheck = (checkId: number) => {
    // Navigate to specific health check based on ID
    switch (checkId) {
      case 1: // Hen phế quản
        setLocation("/danh-gia-nguy-co-mac-benh-hen");
        break;
      case 2: // COPD
        setLocation("/danh-gia-nguy-co-mac-benh-phoi-tac-nghen-man-tinh");
        break;
      case 3: // Lạm dụng thuốc cắt cơn hen
        setLocation("/danh-gia-nguy-co-lam-dung-thuoc-cat-con-hen");
        break;
      case 4: // GERD
        setLocation("/danh-gia-nguy-co-mac-benh-trao-nguoc-da-day");
        break;
      case 5: // Tim mạch - Thận - Chuyển hóa
        setLocation("/danh-gia-yeu-to-nguy-co-tim-mach-than-chuyen-hoa");
        break;
      case 6: // Viêm mũi dị ứng
        setLocation("/danh-gia-nguy-co-mac-benh-viem-mui-di-ung");
        break;
      case 7: // TNmindtest
        setLocation("/huong-dan-tnmindtest");
        break;
      case 8: // Nấm da
        setLocation("/danh-gia-nguy-co-mac-benh-nam-da");
        break;
      case 9: // IIEF-5 (SHIM)
        setLocation("/danh-gia-muc-do-cuong-cung-duong-vat-iief5");
        break;
      default:
        console.log("Starting health check:", checkId);
        break;
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
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
            <span className="text-gray-900 font-medium">Kiểm tra sức khỏe</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kiểm tra sức khỏe</h1>

        {/* Health Check Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {healthChecks.map((check) => {
            const IconComponent = check.icon;
            return (
              <Card 
                key={check.id} 
                className={`${check.bgColor} hover:shadow-lg transition-shadow cursor-pointer border-0`}
                onClick={() => handleHealthCheck(check.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-white shadow-sm flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${check.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-2 font-medium">Kiểm tra</div>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {check.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Health Check Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kiểm tra sức khỏe</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Chào mừng bạn đến với tính năng Kiểm tra Sức Khỏe của Nhà thuốc thông minh! 
              Chỉ với vài phút trả lời các câu hỏi tầm soát về những vấn đề như hen, bệnh phổi tắc nghẽn mạn tính, 
              nguy cơ lạm dụng thuốc cắt cơn trong điều trị hen, trào ngược dạ dày thực quản, bạn sẽ nhận được 
              các đánh giá bước đầu và những lời khuyên hữu ích để đảm bảo sức khỏe tốt. Đây là một trong những 
              cách để bạn hiểu thêm về tình trạng cơ thể, qua đó biết cách ngăn ngừa bệnh và có các hành động kịp thời. 
              Hãy khám phá ngay tính năng này và bắt đầu hành trình bảo vệ sức khỏe cho bạn và gia đình!
            </p>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Miễn trừ trách nhiệm</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Các thông tin tại công cụ tầm soát này mang tính chất tham khảo và không thể thay thế 
              việc chẩn đoán và điều trị của bác sĩ chuyên khoa. Vui lòng liên hệ với bác sĩ, 
              dược sĩ hoặc chuyên gia y tế để được tư vấn cụ thể và chi tiết về tình trạng hoặc 
              nguy cơ bệnh của bạn. Nếu bạn cho rằng mình đang trong tình huống khẩn cấp, 
              vui lòng liên hệ với bác sĩ ngay lập tức.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Nhà thuốc thông minh cam kết đồng hành cùng bạn trong hành trình sống khỏe. 
              Sứ mệnh của chúng tôi là giúp mọi người dễ dàng tiếp cận các công cụ chăm sóc 
              sức khỏe hiện đại, mang đến giải pháp phòng ngừa chủ động và cải thiện sức khỏe toàn diện.
            </p>
            <p className="text-base text-gray-700 font-medium">
              Nhà thuốc thông minh – vì một cuộc sống khỏe mạnh và hạnh phúc cho tất cả!
            </p>
          </div>
        </div>

        {/* References Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài liệu tham khảo</h2>
          <div className="prose prose-gray max-w-none">
            <ol className="text-base text-gray-700 space-y-2">
              <li>
                <a 
                  href="https://vilaphoikhoe.kcb.vn/lam-the-nao-phat-hien-som-hen-phe-quan/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Làm thế nào phát hiện sớm hen phế quản – Vì lá phổi khỏe
                </a>
              </li>
              <li>
                <a 
                  href="https://vilaphoikhoe.kcb.vn/lam-the-nao-phat-hien-som-benh-phoi-tac-nghen-man-tinh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Làm thế nào phát hiện sớm bệnh phổi tắc nghẽn mạn tính – Vì lá phổi khỏe
                </a>
              </li>
              <li>
                <a 
                  href="https://www.hoihohapvietnam.org/detail/2677/huong-dan-chan-doan-va-dieu-tri-benh-phoi-tac-nghen-man-tinh-2024.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Hướng dẫn chẩn đoán và điều trị Bệnh phổi tắc nghẽn mạn tính (2024)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ipcrg.org/SABA_Reliance_Questionnaire_publication" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  SABA Reliance Questionnaire publication in the Journal of Allergy and Clinical Immunology: In Practice | IPCRG
                </a>
              </li>
              <li>
                <a 
                  href="https://gerdq.celebratelifeprogram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  GerdQ - Gastroesophageal reflux disease
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
