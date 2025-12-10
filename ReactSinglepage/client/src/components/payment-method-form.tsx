import { CreditCard, Wallet, Banknote } from "lucide-react";

interface PaymentMethodFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const paymentMethods = [
  { 
    id: "cash", 
    label: "Thanh toán tiền mặt khi nhận hàng",
    description: "Bạn sẽ thanh toán khi nhận được hàng",
    icon: Banknote,
    color: "text-green-600"
  },
  { 
    id: "vnpay", 
    label: "Thanh toán bằng VNPay",
    description: "Thanh toán nhanh qua VNPay",
    icon: CreditCard,
    color: "text-blue-600"
  },
  { 
    id: "momo", 
    label: "Thanh toán bằng ví MoMo",
    description: "Thanh toán nhanh qua ví MoMo",
    icon: Wallet,
    color: "text-pink-600"
  }
];

export default function PaymentMethodForm({ paymentMethod, onPaymentMethodChange }: PaymentMethodFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        Chọn phương thức thanh toán
      </h3>
      
      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = paymentMethod === method.id;
          
          return (
            <label 
              key={method.id} 
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                checked={isSelected}
                onChange={() => onPaymentMethodChange(method.id)}
              />
              <div className="flex items-start gap-3 flex-1">
                <IconComponent className={`h-5 w-5 mt-0.5 ${method.color}`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
