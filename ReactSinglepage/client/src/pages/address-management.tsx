import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Microscope,
  Plus,
  Edit,
  Trash2,
  Home,
  Building
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AddressFormDialog from "@/components/address-form-dialog";

interface Address {
  _id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  address: string;
  addressType: 'home' | 'company';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AddressManagementPage() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan" },
    { icon: MapPin, label: "Số địa chỉ nhận hàng", href: "/account/dia-chi-nhan-hang", active: true },
    { icon: ShoppingBag, label: "Lịch sử đơn hàng", href: "/account/lich-su-don-hang" },
    { icon: Gift, label: "Mã giảm giá", href: "/account/ma-giam-gia" },
    { icon: Star, label: "Lịch sử P-Xu Vàng", href: "/account/lich-su-p-xu" },
    { icon: FileText, label: "Quy chế xếp hạng", href: "/account/quy-che-xep-hang" },
    { icon: Bell, label: "Thông báo của tôi", href: "/account/thong-bao" },
    { icon: CreditCard, label: "Quản lý thanh toán", href: "/account/quan-ly-thanh-toan" },
    { icon: Users, label: "Hồ sơ gia đình", href: "/account/ho-so-gia-dinh" },
    { icon: Activity, label: "Chỉ tiêu sức khỏe", href: "/account/chi-tieu-suc-khoe" },
    { icon: Stethoscope, label: "Công cụ sức khỏe", href: "/account/cong-cu-suc-khoe" },
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi" },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: Microscope, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const handleMenuClick = (href: string) => {
    setLocation(href);
  };

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAddresses(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user, token]);

  // Handle delete address
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(addresses.filter(addr => addr._id !== id));
        toast({
          title: "Thành công",
          description: "Địa chỉ đã được xóa thành công",
        });
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra khi xóa địa chỉ",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle set default address
  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/addresses/${id}/set-default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Reload addresses
        const refreshResponse = await fetch(`${API_BASE}/api/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setAddresses(refreshData.data || []);
          }
        }

        toast({
          title: "Thành công",
          description: "Đã đặt làm địa chỉ mặc định",
        });
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle form dialog close
  const handleDialogClose = (success: boolean = false) => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    
    if (success) {
      // Reload addresses
      const loadAddresses = async () => {
        try {
          const response = await fetch(`${API_BASE}/api/addresses`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setAddresses(data.data || []);
            }
          }
        } catch (error) {
          console.error('Error loading addresses:', error);
        }
      };
      loadAddresses();
    }
  };

  // Handle edit
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
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
                  <h3 className="font-semibold text-gray-900">
                    {user ? `${user.firstName} ${user.lastName}`.trim() || 'Khách hàng' : 'Khách Hàng'}
                  </h3>
                  <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                    <Star className="w-3 h-3" />
                    <span>0 P-Xu</span>
                  </div>
                </div>

                {/* Membership Tier */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6 relative overflow-hidden">
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
                        onClick={() => handleMenuClick(item.href)}
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
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Sổ địa chỉ nhận hàng</h1>
                  <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm địa chỉ
                  </Button>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Đang tải...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
                    <p className="text-gray-500">
                      Vui lòng thêm địa chỉ để nhận sản phẩm nhanh chóng và thuận tiện
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address._id} className={`border-2 ${address.isDefault ? 'border-blue-500' : 'border-gray-200'}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {address.addressType === 'home' ? (
                                  <Home className="h-5 w-5 text-gray-600" />
                                ) : (
                                  <Building className="h-5 w-5 text-gray-600" />
                                )}
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {address.receiverName}
                                </h3>
                                {address.isDefault && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{address.receiverPhone}</p>
                              <p className="text-gray-700 mb-1">
                                {address.address}, {address.wardName}, {address.districtName}, {address.provinceName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {address.addressType === 'home' ? 'Nhà riêng' : 'Công ty'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefault(address._id)}
                                  className="text-xs"
                                >
                                  Đặt mặc định
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(address)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(address._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Address Form Dialog */}
      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => handleDialogClose()}
        onSuccess={() => handleDialogClose(true)}
        editingAddress={editingAddress}
      />
    </div>
  );
}

