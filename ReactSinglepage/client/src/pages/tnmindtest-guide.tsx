import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain,
  ArrowRight,
  Eye,
  Video,
  MousePointer,
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";

export default function TNmindtestGuide() {
  const [, setLocation] = useLocation();

  const steps = [
    {
      id: 1,
      icon: Eye,
      title: "BƯỚC 1: XEM VÀ GHI NHỚ 15 HÌNH ẢNH",
      description: "mỗi bức hình xuất hiện trong 3 giây.",
      details: "Bạn sẽ được xem 15 hình ảnh khác nhau, mỗi hình hiển thị trong 3 giây. Hãy tập trung quan sát và ghi nhớ những hình ảnh này để chuẩn bị cho bài test tiếp theo."
    },
    {
      id: 2,
      icon: Video,
      title: "BƯỚC 2: XEM MỘT ĐOẠN VIDEO 20 GIÂY",
      description: "và trả lời một câu hỏi.",
      details: "Bạn sẽ xem một video ngắn 20 giây và sau đó trả lời một câu hỏi liên quan đến nội dung video. Hãy chú ý quan sát các chi tiết trong video."
    },
    {
      id: 3,
      icon: MousePointer,
      title: "BƯỚC 3: NHỚ LẠI & CHỌN 15 HÌNH ẢNH ĐÃ XEM Ở BƯỚC 1",
      description: "Khi bạn thấy hình ảnh giống với hình ảnh đã xem ở bước 1, hãy nhấp chuột vào bất kỳ vị trí nào của ảnh hoặc nhấn vào phím cách trên bàn phím để chọn hình ảnh đó.",
      details: "Bạn sẽ được xem 20 hình ảnh (bao gồm 15 hình đã xem ở bước 1 và 5 hình mới). Hãy chọn những hình ảnh mà bạn đã thấy ở bước 1 bằng cách click chuột hoặc nhấn phím cách. Mỗi hình sẽ hiển thị trong 3 giây."
    },
    {
      id: 4,
      icon: BarChart3,
      title: "BƯỚC 4: NHẬN KẾT QUẢ TNmindtest",
      description: "và các hướng dẫn chăm sóc sức khoẻ não bộ bạn nhé.",
      details: "Sau khi hoàn thành test, bạn sẽ nhận được kết quả đánh giá khả năng trí nhớ và tập trung, cùng với các khuyến nghị chăm sóc sức khỏe não bộ phù hợp."
    }
  ];

  const handleStartTest = () => {
    setLocation("/tri-nho-va-muc-do-tap-trung-chu-y-tnmindtest");
  };

  const handleBack = () => {
    setLocation("/kiem-tra-suc-khoe");
  };

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

        {/* Introduction */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Chào mừng bạn đến với bài test trí nhớ và tập trung TNmindtest!
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Bài test này sẽ đánh giá khả năng ghi nhớ và tập trung của bạn thông qua 4 bước đơn giản. 
                Hãy đọc kỹ hướng dẫn dưới đây trước khi bắt đầu để đạt kết quả tốt nhất.
              </p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Đảm bảo bạn có đủ thời gian để hoàn thành bài test (khoảng 5-10 phút)</li>
                    <li>• Tìm một nơi yên tĩnh để tập trung tốt nhất</li>
                    <li>• Đảm bảo thiết bị của bạn có âm thanh để xem video</li>
                    <li>• Hãy làm bài test một cách trung thực để có kết quả chính xác</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps Guide */}
        <div className="max-w-4xl mx-auto space-y-6 mb-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={step.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-700 mb-3">
                        {step.description}
                      </p>
                      
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button
            onClick={handleStartTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Bắt đầu bài test
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Quay lại
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Thời gian hoàn thành:</h4>
                <p>Khoảng 5-10 phút tùy thuộc vào tốc độ của bạn</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Độ khó:</h4>
                <p>Phù hợp cho mọi lứa tuổi từ 18 tuổi trở lên</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kết quả:</h4>
                <p>Đánh giá nguy cơ và khuyến nghị chăm sóc sức khỏe não bộ</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Bảo mật:</h4>
                <p>Thông tin cá nhân được bảo mật tuyệt đối</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
