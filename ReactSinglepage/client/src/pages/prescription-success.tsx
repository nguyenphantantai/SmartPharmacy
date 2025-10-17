import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function PrescriptionSuccess() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleViewPrescription = () => {
    setLocation("/account/don-thuoc-cua-toi");
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Tiếp nhận đơn thuốc thành công
            </h1>
            <div className="space-y-4 text-gray-700">
              <p className="text-xl leading-relaxed">
                Dược sĩ sẽ liên hệ lại bạn trong thời gian sớm nhất.
              </p>
              <p className="text-base text-gray-600">
                Thông tin đơn thuốc hoàn toàn được bảo mật bởi Nhà thuốc thông minh
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={handleGoHome}
              variant="outline"
              size="lg"
              className="px-12 py-4 text-lg text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Về trang chủ
            </Button>
            <Button 
              onClick={handleViewPrescription}
              size="lg"
              className="px-12 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FileText className="w-5 h-5 mr-3" />
              Xem đơn thuốc
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
