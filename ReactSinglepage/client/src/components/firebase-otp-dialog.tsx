import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_BASE } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { auth, initializeRecaptcha, RECAPTCHA_SITE_KEY } from '@/lib/firebase';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import DebugOTPDisplay from './debug-otp-display';

interface FirebaseOTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerificationSuccess: (userData: any) => void;
  isRegistration?: boolean;
  userData?: {
    phone: string;
    password: string;
    email: string;
    country: string;
  };
}

export default function FirebaseOTPDialog({ 
  isOpen, 
  onClose, 
  phoneNumber, 
  onVerificationSuccess,
  isRegistration = false,
  userData
}: FirebaseOTPDialogProps) {
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const [showDebugOTP, setShowDebugOTP] = useState(false);
  const [debugOTP, setDebugOTP] = useState('');
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Generate debug OTP for testing
  const generateDebugOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setDebugOTP(otp);
    console.log(`🔐 [DEBUG OTP] Generated test OTP for ${phoneNumber}: ${otp}`);
    console.log(`🔐 [DEBUG OTP] Use this OTP for testing: ${otp}`);
    console.log(`🔐 [DEBUG OTP] Phone: ${phoneNumber}`);
    console.log(`🔐 [DEBUG OTP] Time: ${new Date().toLocaleString()}`);
    return otp;
  };

  // Initialize reCAPTCHA and send OTP when dialog opens
  useEffect(() => {
    console.log('🔥 Firebase OTP Dialog - useEffect triggered');
    console.log('📱 isOpen:', isOpen);
    console.log('📱 phoneNumber:', phoneNumber);
    
    if (isOpen && phoneNumber) {
      console.log('🔥 Initializing Firebase OTP...');
      
      // Generate debug OTP for testing
      const testOTP = generateDebugOTP();
      
      // Wait for DOM to be ready
      setTimeout(() => {
        initializeFirebaseOTP();
      }, 100);
    }
  }, [isOpen, phoneNumber]);

  const initializeFirebaseOTP = async () => {
    try {
      console.log('🔥 Initializing Firebase OTP...');
      console.log('📱 Phone number:', phoneNumber);
      
      // Check if element exists before initializing
      const element = document.getElementById('recaptcha-container');
      console.log('🔍 Element check:', element);
      
      if (!element) {
        console.error('❌ Element not found, retrying...');
        setTimeout(() => {
          initializeFirebaseOTP();
        }, 200);
        return;
      }
      
      // Clear any existing reCAPTCHA
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      // Initialize reCAPTCHA with proper error handling
      const verifier = initializeRecaptcha('recaptcha-container');
      setRecaptchaVerifier(verifier);

      // Format phone number for Firebase - Fix Vietnamese phone number format
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        // Convert Vietnamese phone number from 0xxx to +84xxx
        formattedPhone = `+84${phoneNumber.substring(1)}`;
      } else if (!phoneNumber.startsWith('+')) {
        // Add +84 if no country code
        formattedPhone = `+84${phoneNumber}`;
      }
      
      console.log('📱 Original phone:', phoneNumber);
      console.log('📱 Formatted phone:', formattedPhone);
      console.log('🔐 Using Firebase Phone Authentication with reCAPTCHA');
      
      // Wait for reCAPTCHA to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send OTP via Firebase Phone Authentication (REAL SMS) - Following Firebase docs
      console.log('🚀 Attempting to send OTP via Firebase...');
      console.log('📱 Auth object:', auth);
      console.log('📱 Verifier object:', verifier);
      console.log('📱 Firebase config check:', {
        apiKey: auth.app.options.apiKey,
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      });
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      
      console.log('✅ OTP sent successfully via Firebase Phone Auth');
      console.log('📱 ConfirmationResult:', confirmationResult);
      
      setConfirmationResult(confirmationResult);
      setCountdown(60);
      
      toast({
        title: "Mã OTP đã được gửi",
        description: `Mã xác thực đã được gửi qua SMS đến ${formattedPhone}`,
      });
      
    } catch (error: any) {
      console.error('❌ Error initializing Firebase OTP:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error object:', error);
      console.error('❌ Firebase config at error:', {
        apiKey: auth.app.options.apiKey,
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      });
      
      // Reset reCAPTCHA on error (as per Firebase docs)
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      
      // Handle specific Firebase errors
      let errorMessage = "Có lỗi xảy ra khi gửi mã OTP";
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Số điện thoại không hợp lệ";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau";
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = "Đã vượt quá giới hạn gửi SMS. Vui lòng thử lại sau";
      } else if (error.code === 'auth/internal-error-encountered') {
        errorMessage = "Lỗi hệ thống Firebase. Vui lòng kiểm tra cấu hình Firebase project và thử lại";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Phone Authentication chưa được kích hoạt trong Firebase Console";
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = "Cấu hình Firebase không hợp lệ. Vui lòng kiểm tra API Key";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Lỗi gửi OTP",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Verify Firebase token mutation
  const verifyFirebaseTokenMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const response = await fetch(`${API_BASE}/api/auth/verify-firebase-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify Firebase token');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        onVerificationSuccess(data.data.user);
      } else {
        toast({
          title: "Xác thực thất bại",
          description: data.message || "Không thể xác thực tài khoản",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Xác thực thất bại",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    await initializeFirebaseOTP();
    setIsResending(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã OTP 6 chữ số",
        variant: "destructive",
      });
      return;
    }

    if (!confirmationResult) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin xác thực",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🔥 Verifying OTP with Firebase...');
      console.log('📱 OTP:', otp);
      
      // Verify OTP using Firebase SDK (following Firebase docs)
      const result = await confirmationResult.confirm(otp);
      
      console.log('✅ OTP verified successfully');
      console.log('👤 Firebase User:', result.user);
      
      // Get ID token from Firebase user
      const idToken = await result.user.getIdToken();
      console.log('🔑 ID Token obtained');
      
      // Verify token with backend
      verifyFirebaseTokenMutation.mutate(idToken);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // Reset reCAPTCHA on error (as per Firebase docs)
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      
      toast({
        title: "Xác thực thất bại",
        description: error instanceof Error ? error.message : "Mã OTP không đúng",
        variant: "destructive",
      });
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., 0942808839 -> 0942 808 839)
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const isLoading = verifyFirebaseTokenMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Xác thực OTP</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {isRegistration 
                ? "Nhà Thuốc Thông Minh sẽ gửi cho bạn 1 mã xác thực (OTP) qua số điện thoại để hoàn tất đăng ký"
                : "Nhà Thuốc Thông Minh sẽ gửi cho bạn 1 mã xác thực (OTP) qua số điện thoại"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Mã OTP đã được gửi đến số điện thoại
            </div>
            <div className="text-lg font-semibold text-primary">
              {formatPhoneNumber(phoneNumber)}
            </div>
          </div>

          {/* reCAPTCHA container - hidden */}
          <div id="recaptcha-container" ref={recaptchaContainerRef} className="hidden"></div>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Nhập mã OTP</div>
            <Input
              type="text"
              placeholder="Nhập mã 6 chữ số"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResending}
              className="text-sm"
            >
              {isResending ? 'Đang gửi...' : countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại'}
            </Button>

            <div className="text-sm text-muted-foreground">
              Mã OTP có hiệu lực trong 5 phút
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleVerifyOTP}
              disabled={!otp || otp.length !== 6 || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
          </div>

          {/* Debug OTP Button */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugOTP(!showDebugOTP)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showDebugOTP ? 'Ẩn Debug OTP' : 'Hiện Debug OTP'}
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Debug OTP Display */}
      {showDebugOTP && (
        <DebugOTPDisplay
          phoneNumber={phoneNumber}
          isVisible={showDebugOTP}
          onToggleVisibility={() => setShowDebugOTP(false)}
        />
      )}
    </Dialog>
  );
}
