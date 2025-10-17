import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const useApiRequest = () => {
  const { token, logout, showLoginDialog } = useAuth();
  const { toast } = useToast();

  const apiRequest = async (
    method: string,
    url: string,
    data?: unknown
  ): Promise<Response> => {
    const headers: Record<string, string> = {};
    
    if (data) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
    
    // Debug logging
    console.log('API Request:', {
      method,
      url: fullUrl,
      hasToken: !!token,
      headers
    });
    
    try {
      const res = await fetch(fullUrl, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

      console.log('API Response:', {
        status: res.status,
        statusText: res.statusText,
        url: res.url
      });

      // Handle authentication errors
      if (res.status === 401 || res.status === 403) {
        // For checkout and order tracking, don't immediately logout - let the backend handle guest fallback
        if ((url.includes('/api/orders') && method === 'POST') || url.includes('/api/orders/track')) {
          // Let the backend handle guest order creation/tracking
          console.log('Authentication failed for order operation, backend will handle guest fallback');
          // Don't throw error, let the backend handle it
        } else {
          logout();
          toast({
            title: "Phiên đăng nhập đã hết hạn",
            description: "Vui lòng đăng nhập lại để tiếp tục",
            variant: "destructive"
          });
          // Show login dialog after a short delay
          setTimeout(() => {
            showLoginDialog();
          }, 1000);
          throw new Error(`Authentication failed: ${res.status}`);
        }
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return { apiRequest };
};
