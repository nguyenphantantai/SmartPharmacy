import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, User, Phone, Mail, Home, Save } from "lucide-react";
import { vietnamProvinces, getDistrictsByProvince, getWardsByDistrict } from "@/data/vietnam-addresses";
import SavedAddresses from "./saved-addresses";

interface AddressFormData {
  receiverName: string;
  receiverPhone: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  address: string;
}

interface AddressFormProps {
  formData: AddressFormData;
  onFormDataChange: (data: AddressFormData) => void;
  senderData?: {
    name: string;
    phone: string;
  };
}

export default function AddressForm({ formData, onFormDataChange, senderData }: AddressFormProps) {
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [showCopyButton, setShowCopyButton] = useState(false);

  // Update districts when province changes
  useEffect(() => {
    if (formData.province) {
      const newDistricts = getDistrictsByProvince(formData.province);
      setDistricts(newDistricts);
      const selectedProvince = vietnamProvinces.find(p => p.code === formData.province);
      // Reset district and ward when province changes
      onFormDataChange({
        ...formData,
        district: "",
        districtName: "",
        ward: "",
        wardName: "",
        provinceName: selectedProvince?.name || ""
      });
    } else {
      setDistricts([]);
    }
  }, [formData.province]);

  // Update wards when district changes
  useEffect(() => {
    if (formData.province && formData.district) {
      const newWards = getWardsByDistrict(formData.province, formData.district);
      setWards(newWards);
      const selectedDistrict = districts.find(d => d.code === formData.district);
      // Reset ward when district changes
      onFormDataChange({
        ...formData,
        ward: "",
        wardName: "",
        districtName: selectedDistrict?.name || ""
      });
    } else {
      setWards([]);
    }
  }, [formData.district]);

  // Show copy button when sender data is available
  useEffect(() => {
    setShowCopyButton(!!(senderData?.name && senderData?.phone));
  }, [senderData]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    if (field === "province") {
      const selectedProvince = vietnamProvinces.find(p => p.code === value);
      onFormDataChange({
        ...formData,
        [field]: value,
        provinceName: selectedProvince?.name || "",
        district: "",
        districtName: "",
        ward: "",
        wardName: ""
      });
    } else if (field === "district") {
      const selectedDistrict = districts.find(d => d.code === value);
      onFormDataChange({
        ...formData,
        [field]: value,
        districtName: selectedDistrict?.name || "",
        ward: "",
        wardName: ""
      });
    } else if (field === "ward") {
      const selectedWard = wards.find(w => w.code === value);
      onFormDataChange({
        ...formData,
        [field]: value,
        wardName: selectedWard?.name || ""
      });
    } else {
      onFormDataChange({
        ...formData,
        [field]: value
      });
    }
  };

  const copySenderInfo = () => {
    if (senderData) {
      onFormDataChange({
        ...formData,
        receiverName: senderData.name,
        receiverPhone: senderData.phone
      });
    }
  };

  const saveCurrentAddress = () => {
    if (!formData.receiverName || !formData.receiverPhone || !formData.province || 
        !formData.district || !formData.ward || !formData.address) {
      return;
    }

    const savedAddresses = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
    const newAddress = {
      id: Date.now().toString(),
      name: formData.receiverName,
      phone: formData.receiverPhone,
      province: formData.province,
      provinceName: formData.provinceName,
      district: formData.district,
      districtName: formData.districtName,
      ward: formData.ward,
      wardName: formData.wardName,
      address: formData.address,
      isDefault: savedAddresses.length === 0
    };

    savedAddresses.push(newAddress);
    localStorage.setItem('saved_addresses', JSON.stringify(savedAddresses));
  };

  const selectSavedAddress = (address: any) => {
    onFormDataChange({
      receiverName: address.name,
      receiverPhone: address.phone,
      province: address.province,
      provinceName: address.provinceName || "",
      district: address.district,
      districtName: address.districtName || "",
      ward: address.ward,
      wardName: address.wardName || "",
      address: address.address
    });
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className="space-y-6">
      {/* Header with copy button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Địa chỉ nhận hàng
        </h3>
        <div className="flex items-center gap-2">
          {showCopyButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copySenderInfo}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy thông tin người đặt
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={saveCurrentAddress}
            className="flex items-center gap-2"
            disabled={!formData.receiverName || !formData.receiverPhone || !formData.province || 
                     !formData.district || !formData.ward || !formData.address}
          >
            <Save className="h-4 w-4" />
            Lưu địa chỉ
          </Button>
        </div>
      </div>

      {/* Saved Addresses */}
      <SavedAddresses onSelectAddress={selectSavedAddress} />

      {/* Receiver Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Họ và tên người nhận *" 
            value={formData.receiverName}
            onChange={(e) => handleInputChange("receiverName", e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            className={`h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formData.receiverPhone && !validatePhone(formData.receiverPhone) 
                ? 'border-red-500' 
                : ''
            }`}
            placeholder="Số điện thoại *" 
            value={formData.receiverPhone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              handleInputChange("receiverPhone", formatted);
            }}
            required
          />
          {formData.receiverPhone && !validatePhone(formData.receiverPhone) && (
            <p className="text-red-500 text-xs mt-1">Số điện thoại không hợp lệ</p>
          )}
        </div>
      </div>

      {/* Address Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            required
          >
            <option value="">Chọn Tỉnh/Thành phố *</option>
            {vietnamProvinces.map((province, index) => (
              <option key={`province-${province.code}-${index}`} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={formData.district}
            onChange={(e) => handleInputChange("district", e.target.value)}
            disabled={!formData.province}
            required
          >
            <option value="">Chọn Quận/Huyện *</option>
            {districts.map((district, index) => (
              <option key={`district-${district.code}-${index}`} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={formData.ward}
            onChange={(e) => handleInputChange("ward", e.target.value)}
            disabled={!formData.district}
            required
          >
            <option value="">Chọn Phường/Xã *</option>
            {wards.map((ward, index) => (
              <option key={`ward-${ward.code}-${index}`} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detailed Address */}
      <div className="relative">
        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          className="h-11 rounded-md border px-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="Số nhà, tên đường, tòa nhà, căn hộ... *" 
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>

      {/* Address Preview */}
      {formData.province && formData.district && formData.ward && formData.address && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Địa chỉ nhận hàng:</h4>
          <p className="text-blue-800 text-sm">
            {formData.address}, {formData.wardName}, {formData.districtName}, {formData.provinceName}
          </p>
        </div>
      )}
    </div>
  );
}
