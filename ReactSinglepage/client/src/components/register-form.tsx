import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/utils';
import GarenaStyleProfileForm from './garena-style-profile-form';
import FirebaseOTPDialog from './firebase-otp-dialog';
import OTPVerificationDialog from './otp-verification-dialog';

interface RegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ isOpen, onClose, onSwitchToLogin }: RegisterFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    otp?: string;
  }>({});
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(true);
  const [showFirebaseOTP, setShowFirebaseOTP] = useState(false);
  const [showBackendOTP, setShowBackendOTP] = useState(false);
  const [useFirebaseOTP, setUseFirebaseOTP] = useState(false); // Use backend OTP for testing
  const { toast } = useToast();

  // Debug state changes
  useEffect(() => {
    console.log('showCompleteProfile state changed:', showCompleteProfile);
    console.log('showCompleteProfile state changed at:', new Date().toISOString());
  }, [showCompleteProfile]);

  // Simple function to show complete profile form (no longer needed with new flow)
  // const showCompleteProfileForm = () => {
  //   setShowCompleteProfile(true);
  // };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Individual field validation functions
  const validatePhone = (phoneValue: string) => {
    if (!phoneValue.trim()) {
      return 'Nhập số điện thoại';
    }
    const cleanPhone = phoneValue.replace(/\s/g, '');
    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return 'Số điện thoại Việt Nam không hợp lệ (VD: 0987654321)';
    }
    return '';
  };

  const validateEmail = (emailValue: string) => {
    if (!emailValue.trim()) {
      return 'Email là bắt buộc';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailValue)) {
      return 'Email không hợp lệ (VD: example@gmail.com)';
    }
    return '';
  };

  const validatePassword = (passwordValue: string) => {
    if (!passwordValue.trim()) {
      return 'Mật khẩu là bắt buộc';
    }
    if (passwordValue.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPasswordValue: string) => {
    if (!confirmPasswordValue.trim()) {
      return 'Vui lòng xác nhận mật khẩu';
    }
    if (password !== confirmPasswordValue) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  };

  const validateOTP = (otpValue: string) => {
    if (!otpValue.trim()) {
      return 'Nhập mã xác thực';
    }
    if (otpValue.length !== 6) {
      return 'Mã xác thực phải có 6 chữ số';
    }
    if (!/^\d{6}$/.test(otpValue)) {
      return 'Mã xác thực chỉ được chứa số';
    }
    return '';
  };

  // Handle field blur validation
  const handleFieldBlur = (field: string, value: string) => {
    let errorMessage = '';
    
    switch (field) {
      case 'phone':
        errorMessage = validatePhone(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(value);
        break;
      case 'otp':
        errorMessage = validateOTP(value);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  const validateForm = () => {
    const newErrors: {
      phone?: string;
      password?: string;
      confirmPassword?: string;
      email?: string;
      otp?: string;
    } = {};
    
    // Use individual validation functions
    newErrors.phone = validatePhone(phone);
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    newErrors.confirmPassword = validateConfirmPassword(confirmPassword);
    newErrors.otp = validateOTP(otp);
    
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => newErrors[key as keyof typeof newErrors]).length === 0;
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại trước",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    console.log('🔥 Register Form - Opening OTP Dialog');
    console.log('📱 Phone:', phone);
    console.log('📋 User Data:', { phone, password, email, country: 'Vietnam' });
    
    // Show OTP dialog for manual input
    if (useFirebaseOTP) {
      console.log('🔥 Using Firebase OTP Dialog');
      setShowFirebaseOTP(true);
    } else {
      console.log('🔥 Using Backend OTP Dialog');
      setShowBackendOTP(true);
    }
  };

  const handleFirebaseOTPSuccess = (userData: any) => {
    console.log('🔥 Firebase OTP Success:', userData);
    setShowFirebaseOTP(false);
    setOtpSent(true);
    setCountdown(60);
    toast({
      title: "Xác thực thành công",
      description: "Số điện thoại đã được xác thực",
    });
  };

  const handleBackendOTPSuccess = (userData: any) => {
    console.log('🔥 Backend OTP Success:', userData);
    setShowBackendOTP(false);
    
    // Store token and user data
    localStorage.setItem('auth_token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    
    toast({
      title: "Đăng ký thành công",
      description: "Tài khoản đã được tạo thành công!",
    });
    
    // Close form and reload page
    onClose();
    window.location.reload();
  };

  const autoSendOTPAndContinue = async () => {
    try {
      console.log('🔥 Auto sending OTP...');
      
      // Generate unique email for testing to avoid conflicts
      const timestamp = Date.now();
      const uniqueEmail = email.includes('@') ? 
        email.replace('@', `+${timestamp}@`) : 
        `${email}+${timestamp}@gmail.com`;
      
      console.log('🔥 Using unique email for testing:', uniqueEmail);
      
      // Send OTP request to backend
      const response = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          method: 'sms', // Default to SMS
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      const data = await response.json();
      console.log('🔥 OTP Send Response:', data);
      
      // Show OTP in console for testing
      if (data.data?.otp) {
        console.log(`\n🔐 ===== OTP FOR TESTING =====`);
        console.log(`📱 Phone: ${phone}`);
        console.log(`🔢 OTP Code: ${data.data.otp}`);
        console.log(`📡 Method: ${data.method?.toUpperCase()}`);
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`⏳ Expires in: 5 minutes`);
        console.log(`🔐 ============================\n`);
        
        // Also show a more prominent message
        console.warn(`🚨 IMPORTANT: Use OTP Code: ${data.data.otp} for phone ${phone}`);
      }

      // Auto verify OTP (simulate successful verification)
      console.log('🔥 Auto verifying OTP...');
      
      const verifyResponse = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          otp: data.data?.otp || '123456', // Use the OTP from response or fallback
          password,
          email: uniqueEmail, // Use unique email to avoid conflicts
          country: 'Vietnam'
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        
        // Handle specific error cases
        if (verifyResponse.status === 409) {
          console.log('🔥 User already exists, attempting login instead...');
          
          // Try to login with existing credentials
          const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('🔥 Login Success:', loginData);
            
            // Store token and user data
            localStorage.setItem('auth_token', loginData.data.token);
            localStorage.setItem('user', JSON.stringify(loginData.data.user));
            
            toast({
              title: "Đăng nhập thành công",
              description: "Tài khoản đã tồn tại, đã đăng nhập thành công!",
            });
            
            // Close form and reload page
            onClose();
            window.location.reload();
            return;
          } else {
            // If login also fails, show error
            toast({
              title: "Lỗi đăng nhập",
              description: "Email đã tồn tại nhưng mật khẩu không đúng. Vui lòng kiểm tra lại.",
              variant: "destructive",
            });
            return;
          }
        } else {
          throw new Error(error.message || 'Registration failed');
        }
      }

      const registerData = await verifyResponse.json();
      console.log('🔥 Registration Success:', registerData);
      
      // Show success message
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản đã được tạo thành công!",
      });
      
      // Continue to profile completion
      setOtpSent(true);
      setCountdown(60);
      setShowCompleteProfile(true);
      setIsRegisterFormOpen(false);
      
    } catch (error) {
      console.error('🔥 Auto OTP/Register Error:', error);
      toast({
        title: "Lỗi đăng ký",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const requestBody = {
        phone,
        otp,
        password,
        email,
      };
      console.log('Register request body:', requestBody);
      
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Check if profile completion is required
        console.log('requiresProfileCompletion:', data.data.requiresProfileCompletion);
        if (data.data.requiresProfileCompletion) {
          console.log('Setting showCompleteProfile to true');
          
          // Show success toast
          toast({
            title: "Đăng ký thành công",
            description: "Vui lòng hoàn thiện thông tin cá nhân",
          });
          
          // Close register form and show profile form immediately
          console.log('Before setShowCompleteProfile(true)');
          setShowCompleteProfile(true);
          setIsRegisterFormOpen(false);
          console.log('After setShowCompleteProfile(true)');
        } else {
          // Close register form
          onClose();
          
          // Reset form
          setPhone('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
          setOtp('');
          setErrors({});
          setOtpSent(false);
          
          toast({
            title: "Đăng ký thành công",
            description: "Chào mừng bạn đến với Nhà Thuốc Thông Minh!",
          });
          
          // Reload page to update UI
          window.location.reload();
        }
      } else {
        toast({
          title: "Đăng ký thất bại",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      <Dialog open={isOpen && isRegisterFormOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[480px] p-0 overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
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
              <DialogTitle className="text-2xl font-bold text-gray-900">Đăng ký</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Phone Number Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Số điện thoại"
                  className={`h-12 rounded-lg ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleFieldBlur('phone', phone)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  maxLength={11}
                />
                {errors.phone && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.phone}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={`h-12 rounded-lg pr-12 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:border-green-500 focus:ring-green-500`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                    onBlur={() => handleFieldBlur('password', password)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.password}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className={`h-12 rounded-lg pr-12 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:border-green-500 focus:ring-green-500`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                    onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.confirmPassword}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="E-mail"
                  className={`h-12 rounded-lg ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-green-500 focus:ring-green-500`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  onBlur={() => handleFieldBlur('email', email)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email bị bắt buộc để khôi phục tài khoản Nhà Thuốc Thông Minh. Địa chỉ Gmail sẽ được định dạng lại để chặn email trái phép.
                </p>
                {errors.email && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.email}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* OTP Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Mã xác thực <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã OTP 6 chữ số"
                    className={`h-12 rounded-lg flex-1 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    } focus:border-green-500 focus:ring-green-500`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                    onBlur={() => handleFieldBlur('otp', otp)}
                    maxLength={6}
                    disabled={!otpSent}
                  />
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSendingOTP || countdown > 0}
                    className="h-12 px-4 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                  >
                    {isSendingOTP ? 'Đang gửi...' : countdown > 0 ? `${countdown}s` : 'Gửi OTP'}
                  </Button>
                </div>
                {errors.otp && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">
                      {errors.otp}
                    </AlertDescription>
                  </Alert>
                )}
                {otpSent && (
                  <p className="mt-1 text-sm text-green-600">
                    Mã xác thực đã được gửi đến {phone}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <Button
                onClick={handleRegister}
                className="w-full h-12 rounded-lg text-base font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                Đăng Ký Ngay
              </Button>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Bằng cách nhấn Đăng Ký Ngay, bạn đồng ý với </span>
              <span className="text-blue-600 underline cursor-pointer">Điều Khoản Dịch Vụ</span>
              <span> và </span>
              <span className="text-blue-600 underline cursor-pointer">Chính Sách Bảo Mật</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Garena Style Profile Form */}
      <GarenaStyleProfileForm
        isOpen={showCompleteProfile}
        onClose={() => {
          setShowCompleteProfile(false);
          setIsRegisterFormOpen(true);
          // Reset form
          setPhone('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
          setOtp('');
          setErrors({});
          setOtpSent(false);
        }}
        onComplete={() => {
          setShowCompleteProfile(false);
          // Reload page to update UI
          window.location.reload();
        }}
      />

      {/* Firebase OTP Dialog */}
      <FirebaseOTPDialog
        isOpen={showFirebaseOTP}
        onClose={() => setShowFirebaseOTP(false)}
        phoneNumber={phone}
        onVerificationSuccess={handleFirebaseOTPSuccess}
        isRegistration={true}
        userData={{
          phone,
          password,
          email,
          country: 'Vietnam'
        }}
      />

      {/* Backend OTP Dialog */}
      <OTPVerificationDialog
        isOpen={showBackendOTP}
        onClose={() => setShowBackendOTP(false)}
        phoneNumber={phone}
        onVerificationSuccess={handleBackendOTPSuccess}
        isRegistration={true}
        userData={{
          phone,
          password,
          email,
          country: 'Vietnam'
        }}
      />
    </>
  );
}
