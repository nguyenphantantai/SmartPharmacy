import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/lib/utils';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ isOpen, onClose, onSwitchToRegister }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const { toast } = useToast();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'Nhập tài khoản tên hoặc email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Nhập mật khẩu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use AuthContext to handle login
        login(data.data.user, data.data.token);
        
        toast({
          title: "Đăng nhập thành công",
          description: `Chào mừng ${data.data.user.firstName} ${data.data.user.lastName}!`,
        });
        
        onClose();
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Quên mật khẩu",
      description: "Tính năng này sẽ được hỗ trợ sớm",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden bg-white">
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
            <DialogTitle className="text-2xl font-bold text-gray-900">Đăng nhập</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Username/Email/Phone Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Tài khoản NhaThuocAI, Email hoặc số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Tài khoản NhaThuocAI, Email hoặc số điện thoại"
                className="h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              {errors.username && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-600 text-sm">
                    {errors.username}
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
                  className="h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full h-12 rounded-lg text-base font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              Đăng Nhập Ngay
            </Button>

            {/* Create Account Button */}
            <Button
              onClick={onSwitchToRegister}
              variant="outline"
              className="w-full h-12 rounded-lg text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Đăng Ký 
            </Button>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Điều Khoản Dịch Vụ</span>
            <span className="mx-2">và</span>
            <span>Chính Sách Bảo Mật</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
