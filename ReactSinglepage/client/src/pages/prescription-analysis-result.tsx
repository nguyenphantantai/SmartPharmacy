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
import { useCart } from "@/hooks/use-cart";
import { getImageUrl } from "@/lib/imageUtils";

export default function PrescriptionAnalysisResultPage() {
  const [, setLocation] = useLocation();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionImage, setPrescriptionImage] = useState<string>("");
  const { toast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    // Lấy hình ảnh đơn thuốc từ localStorage hoặc context
    const imageUrl = localStorage.getItem('currentPrescriptionImage') || "";
    const prescriptionId = localStorage.getItem('currentPrescriptionId') || "";
    setPrescriptionImage(imageUrl);
    
    const analyzePrescription = async () => {
      try {
        // Helper function to convert blob URL to base64
        const blobToBase64 = async (blobUrl: string): Promise<string> => {
          try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error converting blob to base64:', error);
            throw error;
          }
        };

        // Always try to get image URL from prescription API if we have prescription ID
        let finalImageUrl = imageUrl;
        if (prescriptionId) {
          try {
            const presResponse = await apiRequest('GET', `/api/prescriptions/${prescriptionId}`);
            const presData = await presResponse.json();
            if (presData.success && presData.data?.imageUrl) {
              finalImageUrl = presData.data.imageUrl;
              setPrescriptionImage(finalImageUrl);
            }
          } catch (err) {
            console.error('Error fetching prescription:', err);
          }
        }

        // If imageUrl is a blob URL, convert it to base64
        if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
          console.log('Converting blob URL to base64...');
          try {
            finalImageUrl = await blobToBase64(finalImageUrl);
            console.log('✅ Converted blob URL to base64');
          } catch (error) {
            console.error('Failed to convert blob URL:', error);
            toast({
              title: "Lỗi",
              description: "Không thể xử lý hình ảnh. Vui lòng thử lại.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
        }
        
        // Use backend AI analysis - backend will extract text from image if needed
        const response = await apiRequest('POST', '/api/consultation/analyze', {
          prescriptionImage: finalImageUrl
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

    if (imageUrl || prescriptionId) {
      analyzePrescription();
    } else {
      setLoading(false);
    }
  }, [toast]);

  const handleBackToOrder = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  const handleAddToCart = (product: any) => {
    try {
      // Convert backend product format to frontend Product type
      const productForCart = {
        _id: product.productId || product._id || product.id,
        id: product.productId || product._id || product.id,
        name: product.productName || product.name,
        price: String(product.price || 0),
        originalPrice: String(product.originalPrice || product.price || 0),
        unit: product.unit || 'đơn vị',
        imageUrl: product.imageUrl || '/medicine-images/default-medicine.jpg',
        description: product.description || '',
        brand: product.brand || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockQuantity: product.stockQuantity || 0,
        isPrescription: product.requiresPrescription || product.isPrescription || false,
      };

      addItem(productForCart as any, 1, true);
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${productForCart.name} đã được thêm vào giỏ hàng`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
    }
  };

  const handleAddAllSuggestions = (suggestions: any[]) => {
    suggestions.forEach(suggestion => {
      handleAddToCart(suggestion);
    });
    toast({
      title: "Đã thêm tất cả",
      description: `Đã thêm ${suggestions.length} sản phẩm vào giỏ hàng`,
    });
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

              {/* Thuốc có trong đơn - Medicines found in database */}
              {analysisResult.prescriptionMedicines && analysisResult.prescriptionMedicines.filter(item => item.hasMatch).length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Thuốc có trong đơn</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {analysisResult.prescriptionMedicines
                        .filter(item => item.hasMatch && item.matchedProduct)
                        .map((item, index) => (
                          <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="mb-3">
                              <p className="font-medium text-gray-900 mb-1">
                                Thuốc trong đơn: <span className="text-green-700">"{item.originalText}"</span>
                              </p>
                              {item.originalDosage && (
                                <p className="text-sm text-gray-600">
                                  Hàm lượng: {item.originalDosage}
                                </p>
                              )}
                              <p className="text-sm text-green-700 mt-1">
                                ✅ Đã tìm thấy thuốc khớp trong hệ thống
                              </p>
                            </div>
                            
                            {item.matchedProduct && item.matchedProduct.imageUrl && (
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-4">
                                  <img
                                    src={getImageUrl(item.matchedProduct.imageUrl || '/medicine-images/default-medicine.jpg')}
                                    alt={item.matchedProduct.productName || 'Medicine'}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/images/medicines/default.jpg";
                                    }}
                                  />
                                  
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                          {item.matchedProduct.productName}
                                        </h4>
                                        {item.matchedProduct.dosage && (
                                          <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Hàm lượng:</span> {item.matchedProduct.dosage}
                                          </p>
                                        )}
                                        {item.matchedProduct.description && 
                                         !/^\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?\s*$/i.test(item.matchedProduct.description.trim()) && (
                                          <p className="text-sm text-gray-500 mb-2">
                                            {item.matchedProduct.description}
                                          </p>
                                        )}
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                          {item.matchedProduct.brand && <span>Nhà sản xuất: {item.matchedProduct.brand}</span>}
                                          <span>Đơn vị: {item.matchedProduct.unit}</span>
                                          <span>Còn: {item.matchedProduct.stockQuantity} {item.matchedProduct.unit}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="text-right ml-4">
                                        <div className="text-lg font-bold text-gray-900 mb-2">
                                          {parseInt(item.matchedProduct.price || "0").toLocaleString('vi-VN')} ₫
                                        </div>
                                        {item.matchedProduct.originalPrice && parseInt(item.matchedProduct.originalPrice) > parseInt(item.matchedProduct.price || "0") && (
                                          <div className="text-sm text-gray-400 line-through mb-1">
                                            {parseInt(item.matchedProduct.originalPrice).toLocaleString('vi-VN')} ₫
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Badge className={
                                            (item.matchedProduct.confidence || 0) > 0.8 ? "bg-green-100 text-green-800" :
                                            (item.matchedProduct.confidence || 0) > 0.6 ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                          }>
                                            {Math.round((item.matchedProduct.confidence || 0) * 100)}% khớp
                                          </Badge>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            if (item.matchedProduct) {
                                              addItem({
                                                id: item.matchedProduct.productId,
                                                name: item.matchedProduct.productName,
                                                price: parseInt(item.matchedProduct.price || "0"),
                                                image: item.matchedProduct.imageUrl || '/medicine-images/default-medicine.jpg',
                                                quantity: 1
                                              });
                                              toast({
                                                title: "Đã thêm vào giỏ",
                                                description: `${item.matchedProduct.productName} đã được thêm vào giỏ hàng`,
                                              });
                                            }
                                          }}
                                          className="w-full"
                                        >
                                          <ShoppingCart className="w-4 h-4 mr-2" />
                                          Thêm vào giỏ
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Thuốc đề xuất - Suggested medicines (not found in database) */}
              {analysisResult.prescriptionMedicines && analysisResult.prescriptionMedicines.filter(item => !item.hasMatch).length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Thuốc đề xuất</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {analysisResult.prescriptionMedicines
                        .filter(item => !item.hasMatch)
                        .map((item, index) => (
                        <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                          <div className="mb-3">
                            <p className="font-medium text-gray-900 mb-1">
                              Thuốc trong đơn: <span className="text-orange-700">"{item.originalText}"</span>
                            </p>
                            {item.originalDosage && (
                              <p className="text-sm text-gray-600">
                                Hàm lượng: {item.originalDosage}
                              </p>
                            )}
                            {/* Hiển thị suggestionText nếu có */}
                            {item.suggestionText && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-orange-300">
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                                  {item.suggestionText}
                                </p>
                              </div>
                            )}
                            {!item.suggestionText && (
                              <p className="text-sm text-gray-600 mt-1">
                                Không tìm thấy thuốc khớp chính xác. Dưới đây là các thuốc tương tự:
                              </p>
                            )}
                          </div>
                          
                          {item.suggestions && item.suggestions.length > 0 ? (
                            <>
                              <div className="flex justify-end mb-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleAddAllSuggestions(item.suggestions)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Thêm tất cả ({item.suggestions.length} thuốc)
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                {item.suggestions.map((suggestion, idx) => (
                                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start space-x-4">
                                      <img
                                        src={getImageUrl(suggestion.imageUrl)}
                                        alt={suggestion.productName}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = "/images/medicines/default.jpg";
                                        }}
                                      />
                                      
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                              {suggestion.productName}
                                            </h4>
                                            {suggestion.dosage && (
                                              <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Hàm lượng:</span> {suggestion.dosage}
                                              </p>
                                            )}
                                            {/* Hiển thị công dụng (indication) rõ ràng nếu có */}
                                            {suggestion.indication && (
                                              <div className="mb-2">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Công dụng:</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                  {suggestion.indication}
                                                </p>
                                              </div>
                                            )}
                                            {/* Hiển thị chống chỉ định nếu có */}
                                            {suggestion.contraindication && (
                                              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                                                <p className="text-sm font-medium text-red-700 mb-1">⚠️ Chống chỉ định:</p>
                                                <p className="text-sm text-red-600 leading-relaxed">
                                                  {suggestion.contraindication}
                                                </p>
                                              </div>
                                            )}
                                            {/* Hiển thị description nếu có và khác với indication */}
                                            {suggestion.description && 
                                             suggestion.description !== suggestion.indication &&
                                             // Không hiển thị description nếu nó chỉ là hàm lượng (chỉ chứa số và đơn vị)
                                             !/^\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?\s*$/i.test(suggestion.description.trim()) && (
                                              <p className="text-sm text-gray-500 mb-2">
                                                {suggestion.description}
                                              </p>
                                            )}
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                              {suggestion.brand && <span>Nhà sản xuất: {suggestion.brand}</span>}
                                              <span>Đơn vị: {suggestion.unit}</span>
                                              <span>Còn: {suggestion.stockQuantity} {suggestion.unit}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                              {suggestion.matchReason && (
                                                <Badge variant="outline" className="text-xs">
                                                  {suggestion.matchReason === 'same_name_different_dosage' 
                                                    ? 'Cùng tên, khác hàm lượng'
                                                    : suggestion.matchReason === 'same_indication_same_dosage'
                                                    ? 'Cùng công dụng, cùng hàm lượng'
                                                    : suggestion.matchReason === 'same_indication_different_dosage'
                                                    ? 'Cùng công dụng, khác hàm lượng'
                                                    : suggestion.matchReason === 'similar_name'
                                                    ? 'Tên tương tự'
                                                    : 'Đề xuất'}
                                                </Badge>
                                              )}
                                              {suggestion.matchExplanation && (
                                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                  💡 {suggestion.matchExplanation}
                                                </Badge>
                                              )}
                                              {suggestion.indication && (
                                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                                  📋 Công dụng: {suggestion.indication.length > 80 ? suggestion.indication.substring(0, 80) + '...' : suggestion.indication}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div className="text-right ml-4">
                                            <div className="text-lg font-bold text-gray-900 mb-2">
                                              {parseInt(suggestion.price || "0").toLocaleString('vi-VN')} ₫
                                            </div>
                                            {suggestion.originalPrice && parseInt(suggestion.originalPrice) > parseInt(suggestion.price || "0") && (
                                              <div className="text-sm text-gray-400 line-through mb-1">
                                                {parseInt(suggestion.originalPrice).toLocaleString('vi-VN')} ₫
                                              </div>
                                            )}
                                            <div className="flex items-center space-x-2 mb-2">
                                              <Badge className={
                                                (suggestion.confidence || 0) > 0.7 ? "bg-yellow-100 text-yellow-800" :
                                                "bg-orange-100 text-orange-800"
                                              }>
                                                {Math.round((suggestion.confidence || 0) * 100)}% tương tự
                                              </Badge>
                                              {suggestion.requiresPrescription && (
                                                <Badge className="bg-orange-100 text-orange-800">
                                                  Cần đơn bác sĩ
                                                </Badge>
                                              )}
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleAddToCart(suggestion)}
                                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                            >
                                              <ShoppingCart className="w-4 h-4 mr-1" />
                                              Thêm vào giỏ
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-4 text-gray-600">
                              <p>Không tìm thấy thuốc tương tự trong hệ thống.</p>
                              <p className="text-sm mt-2">Vui lòng liên hệ tư vấn viên để được hỗ trợ.</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Medicines (Thuốc có sẵn) - Medicines with related uses */}
              {/* Ẩn phần này khi đã có kết quả phân tích thành công (có prescriptionMedicines) */}
              {analysisResult.relatedMedicines && 
               analysisResult.relatedMedicines.length > 0 && 
               (!analysisResult.prescriptionMedicines || analysisResult.prescriptionMedicines.length === 0) && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Thuốc có sẵn</h2>
                      <Badge className="bg-green-100 text-green-800">
                        {analysisResult.relatedMedicines.length} sản phẩm
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {analysisResult.relatedMedicines.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.productName}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/medicines/default.jpg";
                              }}
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    {item.productName}
                                  </h3>
                                  {item.dosage && (
                                    <p className="text-sm text-gray-600 mb-1">
                                      <span className="font-medium">Hàm lượng:</span> {item.dosage}
                                  </p>
                                  )}
                                  {item.description && 
                                   // Không hiển thị description nếu nó chỉ là hàm lượng (chỉ chứa số và đơn vị)
                                   // Pattern: số + đơn vị (mg, g, ml, etc.) + có thể có + hoặc / + số + đơn vị
                                   !/^\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?\s*$/i.test(item.description.trim()) && (
                                    <p className="text-sm text-gray-500 mb-2">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    {item.brand && <span>Nhà sản xuất: {item.brand}</span>}
                                    <span>Đơn vị: {item.unit}</span>
                                    <span>Còn: {item.stockQuantity} {item.unit}</span>
                                  </div>
                                </div>
                                
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold text-gray-900 mb-2">
                                    {parseInt(item.price || "0").toLocaleString('vi-VN')} ₫
                                  </div>
                                  {item.originalPrice && parseInt(item.originalPrice) > parseInt(item.price || "0") && (
                                    <div className="text-sm text-gray-400 line-through mb-1">
                                      {parseInt(item.originalPrice).toLocaleString('vi-VN')} ₫
                                    </div>
                                  )}
                                  {item.requiresPrescription && (
                                    <Badge className="bg-orange-100 text-orange-800 mb-2">
                                      Cần đơn bác sĩ
                                      </Badge>
                                    )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToCart(item)}
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Thêm vào giỏ
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                  <div className="space-y-3">
                    {analysisResult.prescriptionMedicines && analysisResult.prescriptionMedicines.filter(m => m.hasMatch).length > 0 && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          // Add all matched medicines from prescription to cart
                          let addedCount = 0;
                          analysisResult.prescriptionMedicines.forEach(item => {
                            if (item.hasMatch && item.matchedProduct) {
                              handleAddToCart(item.matchedProduct);
                              addedCount++;
                            }
                          });
                          toast({
                            title: "Đã thêm tất cả",
                            description: `Đã thêm ${addedCount} sản phẩm vào giỏ hàng`,
                          });
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm tất cả ({analysisResult.prescriptionMedicines.filter(m => m.hasMatch).length} thuốc)
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
