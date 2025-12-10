import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Edit, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/utils";

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
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoSelectedRef = useRef(false);
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset auto-select flag when user changes
    if (lastUserRef.current !== user?._id) {
      hasAutoSelectedRef.current = false;
      lastUserRef.current = user?._id || null;
    }

    const loadAddresses = async () => {
      // If user is logged in, load from API
      if (user && token) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE}/api/addresses`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              // Map API format to component format
              const mappedAddresses = data.data.map((addr: any) => ({
                id: addr._id || addr.id,
                name: addr.receiverName,
                phone: addr.receiverPhone,
                province: addr.province,
                provinceName: addr.provinceName,
                district: addr.district,
                districtName: addr.districtName,
                ward: addr.ward,
                wardName: addr.wardName,
                address: addr.address,
                isDefault: addr.isDefault || false,
              }));
              setSavedAddresses(mappedAddresses);
              
              // Also set default address automatically if exists (only once)
              if (!hasAutoSelectedRef.current) {
                const defaultAddress = mappedAddresses.find((addr: SavedAddress) => addr.isDefault);
                if (defaultAddress) {
                  hasAutoSelectedRef.current = true;
                  // Small delay to ensure form is ready
                  setTimeout(() => {
                    onSelectAddress(defaultAddress);
                  }, 100);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading addresses from API:', error);
          // Fallback to localStorage if API fails
          loadFromLocalStorage();
        } finally {
          setIsLoading(false);
        }
      } else {
        // Fallback to localStorage if not logged in
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const saved = localStorage.getItem('saved_addresses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedAddresses(parsed);
          
          // Auto-select default from localStorage (only once)
          if (!hasAutoSelectedRef.current && parsed.length > 0) {
            const defaultAddress = parsed.find((addr: SavedAddress) => addr.isDefault) || parsed[0];
            if (defaultAddress) {
              hasAutoSelectedRef.current = true;
              setTimeout(() => {
                onSelectAddress(defaultAddress);
              }, 100);
            }
          }
        } catch (error) {
          console.error('Error loading saved addresses:', error);
        }
      }
    };

    loadAddresses();
  }, [user, token]); // Removed onSelectAddress from dependencies to prevent infinite loop

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

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Đang tải địa chỉ...</p>
      </div>
    );
  }

  if (savedAddresses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Địa chỉ đã lưu ({savedAddresses.length})
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
