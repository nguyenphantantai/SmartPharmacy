import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Package, Truck } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  pending: { 
    label: "Chờ xác nhận", 
    color: "bg-yellow-500 hover:bg-yellow-600", 
    icon: Clock 
  },
  confirmed: { 
    label: "Đã xác nhận", 
    color: "bg-blue-500 hover:bg-blue-600", 
    icon: CheckCircle 
  },
  preparing: { 
    label: "Đang chuẩn bị", 
    color: "bg-orange-500 hover:bg-orange-600", 
    icon: Package 
  },
  shipping: { 
    label: "Đang giao hàng", 
    color: "bg-purple-500 hover:bg-purple-600", 
    icon: Truck 
  },
  delivered: { 
    label: "Đã giao hàng", 
    color: "bg-green-500 hover:bg-green-600", 
    icon: CheckCircle 
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "bg-red-500 hover:bg-red-600", 
    icon: CheckCircle 
  }
};

export default function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = statusInfo.icon;

  return (
    <Badge className={`${statusInfo.color} text-white transition-colors duration-300 ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {statusInfo.label}
    </Badge>
  );
}
