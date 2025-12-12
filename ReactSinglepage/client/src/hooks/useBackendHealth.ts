import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/lib/utils";

export function useBackendHealth() {
  return useQuery({
    queryKey: ["/api/health"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/health`);
      if (!response.ok) {
        throw new Error("Backend health check failed");
      }
      return await response.json();
    },
    retry: 2, // Giảm số lần retry
    retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000), // Tăng delay giữa các retry
    staleTime: 5 * 60 * 1000, // 5 phút - tăng staleTime
    refetchInterval: 5 * 60 * 1000, // Kiểm tra lại mỗi 5 phút thay vì 1 phút
    refetchOnWindowFocus: false, // Không refetch khi focus window
    refetchOnMount: false, // Không refetch khi mount lại
    refetchOnReconnect: true, // Chỉ refetch khi reconnect
  });
}
