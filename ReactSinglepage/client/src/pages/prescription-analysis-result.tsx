import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  ShoppingCart, 
  ArrowLeft,
  Package,
  DollarSign,
  Clock,
  User,
  Phone,
  MessageSquare,
  Star,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PrescriptionAnalysisResult as AnalysisResult, analyzePrescriptionImage } from "@/services/prescriptionAnalysis";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PrescriptionAnalysisResultPage() {
  const [, setLocation] = useLocation();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionImage, setPrescriptionImage] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Lấy hình ảnh đơn thuốc từ localStorage hoặc context
    const imageUrl = localStorage.getItem('currentPrescriptionImage') || "";
    const prescriptionText = localStorage.getItem('currentPrescriptionText') || "";
    setPrescriptionImage(imageUrl);
    
    const analyzePrescription = async () => {
      try {
        // Use backend AI analysis if available
        const response = await apiRequest('/consultation/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prescriptionText: prescriptionText,
            prescriptionImage: imageUrl
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setAnalysisResult(data.data);
        } else {
          // Fallback to frontend analysis
          const result = await analyzePrescriptionImage(imageUrl);
          setAnalysisResult(result);
        }
      } catch (error) {
        console.error('Error analyzing prescription:', error);
        // Fallback to frontend analysis
        try {
          const result = await analyzePrescriptionImage(imageUrl);
          setAnalysisResult(result);
        } catch (fallbackError) {
          console.error('Fallback analysis failed:', fallbackError);
          toast({
            title: "Lỗi",
            description: "Không thể phân tích đơn thuốc",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (imageUrl || prescriptionText) {
      analyzePrescription();
    } else {
      setLoading(false);
    }
  }, [toast]);

  const handleBackToOrder = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  const handleAddToCart = (medicineId: string) => {
    // TODO: Implement add to cart functionality
    console.log("Adding medicine to cart:", medicineId);
  };

  const handleRequestConsultation = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  const handleViewAllMedicines = () => {
    setLocation("/medicine");
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Đang phân tích đơn thuốc...
                  </h2>
                  <p className="text-gray-600">
                    Hệ thống đang xử lý và tìm kiếm thuốc phù hợp
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Không thể phân tích đơn thuốc
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng thử lại hoặc liên hệ tư vấn viên
                  </p>
                  <Button onClick={handleBackToOrder} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại đặt thuốc
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleBackToOrder}
                className="mr-4 p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kết quả phân tích đơn thuốc</h1>
                <p className="text-gray-600">Hệ thống đã phân tích và tìm kiếm thuốc phù hợp</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={
                analysisResult.requiresConsultation 
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-green-100 text-green-800 border-green-200"
              }>
                {analysisResult.requiresConsultation ? "Cần tư vấn" : "Có thể mua ngay"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analysis Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Tóm tắt phân tích</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-900">{analysisResult.foundMedicines.length}</div>
                      <div className="text-sm text-blue-700">Thuốc tìm thấy</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-900">
                        {analysisResult.totalEstimatedPrice.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className="text-sm text-green-700">Tổng ước tính</div>
                    </div>
                  </div>

                  {/* Analysis Notes */}
                  <div className="space-y-2">
                    {analysisResult.analysisNotes.map((note, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Found Medicines */}
              {analysisResult.foundMedicines.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Thuốc có sẵn</h2>
                      <Badge className="bg-green-100 text-green-800">
                        {analysisResult.foundMedicines.length} sản phẩm
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {analysisResult.foundMedicines.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={item.medicine.imageUrl}
                              alt={item.medicine.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/medicines/default.jpg";
                              }}
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    {item.medicine.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.medicine.activeIngredient} - {item.medicine.dosage}
                                  </p>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {item.medicine.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>Nhà sản xuất: {item.medicine.manufacturer}</span>
                                    <span>Còn: {item.medicine.stock} hộp</span>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900 mb-2">
                                    {item.medicine.price.toLocaleString('vi-VN')} ₫
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={
                                      item.confidence > 0.8 ? "bg-green-100 text-green-800" :
                                      item.confidence > 0.6 ? "bg-yellow-100 text-yellow-800" :
                                      "bg-red-100 text-red-800"
                                    }>
                                      {Math.round(item.confidence * 100)}% khớp
                                    </Badge>
                                    {item.medicine.requiresPrescription && (
                                      <Badge className="bg-orange-100 text-orange-800">
                                        Cần đơn bác sĩ
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className="text-xs text-gray-500">
                                  Tìm thấy từ: "{item.originalText}"
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToCart(item.medicine.id)}
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Thêm vào giỏ
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/medicine/${item.medicine.id}`, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Xem chi tiết
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Not Found Medicines */}
              {analysisResult.notFoundMedicines.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">Thuốc cần tư vấn</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {analysisResult.notFoundMedicines.map((item, index) => (
                        <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900 mb-1">
                                "{item.originalText}"
                              </p>
                              {item.suggestions.length > 0 && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">Gợi ý thuốc tương tự:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.suggestions.map((suggestion, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {suggestion}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                  <div className="space-y-3">
                    {analysisResult.foundMedicines.length > 0 && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          // Add all found medicines to cart
                          analysisResult.foundMedicines.forEach(item => {
                            handleAddToCart(item.medicine.id);
                          });
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mua tất cả ({analysisResult.foundMedicines.length} thuốc)
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleViewAllMedicines}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Xem tất cả thuốc
                    </Button>
                    
                    {analysisResult.requiresConsultation && (
                      <Button 
                        variant="outline" 
                        className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={handleRequestConsultation}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Yêu cầu tư vấn
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Image */}
              {prescriptionImage && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Hình đơn thuốc</h3>
                    <img
                      src={prescriptionImage}
                      alt="Đơn thuốc"
                      className="w-full rounded-lg border border-gray-200"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Help */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Cần hỗ trợ?</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Hotline: 1800 6928</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>8:00 - 22:00 hàng ngày</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Tư vấn miễn phí</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
