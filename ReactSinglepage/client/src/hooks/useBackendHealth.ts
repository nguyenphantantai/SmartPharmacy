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
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 30 * 1000, // 30 giây
    refetchInterval: 60 * 1000, // Kiểm tra lại mỗi phút
  });
}
