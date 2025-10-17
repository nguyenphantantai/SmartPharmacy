import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Save, 
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function SavePrescription() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prescriptionName: "",
    hospitalName: "",
    doctorName: "",
    examinationDate: "",
    notes: ""
  });

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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving prescription:", { selectedFile, formData });
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lưu đơn thuốc</h1>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => setLocation("/dat-thuoc-theo-don")}
                variant="outline"
                className="flex-1 bg-white text-gray-700 border"
              >
                <FileText className="w-4 h-4 mr-2" />
                Đặt đơn thuốc
              </Button>
              <Button 
                onClick={() => setLocation("/luu-don-thuoc")}
                className="flex-1 bg-blue-600 text-white"
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
                <span className="text-sm text-orange-800">Lưu trữ đơn thuốc</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm text-orange-800">Quản lý đơn thuốc của bạn</span>
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  * Tên đơn thuốc
                </label>
                <Input
                  placeholder="Nhập tên đơn thuốc"
                  value={formData.prescriptionName}
                  onChange={(e) => handleInputChange('prescriptionName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nơi khám bệnh (Tùy chọn)
                </label>
                <Input
                  placeholder="Nhập tên bệnh viện/phòng khám"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tên bác sĩ (Tùy chọn)
                </label>
                <Input
                  placeholder="Nhập tên bác sĩ khám cho bạn"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ngày khám (Tùy chọn)
                </label>
                <div className="relative mt-1">
                  <Input
                    type="date"
                    placeholder="Chọn ngày khám"
                    value={formData.examinationDate}
                    onChange={(e) => handleInputChange('examinationDate', e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* My Prescriptions Link */}
            <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
              <FileText className="w-4 h-4 mr-2" />
              Đơn thuốc của tôi
            </Button>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              Lưu đơn thuốc
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
