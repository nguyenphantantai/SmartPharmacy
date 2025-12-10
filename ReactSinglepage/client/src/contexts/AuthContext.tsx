import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Thêm loading state
  login: (userData: User, token: string) => void;
  logout: () => void;
  showLoginDialog: () => void;
  hideLoginDialog: () => void;
  isLoginDialogOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Thêm loading state
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    console.log('AuthContext initialization:', {
      hasStoredToken: !!storedToken,
      hasStoredUser: !!storedUser,
      tokenLength: storedToken?.length || 0
    });
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('AuthContext: User loaded from localStorage');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    
    // Đánh dấu đã khởi tạo xong
    setIsInitialized(true);
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('AuthContext: Login called with user:', userData);
    console.log('AuthContext: Login called with token:', authToken.substring(0, 20) + '...');
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoginDialogOpen(false);
    
    console.log('AuthContext: Login completed, user set:', !!userData, 'token set:', !!authToken);
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoginDialogOpen(false);
    console.log('AuthContext: Logout completed');
  };

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  // Handle authentication errors globally
  const handleAuthError = () => {
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
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isInitialized,
    login,
    logout,
    showLoginDialog,
    hideLoginDialog,
    isLoginDialogOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for global auth error handling
export const AuthContextInstance = AuthContext;
