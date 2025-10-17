import { User, Phone, Mail } from "lucide-react";

interface SenderFormData {
  senderName: string;
  senderPhone: string;
  senderEmail: string;
}

interface SenderFormProps {
  formData: SenderFormData;
  onFormDataChange: (data: SenderFormData) => void;
}

export default function SenderForm({ formData, onFormDataChange }: SenderFormProps) {
  const handleInputChange = (field: keyof SenderFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const validateEmail = (email: string) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        Thông tin người đặt hàng
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Họ và tên người đặt *" 
            value={formData.senderName}
            onChange={(e) => handleInputChange("senderName", e.target.value)}
            required
          />
        </div>
        
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            className={`h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formData.senderPhone && !validatePhone(formData.senderPhone) 
                ? 'border-red-500' 
                : ''
            }`}
            placeholder="Số điện thoại *" 
            value={formData.senderPhone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              handleInputChange("senderPhone", formatted);
            }}
            required
          />
          {formData.senderPhone && !validatePhone(formData.senderPhone) && (
            <p className="text-red-500 text-xs mt-1">Số điện thoại không hợp lệ</p>
          )}
        </div>
        
        <div className="relative md:col-span-2">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            className={`h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formData.senderEmail && !validateEmail(formData.senderEmail) 
                ? 'border-red-500' 
                : ''
            }`}
            placeholder="Email (không bắt buộc)" 
            value={formData.senderEmail}
            onChange={(e) => handleInputChange("senderEmail", e.target.value)}
            type="email"
          />
          {formData.senderEmail && !validateEmail(formData.senderEmail) && (
            <p className="text-red-500 text-xs mt-1">Email không hợp lệ</p>
          )}
        </div>
      </div>
    </div>
  );
}
