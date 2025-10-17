import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
    unit: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

export const useOrders = (limit?: number) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = [
        apiRequest("GET", limit ? `/api/orders?limit=${limit}` : '/api/orders'),
        ...(limit ? [] : [apiRequest("GET", '/api/orders/stats')])
      ];

      const responses = await Promise.all(promises);
      const ordersData = await responses[0].json();

      if (ordersData.success) {
        setOrders(ordersData.data);
      } else {
        setError(ordersData.message || 'Không thể tải đơn hàng');
      }

      if (!limit && responses[1]) {
        const statsData = await responses[1].json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    // Listen for focus events to refresh when user comes back to tab
    const handleFocus = () => {
      fetchOrders();
    };

    // Listen for storage events (when order is created in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orderCreated') {
        fetchOrders();
        // Clear the storage event
        localStorage.removeItem('orderCreated');
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchOrders]);

  const refresh = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    stats,
    loading,
    error,
    refresh
  };
};
