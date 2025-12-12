import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE } from "./utils";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`);
    (error as any).status = res.status;
    (error as any).responseText = text;
    
    // Đặc biệt xử lý 429 (Too Many Requests) - không throw ngay để tránh retry liên tục
    if (res.status === 429) {
      console.warn('⚠️ Rate limit exceeded (429). Please wait before retrying.');
      // Đợi ít nhất 10 giây trước khi retry
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {};
  
  if (data) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.startsWith("http") ? url : `${API_BASE}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const path = queryKey.join("/") as string;
    
    // Skip health check for health endpoint itself
    if (path.includes('/api/health')) {
      const res = await fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, {
        credentials: "include",
      });
      await throwIfResNotOk(res);
      return await res.json();
    }
    
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false, // Tắt refetch khi focus để tránh gọi API quá nhiều
      staleTime: 5 * 60 * 1000, // 5 phút - tăng staleTime để giảm số lần refetch
      retry: (failureCount, error: any) => {
        // Không retry khi gặp lỗi 429 (Too Many Requests)
        if (error?.status === 429) {
          return false;
        }
        // Chỉ retry tối đa 2 lần cho các lỗi khác
        return failureCount < 2;
      },
      retryDelay: (attemptIndex, error: any) => {
        // Nếu là lỗi 429, đợi lâu hơn (30 giây)
        if (error?.status === 429) {
          return 30000;
        }
        // Exponential backoff cho các lỗi khác
        return Math.min(5000 * 2 ** attemptIndex, 30000);
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Không retry khi gặp lỗi 429
        if (error?.status === 429) {
          return false;
        }
        // Chỉ retry 1 lần cho mutations
        return failureCount < 1;
      },
    },
  },
});
