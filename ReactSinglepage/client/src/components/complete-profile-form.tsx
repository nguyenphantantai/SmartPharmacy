import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, User, Calendar, MapPin, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/utils';

interface CompleteProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CompleteProfileForm({ isOpen, onClose, onComplete }: CompleteProfileFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  }>({});
  const { toast } = useToast();

  // Debug props
  console.log('CompleteProfileForm props:', { isOpen, onClose, onComplete });

  // Individual field validation functions
  const validateFirstName = (firstNameValue: string) => {
    if (!firstNameValue.trim()) {
      return 'Họ là bắt buộc';
    }
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêô\s]+$/;
    if (!nameRegex.test(firstNameValue.trim())) {
      return 'Họ chỉ được chứa chữ cái và khoảng trắng';
    }
    if (firstNameValue.trim().length < 2) {
      return 'Họ phải có ít nhất 2 ký tự';
    }
    return '';
  };

  const validateLastName = (lastNameValue: string) => {
    if (!lastNameValue.trim()) {
      return 'Tên là bắt buộc';
    }
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêô\s]+$/;
    if (!nameRegex.test(lastNameValue.trim())) {
      return 'Tên chỉ được chứa chữ cái và khoảng trắng';
    }
    if (lastNameValue.trim().length < 2) {
      return 'Tên phải có ít nhất 2 ký tự';
    }
    return '';
  };

  const validateDateOfBirth = (dateValue: string) => {
    if (!dateValue.trim()) {
      return 'Ngày sinh là bắt buộc';
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateValue)) {
      return 'Ngày sinh không hợp lệ (DD/MM/YYYY)';
    }
    const birthDate = new Date(dateValue);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate > today) {
      return 'Ngày sinh không thể là ngày tương lai';
    }
    if (age < 13) {
      return 'Bạn phải ít nhất 13 tuổi để đăng ký';
    }
    if (age > 120) {
      return 'Ngày sinh không hợp lệ';
    }
    return '';
  };

  const validateGender = (genderValue: string) => {
    if (!genderValue) {
      return 'Giới tính là bắt buộc';
    }
    return '';
  };

  const validateAddress = (addressValue: string) => {
    if (!addressValue.trim()) {
      return 'Địa chỉ là bắt buộc';
    }
    if (addressValue.trim().length < 10) {
      return 'Địa chỉ phải có ít nhất 10 ký tự';
    }
    if (addressValue.trim().length > 200) {
      return 'Địa chỉ không được vượt quá 200 ký tự';
    }
    return '';
  };

  // Handle field blur validation
  const handleFieldBlur = (field: string, value: string) => {
    let errorMessage = '';
    
    switch (field) {
      case 'firstName':
        errorMessage = validateFirstName(value);
        break;
      case 'lastName':
        errorMessage = validateLastName(value);
        break;
      case 'dateOfBirth':
        errorMessage = validateDateOfBirth(value);
        break;
      case 'gender':
        errorMessage = validateGender(value);
        break;
      case 'address':
        errorMessage = validateAddress(value);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      gender?: string;
      address?: string;
    } = {};
    
    // Use individual validation functions
    newErrors.firstName = validateFirstName(firstName);
    newErrors.lastName = validateLastName(lastName);
    newErrors.dateOfBirth = validateDateOfBirth(dateOfBirth);
    newErrors.gender = validateGender(gender);
    newErrors.address = validateAddress(address);
    
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => newErrors[key as keyof typeof newErrors]).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Chỉ được upload file hình ảnh",
          variant: "destructive",
        });
        return;
      }
      
      setAvatar(file);
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

      const formData = new FormData();
      formData.append('firstName', firstName.trim());
      if (lastName.trim()) {
        formData.append('lastName', lastName.trim());
      }
      if (dateOfBirth) {
        formData.append('dateOfBirth', dateOfBirth);
      }
      formData.append('gender', gender);
      if (address.trim()) {
        formData.append('address', address.trim());
      }
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await fetch(`${API_BASE}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setGender('');
        setAddress('');
        setAvatar(null);
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
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-green-600">Nhà Thuốc Thông Minh</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>Việt Nam - Tiếng việt</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <DialogHeader className="text-left mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Hoàn thiện thông tin cá nhân
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Vui lòng cung cấp thông tin cá nhân để hoàn tất quá trình đăng ký
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Ảnh đại diện
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img 
                      src={URL.createObjectURL(avatar)} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG tối đa 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Họ <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nhập họ của bạn"
                className={`h-12 rounded-lg ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } focus:border-green-500 focus:ring-green-500`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                onBlur={() => handleFieldBlur('firstName', firstName)}
              />
              {errors.firstName && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-600 text-sm">
                    {errors.firstName}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nhập tên của bạn"
                className={`h-12 rounded-lg ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } focus:border-green-500 focus:ring-green-500`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                onBlur={() => handleFieldBlur('lastName', lastName)}
              />
              {errors.lastName && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-600 text-sm">
                    {errors.lastName}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                className={`h-12 rounded-lg ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                } focus:border-green-500 focus:ring-green-500`}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                onBlur={() => handleFieldBlur('dateOfBirth', dateOfBirth)}
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

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'male', label: 'Nam' },
                  { value: 'female', label: 'Nữ' },
                  { value: 'other', label: 'Khác' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setGender(option.value);
                      handleFieldBlur('gender', option.value);
                    }}
                    className={`h-12 rounded-lg border-2 text-sm font-medium transition-colors ${
                      gender === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-600 text-sm">
                    {errors.gender}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nhập địa chỉ của bạn"
                className={`h-12 rounded-lg ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } focus:border-green-500 focus:ring-green-500`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                onBlur={() => handleFieldBlur('address', address)}
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg text-base font-medium bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Hoàn thiện thông tin'}
            </Button>
          </div>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Bỏ qua và hoàn thiện sau
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
