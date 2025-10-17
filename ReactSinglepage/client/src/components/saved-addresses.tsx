import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Edit, Plus } from "lucide-react";

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  provinceName?: string;
  district: string;
  districtName?: string;
  ward: string;
  wardName?: string;
  address: string;
  isDefault?: boolean;
}

interface SavedAddressesProps {
  onSelectAddress: (address: SavedAddress) => void;
  onEditAddress?: (address: SavedAddress) => void;
}

export default function SavedAddresses({ onSelectAddress, onEditAddress }: SavedAddressesProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    // Load saved addresses from localStorage
    const saved = localStorage.getItem('saved_addresses');
    if (saved) {
      try {
        setSavedAddresses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved addresses:', error);
      }
    }
  }, []);

  const saveAddresses = (addresses: SavedAddress[]) => {
    setSavedAddresses(addresses);
    localStorage.setItem('saved_addresses', JSON.stringify(addresses));
  };

  const deleteAddress = (id: string) => {
    const updated = savedAddresses.filter(addr => addr.id !== id);
    saveAddresses(updated);
  };

  const setDefaultAddress = (id: string) => {
    const updated = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updated);
  };

  if (savedAddresses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Địa chỉ đã lưu
      </h4>
      
      <div className="space-y-3">
        {savedAddresses.map((address) => (
          <div 
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">{address.name}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Mặc định</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                <p className="text-sm text-gray-700">
                  {address.address}, {address.wardName || address.ward}, {address.districtName || address.district}, {address.provinceName || address.province}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultAddress(address.id);
                    }}
                    className="text-xs"
                  >
                    Đặt mặc định
                  </Button>
                )}
                
                {onEditAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(address.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
