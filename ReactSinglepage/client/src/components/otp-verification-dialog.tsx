import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_BASE } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationDialogProps {
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

interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string;
  };
}

export default function OTPVerificationDialog({ 
  isOpen, 
  onClose, 
  phoneNumber, 
  onVerificationSuccess,
  isRegistration = false,
  userData
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start countdown when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(60); // 60 seconds countdown
      setOtp('');
      
      // Auto send OTP when dialog opens
      console.log('🔥 OTP Dialog opened, auto sending OTP...');
    console.log('📱 phoneNumber:', phoneNumber);
    sendOTPMutation.mutate({ phone: phoneNumber, method: 'sms' });
    }
  }, [isOpen, phoneNumber]);

  // Send OTP mutation
  const sendOTPMutation = useMutation({
    mutationFn: async ({ phone, method }: { phone: string; method: 'sms' | 'zalo' }) => {
      const response = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          method,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('🔥 OTP Send Response:', data);
      
      // Show OTP in console for testing
      if (data.data?.otp) {
        console.log(`\n🔐 ===== OTP FOR TESTING =====`);
        console.log(`📱 Phone: ${phoneNumber}`);
        console.log(`🔢 OTP Code: ${data.data.otp}`);
        console.log(`📡 Method: ${data.method?.toUpperCase()}`);
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`⏳ Expires in: 5 minutes`);
        console.log(`🔐 ============================\n`);
        
        // Also show a more prominent message
        console.warn(`🚨 IMPORTANT: Use OTP Code: ${data.data.otp} for phone ${phoneNumber}`);
      } else {
        console.log('⚠️ No OTP found in response data:', data);
      }
      
      toast({
        title: "Mã OTP đã được gửi",
        description: `Mã xác thực đã được gửi qua ${data.method === 'sms' ? 'SMS' : 'Zalo'}${data.data?.otp ? ' (Kiểm tra console để xem mã OTP)' : ''}`,
      });
      setCountdown(60);
      setIsResending(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Gửi OTP thất bại",
        description: error.message,
        variant: "destructive",
      });
      setIsResending(false);
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      // Always verify OTP first, regardless of registration status
      const verifyResponse = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.message || 'OTP verification failed');
      }

      const verifyData = await verifyResponse.json();
      
      // If this is for registration and OTP is verified, proceed with registration
      if (isRegistration && userData && verifyData.success) {
        console.log('🔥 OTP verified, proceeding with registration...');
        
        // Generate unique email for testing to avoid conflicts
        const timestamp = Date.now();
        const uniqueEmail = userData.email.includes('@') ? 
          userData.email.replace('@', `+${timestamp}@`) : 
          `${userData.email}+${timestamp}@gmail.com`;
        
        console.log('🔥 Using unique email for registration:', uniqueEmail);
        
        const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            otp,
            password: userData.password,
            email: uniqueEmail, // Use unique email to avoid conflicts
            country: userData.country
          }),
        });

        if (!registerResponse.ok) {
          const error = await registerResponse.json();
          throw new Error(error.message || 'Registration failed');
        }

        return await registerResponse.json();
      }

      return verifyData;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        const successMessage = isRegistration 
          ? "Đăng ký thành công! Chào mừng bạn đến với Nhà Thuốc Thông Minh!"
          : `Xác thực thành công! Chào mừng ${data.data.user.firstName || data.data.user.phone}!`;
        
        toast({
          title: isRegistration ? "Đăng ký thành công" : "Xác thực thành công",
          description: successMessage,
        });
        
        onVerificationSuccess(data.data);
        onClose();
        setOtp('');
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

  const handleSendOTP = (method: 'sms' | 'zalo') => {
    console.log('🔥 handleSendOTP called with method:', method);
    console.log('📱 phoneNumber:', phoneNumber);
    setIsResending(true);
    sendOTPMutation.mutate({ phone: phoneNumber, method });
  };

  const handleVerifyOTP = () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã OTP 6 chữ số",
        variant: "destructive",
      });
      return;
    }

    verifyOTPMutation.mutate({ phone: phoneNumber, otp });
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., 0942808839 -> 0942 808 839)
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const isLoading = sendOTPMutation.isPending || verifyOTPMutation.isPending;

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
            <div className="text-2xl font-bold text-gray-900 mb-6">
              {formatPhoneNumber(phoneNumber)}
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold block mb-2 text-left">Mã xác thực</label>
              <Input 
                placeholder="Nhập mã OTP" 
                className="h-12 rounded-lg border-gray-300 bg-white text-center text-lg tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
              />
            </div>

            <Button 
              className="w-full h-12 rounded-lg text-base font-medium mb-4"
              onClick={handleVerifyOTP}
              disabled={!otp.trim() || otp.length !== 6 || isLoading}
              style={{
                backgroundColor: otp.trim() && otp.length === 6 && !isLoading ? '#3b82f6' : '#d1d5db',
                color: otp.trim() && otp.length === 6 && !isLoading ? 'white' : '#6b7280'
              }}
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            <div className="space-y-3">
              <Button 
                className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                onClick={() => handleSendOTP('zalo')}
                disabled={countdown > 0 || isResending || isLoading}
              >
                {isResending ? 'Đang gửi...' : 'Gửi mã xác thực qua Zalo'}
              </Button>
              
              <Button 
                className="w-full h-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-base font-medium"
                onClick={() => handleSendOTP('sms')}
                disabled={countdown > 0 || isResending || isLoading}
              >
                {isResending ? 'Đang gửi...' : 'Gửi mã xác thực qua SMS'}
              </Button>
            </div>

            {countdown > 0 && (
              <p className="text-sm text-gray-500 mt-3">
                Gửi lại mã sau {countdown} giây
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
