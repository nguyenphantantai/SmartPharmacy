import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrescription } from "@/contexts/PrescriptionContext";
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Gift, 
  Star, 
  FileText, 
  Bell, 
  CreditCard, 
  Users, 
  Activity, 
  Stethoscope, 
  ClipboardList, 
  Plus,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function MyPrescriptions() {
  const [, setLocation] = useLocation();
  const { prescriptions, getPrescriptionById, fetchPrescriptionById, isLoading } = usePrescription();
  const [activeTab, setActiveTab] = useState<'consultation' | 'saved'>('consultation');
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [selectedPrescriptionData, setSelectedPrescriptionData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan" },
    { icon: MapPin, label: "Số địa chỉ nhận hàng", href: "/account/dia-chi-nhan-hang" },
    { icon: ShoppingBag, label: "Lịch sử đơn hàng", href: "/account/lich-su-don-hang" },
    { icon: Gift, label: "Mã giảm giá", href: "/account/ma-giam-gia" },
    { icon: Star, label: "Lịch sử P-Xu Vàng", href: "/account/lich-su-p-xu" },
    { icon: FileText, label: "Quy chế xếp hạng", href: "/account/quy-che-xep-hang" },
    { icon: Bell, label: "Thông báo của tôi", href: "/account/thong-bao" },
    { icon: CreditCard, label: "Quản lý thanh toán", href: "/account/quan-ly-thanh-toan" },
    { icon: Users, label: "Hồ sơ gia đình", href: "/account/ho-so-gia-dinh" },
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe" },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe" },
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi", active: true },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: ClipboardList, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const handleNewPrescription = () => {
    setLocation("/dat-thuoc-theo-don");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Show toast notification
  };

  const handleViewDetails = async (id: string) => {
    setSelectedPrescription(id);
    setLoadingDetails(true);
    
    // Try to get from local cache first
    let prescription = getPrescriptionById(id);
    
    // If not found, fetch from API
    if (!prescription) {
      try {
        prescription = await fetchPrescriptionById(id);
      } catch (error) {
        console.error('Error fetching prescription:', error);
      }
    }
    
    setSelectedPrescriptionData(prescription);
    setLoadingDetails(false);
  };

  const handleBackToList = () => {
    setSelectedPrescription(null);
    setSelectedPrescriptionData(null);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* User Profile */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Khách Hàng</h3>
                  <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    <span>0 P-Xu</span>
                  </div>
                </div>

                {/* Membership Tier */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-lg">VÀNG</span>
                      </div>
                      <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs">💎</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-white/30 rounded-full h-2 relative">
                        <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '5%' }}></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-yellow-100">
                        Chi tiêu thêm 4.000.000 ₫ để thăng hạng
                      </p>
                      <button className="w-4 h-4 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600 text-xs font-bold">i</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {sidebarMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setLocation(item.href)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                          item.active 
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {!selectedPrescription ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold text-gray-900">Đơn thuốc của tôi</h1>
                      <Button 
                        onClick={handleNewPrescription}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Đơn thuốc mới
                      </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('consultation')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'consultation'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Đơn thuốc tư vấn
                      </button>
                      <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'saved'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Đơn thuốc đã lưu
                      </button>
                    </div>

                    {/* Prescription List */}
                    {activeTab === 'consultation' && (
                      <div className="space-y-4">
                        {prescriptions.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Chưa có đơn thuốc tư vấn</p>
                            <Button 
                              onClick={handleNewPrescription}
                              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Tạo đơn thuốc đầu tiên
                            </Button>
                          </div>
                        ) : (
                          prescriptions.map((prescription) => (
                            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                                    <span className="text-sm font-mono text-gray-900">{prescription.id}</span>
                                    <button
                                      onClick={() => handleCopyCode(prescription.id)}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>Thời gian tạo đơn: {prescription.createdAt}</span>
                                    <div className="flex items-center space-x-2">
                                      <span>Trạng thái:</span>
                                      <Badge variant={
                                        prescription.status === 'Chờ tư vấn' ? 'destructive' :
                                        prescription.status === 'Đã tư vấn' ? 'default' : 'secondary'
                                      }>
                                        {prescription.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(prescription.id)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Xem chi tiết
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'saved' && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Chưa có đơn thuốc đã lưu</p>
                      </div>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-center mt-8 space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium">1</span>
                      <Button variant="outline" size="sm" disabled>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : loadingDetails ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải chi tiết đơn thuốc...</p>
                  </div>
                ) : selectedPrescriptionData ? (
                  <>
                    {/* Prescription Details */}
                    <div className="flex items-center mb-6">
                      <Button
                        variant="ghost"
                        onClick={handleBackToList}
                        className="mr-4 p-2 hover:bg-gray-100"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn thuốc</h1>
                    </div>

                    {/* Prescription Information */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                          <span className="text-sm font-mono text-gray-900">#{selectedPrescriptionData.id}</span>
                          <button
                            onClick={() => handleCopyCode(selectedPrescriptionData.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                        <Badge className={
                          selectedPrescriptionData.status === 'Chờ tư vấn' ? 'bg-red-100 text-red-800 border-red-200' :
                          selectedPrescriptionData.status === 'Đã tư vấn' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }>
                          {selectedPrescriptionData.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Thời gian tạo đơn:</span>
                        <span className="text-sm text-gray-900">{selectedPrescriptionData.createdAt}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Họ và tên:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.customerName && selectedPrescriptionData.customerName !== 'NOT FOUND' && selectedPrescriptionData.customerName.trim() !== ''
                            ? selectedPrescriptionData.customerName 
                            : 'Không có'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Bác sĩ:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.doctorName && selectedPrescriptionData.doctorName !== 'NOT FOUND' && selectedPrescriptionData.doctorName.trim() !== ''
                            ? selectedPrescriptionData.doctorName 
                            : 'Không có'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Bệnh viện/phòng khám:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.hospitalName && selectedPrescriptionData.hospitalName !== 'NOT FOUND' && selectedPrescriptionData.hospitalName.trim() !== ''
                            ? selectedPrescriptionData.hospitalName 
                            : 'Không có'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Ngày khám:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.examinationDate && selectedPrescriptionData.examinationDate !== 'Không có'
                            ? new Date(selectedPrescriptionData.examinationDate).toLocaleDateString('vi-VN')
                            : 'Không có'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Năm sinh/ Tuổi:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.age 
                            ? `${selectedPrescriptionData.age} tuổi`
                            : selectedPrescriptionData.yearOfBirth 
                            ? `Năm ${selectedPrescriptionData.yearOfBirth}`
                            : selectedPrescriptionData.dateOfBirth && selectedPrescriptionData.dateOfBirth !== 'Không có'
                            ? new Date(selectedPrescriptionData.dateOfBirth).getFullYear().toString()
                            : 'Không có'}
                        </span>
                      </div>

                      <div className="flex items-start space-x-4">
                        <span className="text-sm font-medium text-gray-600">Chẩn đoán bệnh:</span>
                        <span className="text-sm text-gray-900">
                          {selectedPrescriptionData.diagnosis && selectedPrescriptionData.diagnosis !== 'NOT FOUND' && selectedPrescriptionData.diagnosis.trim() !== '' 
                            ? selectedPrescriptionData.diagnosis 
                            : 'Không có'}
                        </span>
                      </div>

                      {selectedPrescriptionData.note && (
                        <div className="flex items-start space-x-4">
                          <span className="text-sm font-medium text-gray-600">Ghi chú:</span>
                          <span className="text-sm text-gray-900">{selectedPrescriptionData.note}</span>
                        </div>
                      )}

                      {selectedPrescriptionData.rejectionReason && (
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-600">Lý do từ chối:</span>
                          <span className="text-sm text-gray-900">{selectedPrescriptionData.rejectionReason}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Xem gợi ý</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-6"></div>

                    {/* Prescription Image */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình đơn thuốc</h3>
                      <div className="relative inline-block">
                        {selectedPrescriptionData.imageUrl ? (
                          <img
                            src={selectedPrescriptionData.imageUrl}
                            alt="Hình đơn thuốc"
                            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <div class="text-center text-gray-500">
                                      <div class="text-4xl mb-2">📄</div>
                                      <p class="text-sm">Hình đơn thuốc</p>
                                      <p class="text-xs text-gray-400">Không có hình ảnh</p>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📄</div>
                              <p className="text-sm">Hình đơn thuốc</p>
                              <p className="text-xs text-gray-400">Không có hình ảnh</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6">
                      <Button
                        onClick={handleNewPrescription}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Tạo lại đơn thuốc</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Không tìm thấy đơn thuốc</p>
                    <Button 
                      onClick={handleBackToList}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Quay lại danh sách
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
