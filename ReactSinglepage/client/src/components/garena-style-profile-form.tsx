import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/utils';

interface GarenaStyleProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function GarenaStyleProfileForm({ isOpen, onClose, onComplete }: GarenaStyleProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    yearOfBirth: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    yearOfBirth?: string;
    dateOfBirth?: string;
    address?: string;
  }>({});
  const { toast } = useToast();

  // Get current user info
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user info when form opens
  React.useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    }
  }, [isOpen]);

  // Debug props (simplified)
  console.log('GarenaStyleProfileForm isOpen:', isOpen);
  console.log('GarenaStyleProfileForm should render:', isOpen ? 'YES' : 'NO');

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      yearOfBirth?: string;
      dateOfBirth?: string;
      address?: string;
    } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }
    
    if (!formData.yearOfBirth.trim()) {
      newErrors.yearOfBirth = 'Năm sinh là bắt buộc';
    } else {
      const year = parseInt(formData.yearOfBirth);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.yearOfBirth = 'Năm sinh không hợp lệ';
      }
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ nhà là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
        return;
      }

      // Create date from year and date
      const [day, month] = formData.dateOfBirth.split('/');
      const fullDate = `${formData.yearOfBirth}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.fullName.trim());
      formDataToSend.append('dateOfBirth', fullDate);
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('gender', 'other'); // Default gender

      const response = await fetch(`${API_BASE}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      console.log('Complete profile response:', data);

      if (data.success) {
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        toast({
          title: "Thành công",
          description: "Hoàn thiện thông tin cá nhân thành công!",
        });
        
        // Close form and trigger completion callback
        onComplete();
        onClose();
        
        // Reset form
        setFormData({
          fullName: '',
          yearOfBirth: '',
          dateOfBirth: '',
          address: '',
          email: '',
          phone: ''
        });
        setErrors({});
        
        // Reload page to update UI
        window.location.reload();
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra khi hoàn thiện thông tin",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Complete profile error:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi hoàn thiện thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden bg-green-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-white text-green-600 hover:bg-gray-100 font-medium"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Labels */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="flex items-center h-10">
                <User className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Họ và tên:</span>
              </div>
              
              <div className="flex items-center h-10">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Năm sinh:</span>
              </div>
              
              <div className="flex items-center h-10">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Ngày sinh:</span>
              </div>
              
              <div className="flex items-center h-10">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Địa chỉ nhà:</span>
              </div>
              
              <div className="flex items-center h-10">
                <Mail className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Địa chỉ email:</span>
              </div>
              
              <div className="flex items-center h-10">
                <Phone className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Số điện thoại xác nhận:</span>
              </div>
            </div>

            {/* Right Column - Values/Inputs */}
            <div className="space-y-6 flex flex-col justify-center">
              {/* Full Name */}
              <div className="h-10">
                <Input
                  placeholder="Nhập họ và tên đầy đủ"
                  className={`h-10 rounded-lg w-full ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                {errors.fullName && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.fullName}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Year of Birth */}
              <div className="h-10">
                <Input
                  type="number"
                  placeholder="Năm sinh (VD: 1990)"
                  className={`h-10 rounded-lg w-full ${
                    errors.yearOfBirth ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={formData.yearOfBirth}
                  onChange={(e) => handleInputChange('yearOfBirth', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {errors.yearOfBirth && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.yearOfBirth}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Date of Birth */}
              <div className="h-10">
                <Input
                  placeholder="Ngày sinh (VD: 15/03)"
                  className={`h-10 rounded-lg w-full ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
                {errors.dateOfBirth && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.dateOfBirth}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Address */}
              <div className="h-10">
                <Input
                  placeholder="Nhập địa chỉ nhà"
                  className={`h-10 rounded-lg w-full ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.address}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="h-10">
                <Input
                  value={formData.email}
                  className="h-10 rounded-lg border-gray-300 bg-gray-100 w-full"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email đã được xác thực khi đăng ký
                </p>
              </div>

              {/* Phone (Read-only) */}
              <div className="h-10">
                <Input
                  value={formData.phone}
                  className="h-10 rounded-lg border-gray-300 bg-gray-100 w-full"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số điện thoại đã được xác thực khi đăng ký
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
