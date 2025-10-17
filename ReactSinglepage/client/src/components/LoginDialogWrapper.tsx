import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GarenaAuthDialog from '@/components/garena-auth-dialog';

interface LoginDialogWrapperProps {
  children: React.ReactNode;
}

export const LoginDialogWrapper: React.FC<LoginDialogWrapperProps> = ({ children }) => {
  const { isLoginDialogOpen, hideLoginDialog } = useAuth();

  useEffect(() => {
    // Auto-hide dialog after 5 seconds if user doesn't interact
    if (isLoginDialogOpen) {
      const timer = setTimeout(() => {
        hideLoginDialog();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoginDialogOpen, hideLoginDialog]);

  return (
    <>
      {children}
      {isLoginDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Phiên đăng nhập đã hết hạn</h2>
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ.
            </p>
            <div className="flex gap-3">
              <GarenaAuthDialog>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Đăng nhập
                </button>
              </GarenaAuthDialog>
              <button 
                onClick={hideLoginDialog}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
