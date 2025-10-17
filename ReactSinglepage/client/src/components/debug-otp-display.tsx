import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, RefreshCw, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/utils';

interface DebugOTPDisplayProps {
  phoneNumber: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function DebugOTPDisplay({ 
  phoneNumber, 
  isVisible, 
  onToggleVisibility 
}: DebugOTPDisplayProps) {
  const [otpCode, setOtpCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useBackendOTP, setUseBackendOTP] = useState(false);
  const { toast } = useToast();

  // Generate a random 6-digit OTP for testing (frontend only)
  const generateFrontendOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(otp);
    console.log(`🔐 [DEBUG OTP] Generated frontend OTP for ${phoneNumber}: ${otp}`);
    console.log(`🔐 [DEBUG OTP] This is a test OTP for development purposes`);
    return otp;
  };

  // Generate OTP via backend API
  const generateBackendOTP = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch(`${API_BASE}/api/auth/debug-generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate backend OTP');
      }

      const data = await response.json();
      if (data.success) {
        setOtpCode(data.data.otp);
        console.log(`🔐 [DEBUG OTP] Generated backend OTP for ${phoneNumber}: ${data.data.otp}`);
        console.log(`🔐 [DEBUG OTP] Expires at: ${data.data.expiresAt}`);
        toast({
          title: "Backend OTP Generated",
          description: `Mã OTP từ backend: ${data.data.otp}`,
        });
      }
    } catch (error) {
      console.error('Error generating backend OTP:', error);
      toast({
        title: "Lỗi tạo OTP",
        description: "Không thể tạo OTP từ backend, sử dụng OTP frontend",
        variant: "destructive",
      });
      generateFrontendOTP();
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate OTP when component mounts
  useEffect(() => {
    if (phoneNumber && !otpCode) {
      generateFrontendOTP();
    }
  }, [phoneNumber]);

  const handleCopyOTP = async () => {
    if (otpCode) {
      try {
        await navigator.clipboard.writeText(otpCode);
        toast({
          title: "Đã sao chép mã OTP",
          description: `Mã ${otpCode} đã được sao chép vào clipboard`,
        });
      } catch (err) {
        console.error('Failed to copy OTP:', err);
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép mã OTP",
          variant: "destructive",
        });
      }
    }
  };

  const handleRegenerateOTP = () => {
    if (useBackendOTP) {
      generateBackendOTP();
    } else {
      setIsGenerating(true);
      setTimeout(() => {
        generateFrontendOTP();
        setIsGenerating(false);
        toast({
          title: "Mã OTP mới",
          description: "Đã tạo mã OTP mới cho testing",
        });
      }, 500);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleVisibility}
          variant="outline"
          size="sm"
          className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
        >
          <Eye className="h-4 w-4 mr-2" />
          Show Debug OTP
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="text-yellow-800">🔐 Debug OTP</span>
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-600">
            <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
            <p className="text-yellow-700 mt-1">
              ⚠️ Chế độ debug - Chỉ dùng cho testing
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-lg font-mono bg-white">
              {otpCode || '------'}
            </Badge>
            <Button
              onClick={handleCopyOTP}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useBackendOTP"
                checked={useBackendOTP}
                onChange={(e) => setUseBackendOTP(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useBackendOTP" className="text-xs text-gray-600">
                Sử dụng Backend OTP
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleRegenerateOTP}
                variant="outline"
                size="sm"
                disabled={isGenerating}
                className="flex-1 text-xs"
              >
                {isGenerating ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                {useBackendOTP ? 'Tạo từ Backend' : 'Tạo Frontend'}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            <p><strong>Hướng dẫn:</strong></p>
            <p>1. Nhập mã OTP này vào form xác thực</p>
            <p>2. Mã này chỉ có hiệu lực trong môi trường debug</p>
            <p>3. Kiểm tra console để xem log chi tiết</p>
            <p>4. Backend OTP sẽ được lưu trong server để verify</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
