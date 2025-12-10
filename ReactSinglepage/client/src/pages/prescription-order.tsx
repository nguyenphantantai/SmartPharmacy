import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrescription } from "@/contexts/PrescriptionContext";
import { 
  Upload, 
  FileText, 
  Save, 
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Clock,
  Truck,
  Package
} from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function PrescriptionOrder() {
  const [, setLocation] = useLocation();
  const { addPrescription } = usePrescription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPrescriptionSaved, setIsPrescriptionSaved] = useState(false);
  const [savedPrescriptionId, setSavedPrescriptionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<{
    customerName?: string;
    doctorName?: string;
    hospitalName?: string;
    examinationDate?: string;
    dateOfBirth?: string;
    yearOfBirth?: string;
    age?: string;
    diagnosis?: string;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCreatePrescription = async () => {
    // Validate - only need image
    if (!selectedFile) {
      alert("Vui lòng tải lên hình ảnh đơn thuốc");
      return;
    }

    setIsProcessing(true);

    try {
      // Convert file to base64
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Add prescription to context (now calls API with only imageUrl - OCR will extract info)
      const prescriptionId = await addPrescription({
        imageUrl: imageUrl
      });

      console.log("Prescription created with ID:", prescriptionId);

      // Fetch the created prescription to get extracted info
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/prescriptions/${prescriptionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setExtractedInfo({
              customerName: data.data.customerName,
              doctorName: data.data.doctorName,
              hospitalName: data.data.hospitalName,
              examinationDate: data.data.examinationDate,
              dateOfBirth: data.data.dateOfBirth,
              yearOfBirth: data.data.yearOfBirth,
              age: data.data.age,
              diagnosis: data.data.diagnosis
            });
          }
        }
      } catch (fetchError) {
        console.error("Error fetching prescription details:", fetchError);
      }

      // Update state to show analysis button
      setIsPrescriptionSaved(true);
      setSavedPrescriptionId(prescriptionId);

      // Show success message
      alert(`Đơn thuốc đã được tạo thành công!
      
Hệ thống đã tự động quét và trích xuất thông tin từ hình ảnh đơn thuốc của bạn.

Bây giờ bạn có thể phân tích tự động để tìm thuốc phù hợp!`);
    } catch (error: any) {
      console.error("Error creating prescription:", error);
      alert(`Có lỗi xảy ra khi tạo đơn thuốc: ${error.message || 'Vui lòng thử lại.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzePrescription = () => {
    if (!savedPrescriptionId) {
      alert("Vui lòng tạo đơn thuốc trước khi phân tích");
      return;
    }

    // Store prescription ID for analysis
    localStorage.setItem('currentPrescriptionId', savedPrescriptionId);
    localStorage.setItem('currentPrescriptionImage', previewUrl || '');

    // Redirect to analysis page
    setLocation("/dat-thuoc-theo-don/phan-tich");
  };

  const handleViewMyPrescriptions = () => {
    setLocation("/account/don-thuoc-cua-toi");
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt thuốc theo đơn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span className="text-lg font-medium">Tạo đơn thuốc</span>
            </div>

            {/* Process Steps */}
            <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm text-orange-800">Tải lên hình ảnh đơn thuốc</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm text-orange-800">Hệ thống phân tích tự động</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm text-orange-800">Nhà thuốc thông minh sẽ giao hàng tận tay bạn</span>
              </div>
            </div>

            {/* Image Upload Area */}
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-8 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Prescription preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="space-y-4 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Đăng ảnh đơn thuốc ở đây
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Kéo hình ảnh hoặc bấm vào đây để đăng tải hình ảnh đơn thuốc lên đây
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Chọn ảnh
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Extracted Information Display (after OCR) */}
            {extractedInfo && isPrescriptionSaved && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Thông tin đã được trích xuất từ đơn thuốc
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Họ và tên bệnh nhân:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.customerName && extractedInfo.customerName !== 'NOT FOUND' && extractedInfo.customerName.trim() !== '' 
                          ? extractedInfo.customerName 
                          : 'Không có'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Bác sĩ:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.doctorName && extractedInfo.doctorName !== 'NOT FOUND' && extractedInfo.doctorName.trim() !== '' 
                          ? extractedInfo.doctorName 
                          : 'Không có'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Bệnh viện/phòng khám:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.hospitalName && extractedInfo.hospitalName !== 'NOT FOUND' && extractedInfo.hospitalName.trim() !== '' 
                          ? extractedInfo.hospitalName 
                          : 'Không có'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Ngày khám:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.examinationDate && extractedInfo.examinationDate !== 'Không có'
                          ? new Date(extractedInfo.examinationDate).toLocaleDateString('vi-VN')
                          : 'Không có'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Năm sinh/ Tuổi:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.age 
                          ? `${extractedInfo.age} tuổi`
                          : extractedInfo.yearOfBirth 
                          ? `Năm ${extractedInfo.yearOfBirth}`
                          : extractedInfo.dateOfBirth && extractedInfo.dateOfBirth !== 'Không có'
                          ? new Date(extractedInfo.dateOfBirth).getFullYear().toString()
                          : 'Không có'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-700">Chẩn đoán bệnh:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {extractedInfo.diagnosis && extractedInfo.diagnosis !== 'NOT FOUND' && extractedInfo.diagnosis.trim() !== '' 
                          ? extractedInfo.diagnosis 
                          : 'Không có'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Prescriptions Link */}
            <Button 
              variant="link" 
              className="text-blue-600 hover:text-blue-800 p-0"
              onClick={() => setLocation("/account/don-thuoc-cua-toi")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Đơn thuốc của tôi
            </Button>

            {/* Submit Buttons */}
            <div className="space-y-3">
              {!isPrescriptionSaved ? (
                <>
                  <Button
                    onClick={handleCreatePrescription}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Đang xử lý và quét thông tin...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Tạo đơn thuốc</span>
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    <strong>Bước 1:</strong> Tải lên hình ảnh đơn thuốc, hệ thống sẽ tự động quét và trích xuất thông tin
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-green-800 mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Đơn thuốc đã được tạo thành công!</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Mã đơn:</span>
                        <span className="font-mono">{savedPrescriptionId}</span>
                      </div>
                      {extractedInfo && (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">Tên khách hàng:</span>
                            <span>
                              {extractedInfo.customerName && extractedInfo.customerName !== 'NOT FOUND' && extractedInfo.customerName.trim() !== '' 
                                ? extractedInfo.customerName 
                                : 'Không có'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Bác sĩ:</span>
                            <span>
                              {extractedInfo.doctorName && extractedInfo.doctorName !== 'NOT FOUND' && extractedInfo.doctorName.trim() !== '' 
                                ? extractedInfo.doctorName 
                                : 'Không có'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Bệnh viện:</span>
                            <span>
                              {extractedInfo.hospitalName && extractedInfo.hospitalName !== 'NOT FOUND' && extractedInfo.hospitalName.trim() !== '' 
                                ? extractedInfo.hospitalName 
                                : 'Không có'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Ngày khám:</span>
                            <span>
                              {extractedInfo.examinationDate && extractedInfo.examinationDate !== 'Không có'
                                ? new Date(extractedInfo.examinationDate).toLocaleDateString('vi-VN')
                                : 'Không có'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Năm sinh/ Tuổi:</span>
                            <span>
                              {extractedInfo.age 
                                ? `${extractedInfo.age} tuổi`
                                : extractedInfo.yearOfBirth 
                                ? `Năm ${extractedInfo.yearOfBirth}`
                                : extractedInfo.dateOfBirth && extractedInfo.dateOfBirth !== 'Không có'
                                ? new Date(extractedInfo.dateOfBirth).getFullYear().toString()
                                : 'Không có'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Chẩn đoán bệnh:</span>
                            <span>
                              {extractedInfo.diagnosis && extractedInfo.diagnosis !== 'NOT FOUND' && extractedInfo.diagnosis.trim() !== '' 
                                ? extractedInfo.diagnosis 
                                : 'Không có'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyzePrescription}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-medium flex items-center justify-center space-x-2"
                  >
                    <Package className="w-5 h-5" />
                    <span>Phân tích tự động</span>
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    <strong>Bước 2:</strong> Phân tích đơn thuốc để tìm thuốc phù hợp
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Sample Prescription */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Đơn thuốc minh họa</h2>
            
            {/* Sample Prescription Image */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  
                  {/* Prescription Sample Image */}
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <img 
                      src="/images/prescription-sample.jpg" 
                      alt="Đơn thuốc minh họa"
                      className="w-full h-auto"
                      onError={(e) => {
                        // Fallback nếu hình ảnh chưa được thêm
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                              <div class="text-center text-gray-500">
                                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-lg font-medium mb-2">Hình ảnh đơn thuốc minh họa</p>
                                <p class="text-sm">Vui lòng thêm hình ảnh vào thư mục public/images/</p>
                                <p class="text-xs text-gray-400 mt-2">
                                  Tên file: prescription-sample.jpg
                                </p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  {/* Explanation with numbered badges */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">1</Badge>
                      <span className="text-sm text-gray-600">Có thông tin đơn vị phát hành đơn thuốc</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">2</Badge>
                      <span className="text-sm text-gray-600">Có chi tiết thông tin bệnh nhân, chẩn đoán bệnh</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">3</Badge>
                      <span className="text-sm text-gray-600">Có tên thuốc, hàm lượng, số lượng, liều dùng</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">4</Badge>
                      <span className="text-sm text-gray-600">Còn hiệu lực: Đơn thuốc chỉ có hiệu lực trong vòng 5 ngày</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">5</Badge>
                      <span className="text-sm text-gray-600">Có chữ ký và họ tên bác sĩ kê đơn</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Note */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý</h4>
                    <p className="text-sm text-yellow-700">
                      Hình ảnh đơn thuốc phải đầy đủ, không cắt xén, mất nét
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
