import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
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
  Calendar as CalendarIcon
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCouponCount } from "@/hooks/use-coupon-count";

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { user, login, token } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { couponCount } = useCouponCount();
  const [pPointBalance, setPPointBalance] = useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load P-Xu balance
  useEffect(() => {
    const loadPPointBalance = async () => {
      if (!user || !token) return;
      
      try {
        const response = await fetch(`${API_BASE}/api/p-points/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPPointBalance(data.data.balance || 0);
          }
        }
      } catch (error) {
        console.error('Error loading P-Xu balance:', error);
      }
    };

    loadPPointBalance();
  }, [user, token]);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !token) {
        setIsLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const profileData = data.data;
            // Combine firstName and lastName for display
            const name = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || 'Khách hàng';
            setFullName(name);
            
            // Format date of birth correctly (handle timezone issues)
            // Parse date string to avoid timezone issues
            if (profileData.dateOfBirth) {
              // If dateOfBirth is a string in format YYYY-MM-DD or ISO string
              const dateStr = profileData.dateOfBirth;
              let date: Date;
              
              // Check if it's already in YYYY-MM-DD format
              if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
                // Parse as local date (not UTC)
                const [year, month, day] = dateStr.split('T')[0].split('-');
                date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              } else {
                // Otherwise parse as Date object
                date = new Date(dateStr);
              }
              
              // Get local date components without timezone conversion
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setDateOfBirth(`${year}-${month}-${day}`);
            } else {
              setDateOfBirth('');
            }
            
            setGender(profileData.gender || '');
            setEmail(profileData.email || '');
            setAvatar(profileData.avatar || '');
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserProfile();
  }, [user, token]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh (JPEG, PNG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE}/api/auth/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newAvatarUrl = data.data.avatar;
        
        // Update user in AuthContext immediately
        const updatedUser = {
          ...user!,
          avatar: newAvatarUrl,
        };
        login(updatedUser, token);

        // Set avatar state immediately - use preview first, then switch to server URL
        // This ensures immediate visual feedback
        setAvatar(newAvatarUrl);
        
        // Reload profile data to ensure consistency
        try {
          const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.success && profileData.data) {
              const serverAvatarUrl = profileData.data.avatar || newAvatarUrl;
              setAvatar(serverAvatarUrl);
              
              // Update AuthContext again with server data
              const serverUpdatedUser = {
                ...user!,
                avatar: serverAvatarUrl,
              };
              login(serverUpdatedUser, token);
            }
          }
        } catch (error) {
          console.error('Error reloading profile:', error);
        }

        // Keep preview visible until we confirm the server image loads
        // Only clear preview after confirming the image is displayed
        const img = new Image();
        img.onload = () => {
          // Image loaded successfully, clear preview
          setTimeout(() => {
            setAvatarPreview(null);
          }, 300);
        };
        img.onerror = () => {
          // If server image fails, keep preview
          console.warn('Server avatar image failed to load, keeping preview');
        };
        img.src = newAvatarUrl;

        toast({
          title: "Thành công",
          description: "Cập nhật ảnh đại diện thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra khi upload ảnh",
          variant: "destructive",
        });
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      return;
    }

    // Validate full name
    if (!fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ và tên",
        variant: "destructive",
      });
      return;
    }

    // Split full name into firstName and lastName
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth: dateOfBirth || undefined,
          gender: gender || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user in AuthContext and localStorage
        const updatedUser = {
          ...user!,
          firstName,
          lastName,
        };
        login(updatedUser, token);

        toast({
          title: "Thành công",
          description: "Cập nhật thông tin cá nhân thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra khi cập nhật thông tin",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarMenuItems = [
    { icon: User, label: "Thông tin cá nhân", href: "/account/thong-tin-ca-nhan", active: true },
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
    { icon: ClipboardList, label: "Đơn thuốc của tôi", href: "/account/don-thuoc-cua-toi" },
    { icon: FileText, label: "Lịch sử tư vấn thuốc", href: "/account/lich-su-tu-van" },
    { icon: Microscope, label: "Kết quả xét nghiệm", href: "/account/ket-qua-xet-nghiem" }
  ];

  const handleMenuClick = (href: string) => {
    setLocation(href);
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
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                          }
                        }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">Khách Hàng</h3>
                  <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    <span className="font-bold">P</span>
                    <span>{pPointBalance} P-Xu</span>
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
                        onClick={() => handleMenuClick(item.href)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                          item.active 
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        {item.label === "Mã giảm giá" && couponCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {couponCount}
                          </span>
                        )}
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h1>
                
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden relative">
                        {/* Show preview first if available, then fallback to avatar URL */}
                        {(avatarPreview || avatar) ? (
                          <img 
                            src={avatarPreview || avatar || ''} 
                            alt="Avatar" 
                            key={avatarPreview || avatar} // Force re-render when URL changes
                            className="w-full h-full object-cover"
                            onLoad={() => {
                              // Image loaded successfully
                              if (avatarPreview && avatar) {
                                // Clear preview after server image loads
                                setTimeout(() => setAvatarPreview(null), 100);
                              }
                            }}
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('svg')) {
                                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                svg.setAttribute('class', 'w-12 h-12 text-white');
                                svg.setAttribute('fill', 'none');
                                svg.setAttribute('stroke', 'currentColor');
                                svg.setAttribute('viewBox', '0 0 24 24');
                                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                path.setAttribute('stroke-linecap', 'round');
                                path.setAttribute('stroke-linejoin', 'round');
                                path.setAttribute('stroke-width', '2');
                                path.setAttribute('d', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
                                svg.appendChild(path);
                                parent.appendChild(svg);
                              }
                            }}
                          />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-10">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploadingAvatar ? 'Đang tải lên...' : 'Cập nhật ảnh mới'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Dung lượng file tối đa 5 MB. Định dạng: JPEG, PNG
                    </p>
                  </div>

                  {/* Form Fields */}
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nhập họ và tên"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoadingData}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10 px-3",
                                !dateOfBirth && "text-muted-foreground"
                              )}
                              disabled={isLoadingData}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateOfBirth ? (
                                format(new Date(dateOfBirth + 'T00:00:00'), "dd/MM/yyyy", { locale: vi })
                              ) : (
                                <span className="text-gray-400">Chọn ngày sinh</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DatePicker
                              selected={dateOfBirth ? new Date(dateOfBirth + 'T00:00:00') : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const year = date.getFullYear();
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const day = String(date.getDate()).padStart(2, '0');
                                  setDateOfBirth(`${year}-${month}-${day}`);
                                } else {
                                  setDateOfBirth('');
                                }
                              }}
                              disabled={isLoadingData}
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </label>
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoadingData}
                        >
                          <option value="">Giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          value={user?.phone ? user.phone.replace(/(\d{4})(\d{3})(\d{3})/, '**** *** $3') : ''}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoadingData}
                          />
                          <button 
                            type="button"
                            onClick={() => setLocation("/account/cap-nhat-email")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Cập nhật
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="password"
                            placeholder="••••••••"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                          <button 
                            type="button"
                            onClick={() => setLocation("/account/cap-nhat-mat-khau")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Cập nhật
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={isLoading || isLoadingData}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </form>
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
