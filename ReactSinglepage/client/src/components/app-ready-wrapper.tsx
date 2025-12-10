import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { Skeleton } from '@/components/ui/skeleton';

interface AppReadyWrapperProps {
  children: ReactNode;
}

export default function AppReadyWrapper({ children }: AppReadyWrapperProps) {
  const { isInitialized } = useAuth();
  const { data: healthData, isLoading: isHealthLoading, error: healthError } = useBackendHealth();

  // Hiển thị loading khi AuthContext chưa sẵn sàng hoặc backend chưa healthy
  if (!isInitialized || isHealthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            {!isInitialized ? 'Đang khởi tạo ứng dụng...' : 'Đang kiểm tra kết nối server...'}
          </p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu backend không sẵn sàng
  if (healthError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-destructive text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Không thể kết nối server</h2>
          <p className="text-muted-foreground">
            Vui lòng kiểm tra kết nối mạng và thử lại sau. Server có thể đang được khởi động.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Mọi thứ đã sẵn sàng, hiển thị app
  return <>{children}</>;
}
