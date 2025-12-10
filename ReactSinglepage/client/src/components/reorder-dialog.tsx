import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Product } from '@shared/schema';
import { getImageUrl } from '@/lib/imageUtils';
import { API_BASE } from '@/lib/utils';

interface ReorderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
  unit: string;
}

interface UnavailableItem {
  productId: string;
  quantity: number;
  name: string;
  reason: string;
  availableStock: number;
}

interface ReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

export function ReorderDialog({ open, onOpenChange, orderId }: ReorderDialogProps) {
  const [items, setItems] = useState<ReorderItem[]>([]);
  const [unavailableItems, setUnavailableItems] = useState<UnavailableItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const { apiRequest } = useApiRequest();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Load reorder data from API
  useEffect(() => {
    if (open && orderId) {
      loadReorderData();
    }
  }, [open, orderId]);

  const loadReorderData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('POST', `/api/orders/${orderId}/reorder`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.availableItems || []);
        setUnavailableItems(data.data.unavailableItems || []);
      }
    } catch (error) {
      console.error('Error loading reorder data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin đơn hàng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/products?search=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.products || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item
  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Add new product from search
  const addProductFromSearch = (product: Product) => {
    // Check if product already exists in items
    const existingItem = items.find((item) => item.productId === (product._id || product.id));
    if (existingItem) {
      updateQuantity(existingItem.productId, 1);
    } else {
      const newItem: ReorderItem = {
        productId: product._id || product.id || '',
        quantity: 1,
        price: parseInt(product.price),
        name: product.name,
        imageUrl: product.imageUrl || '',
        unit: product.unit || 'Hộp',
      };
      setItems((prev) => [...prev, newItem]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Add all to cart
  const handleAddToCart = () => {
    if (items.length === 0) {
      toast({
        title: 'Cảnh báo',
        description: 'Vui lòng chọn ít nhất một sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    // Add each item to cart
    items.forEach((item) => {
      const product: Product = {
        id: item.productId,
        _id: item.productId,
        name: item.name,
        price: item.price.toString(),
        imageUrl: item.imageUrl,
        unit: item.unit,
        description: '',
        category: '',
      } as Product;

      addItem(product, item.quantity, false);
    });

    toast({
      title: 'Thành công',
      description: `Đã thêm ${items.length} sản phẩm vào giỏ hàng`,
    });

    onOpenChange(false);
    setLocation('/cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
          <DialogDescription>
            Thêm, bớt số lượng hoặc xóa sản phẩm trước khi đặt lại
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Search for new products */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm sản phẩm để thêm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product._id || product.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addProductFromSearch(product)}
                    >
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `${API_BASE}/medicine-images/default-medicine.jpg`;
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(parseInt(product.price))} / {product.unit}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available items */}
            {items.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Sản phẩm ({items.length})</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `${API_BASE}/medicine-images/default-medicine.jpg`;
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} / {item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unavailable items */}
            {unavailableItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600">
                  Sản phẩm không có sẵn ({unavailableItems.length})
                </h3>
                <div className="space-y-2">
                  {unavailableItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-red-600">
                          {item.reason} {item.availableStock > 0 && `(Còn ${item.availableStock})`}
                        </p>
                      </div>
                      <Badge variant="destructive">{item.reason}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Tổng tiền:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            )}

            {items.length === 0 && unavailableItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có sản phẩm nào trong đơn hàng này
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddToCart} disabled={items.length === 0 || loading}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Thêm vào giỏ hàng ({items.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

