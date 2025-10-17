import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Truck
} from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function PrescriptionOrder() {
  const [, setLocation] = useLocation();
  const { addPrescription } = usePrescription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prescriptionName: "",
    hospitalName: "",
    doctorName: "",
    examinationDate: "",
    notes: "",
    customerName: "",
    phoneNumber: "0942 808 839"
  });
  const [activeTab, setActiveTab] = useState<'order' | 'save'>('order');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!selectedFile) {
      alert("Vui lòng tải lên hình ảnh đơn thuốc");
      return;
    }

    if (!formData.customerName.trim()) {
      alert("Vui lòng nhập họ và tên");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    // Create image URL from file
    const imageUrl = previewUrl || URL.createObjectURL(selectedFile);

    // Add prescription to context
    const prescriptionId = addPrescription({
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      note: formData.note,
      imageUrl: imageUrl
    });

    console.log("Prescription submitted with ID:", prescriptionId);

    // Store image URL for analysis
    localStorage.setItem('currentPrescriptionImage', imageUrl);

    // Redirect to analysis result page
    setLocation("/dat-thuoc-theo-don/phan-tich");
  };


  const handleSavePrescription = () => {
    setLocation("/luu-don-thuoc");
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
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => setActiveTab('order')}
                className={`flex-1 ${activeTab === 'order' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Đặt đơn thuốc
              </Button>
              <Button 
                onClick={() => setActiveTab('save')}
                variant="outline"
                className={`flex-1 ${activeTab === 'save' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu đơn thuốc
              </Button>
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

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ghi chú</label>
              <Textarea
                placeholder="Vui lòng để lại thông tin ghi chú"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Customer Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Họ và Tên</label>
                <Input
                  placeholder="Khách hàng"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <Input
                  placeholder="Nhập số điện thoại"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

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
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Phân tích tự động</span>
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                <strong>Phân tích tự động:</strong> Hệ thống sẽ tìm thuốc phù hợp và cho phép mua ngay
              </p>
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
