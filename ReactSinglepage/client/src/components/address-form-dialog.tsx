import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, User, Phone, Home, Building, ChevronDown } from "lucide-react";
import { vietnamProvinces, getDistrictsByProvince, getWardsByDistrict } from "@/data/vietnam-addresses";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Address {
  _id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  address: string;
  addressType: 'home' | 'company';
  isDefault: boolean;
}

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAddress?: Address | null;
}

export default function AddressFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingAddress
}: AddressFormDialogProps) {
  const { token } = useAuth();
  const { toast } = useToast();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [province, setProvince] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [district, setDistrict] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [ward, setWard] = useState("");
  const [wardName, setWardName] = useState("");
  const [address, setAddress] = useState("");
  const [addressType, setAddressType] = useState<'home' | 'company'>('home');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Load editing address data
  useEffect(() => {
    if (editingAddress) {
      setReceiverName(editingAddress.receiverName);
      setReceiverPhone(editingAddress.receiverPhone);
      setProvince(editingAddress.province);
      setProvinceName(editingAddress.provinceName);
      setDistrict(editingAddress.district);
      setDistrictName(editingAddress.districtName);
      setWard(editingAddress.ward);
      setWardName(editingAddress.wardName);
      setAddress(editingAddress.address);
      setAddressType(editingAddress.addressType);
      setIsDefault(editingAddress.isDefault);
    } else {
      // Reset form for new address
      setReceiverName("");
      setReceiverPhone("");
      setProvince("");
      setProvinceName("");
      setDistrict("");
      setDistrictName("");
      setWard("");
      setWardName("");
      setAddress("");
      setAddressType('home');
      setIsDefault(false);
    }
  }, [editingAddress, isOpen]);

  // Update districts when province changes
  useEffect(() => {
    if (province) {
      const newDistricts = getDistrictsByProvince(province);
      setDistricts(newDistricts);
      const selectedProvince = vietnamProvinces.find(p => p.code === province);
      setProvinceName(selectedProvince?.name || "");
      
      // Reset district and ward if province changed
      if (!editingAddress || editingAddress.province !== province) {
        setDistrict("");
        setDistrictName("");
        setWard("");
        setWardName("");
      }
    } else {
      setDistricts([]);
    }
  }, [province]);

  // Update wards when district changes
  useEffect(() => {
    if (province && district) {
      const newWards = getWardsByDistrict(province, district);
      setWards(newWards);
      const selectedDistrict = districts.find(d => d.code === district);
      setDistrictName(selectedDistrict?.name || "");
      
      // Reset ward if district changed
      if (!editingAddress || editingAddress.district !== district) {
        setWard("");
        setWardName("");
      }
    } else {
      setWards([]);
    }
  }, [district, province]);

  // Update ward name when ward changes
  useEffect(() => {
    if (ward) {
      const selectedWard = wards.find(w => w.code === ward);
      setWardName(selectedWard?.name || "");
    }
  }, [ward, wards]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setReceiverPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!receiverName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ và tên",
        variant: "destructive",
      });
      return;
    }

    if (!receiverPhone.trim() || !validatePhone(receiverPhone)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (!province || !district || !ward || !address.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin địa chỉ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingAddress 
        ? `${API_BASE}/api/addresses/${editingAddress._id}`
        : `${API_BASE}/api/addresses`;
      
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          province,
          provinceName,
          district,
          districtName,
          ward,
          wardName,
          address: address.trim(),
          addressType,
          isDefault,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thành công",
          description: editingAddress ? "Địa chỉ đã được cập nhật thành công" : "Địa chỉ đã được thêm thành công",
        });
        onSuccess();
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingAddress ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receiver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiverName" className="mb-2 block">
                Họ và tên *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="receiverName"
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="receiverPhone" className="mb-2 block">
                Số điện thoại *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="receiverPhone"
                  type="text"
                  value={receiverPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={`pl-10 ${receiverPhone && !validatePhone(receiverPhone) ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {receiverPhone && !validatePhone(receiverPhone) && (
                <p className="text-red-500 text-xs mt-1">Số điện thoại không hợp lệ</p>
              )}
            </div>
          </div>

          {/* Address Selection */}
          <div className="space-y-4">
            <Label>Địa chỉ *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full pl-10 pr-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {vietnamProvinces.map((prov, index) => (
                    <option key={`province-${prov.code}-${index}`} value={prov.code}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                  className="w-full pl-10 pr-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-100"
                  required
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((dist, index) => (
                    <option key={`district-${dist.code}-${index}`} value={dist.code}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  disabled={!district}
                  className="w-full pl-10 pr-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-100"
                  required
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w, index) => (
                    <option key={`ward-${w.code}-${index}`} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="mb-2 block">
                Số nhà, tên đường *
              </Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập số nhà, tên đường"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Type */}
          <div>
            <Label className="mb-2 block">Loại địa chỉ *</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAddressType('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  addressType === 'home'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Home className="h-4 w-4" />
                Nhà riêng
              </button>
              <button
                type="button"
                onClick={() => setAddressType('company')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  addressType === 'company'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Building className="h-4 w-4" />
                Công ty
              </button>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isDefault" className="ml-2 cursor-pointer">
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

