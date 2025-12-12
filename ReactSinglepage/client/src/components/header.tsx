import { Search, User, ShoppingCart, MapPin, Phone, Bell, Menu, ChevronDown, Pill, Stethoscope, Syringe, Thermometer, Sparkles, Heart, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link, useLocation } from "wouter";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/AuthContext";
import GarenaAuthDialog from "./garena-auth-dialog";
import SearchDropdown from "./search-dropdown";
import { SearchProduct } from "@/services/searchService";
import { API_BASE } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [location] = useLocation();
  const isCartPage = location.startsWith("/cart");
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { user, logout, token } = useAuth();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // Close menu when navigating to other pages
    setIsCategoryOpen(false);
    setIsSearchDropdownOpen(false);
  }, [location]);

  // Load unread notification count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user || !token) {
        setUnreadNotificationCount(0);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUnreadNotificationCount(data.data.unreadCount || 0);
          }
        } else if (response.status === 403 || response.status === 401) {
          // Token expired or invalid - logout user
          const data = await response.json().catch(() => ({}));
          if (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN') {
            console.log('Token expired or invalid, logging out...');
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading unread notification count:', error);
      }
    };

    loadUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    // Listen for custom event when notifications are updated
    const handleNotificationsUpdated = (event: CustomEvent) => {
      if (event.detail?.unreadCount !== undefined) {
        setUnreadNotificationCount(event.detail.unreadCount);
      } else {
        // If no count provided, reload from API
        loadUnreadCount();
      }
    };
    
    window.addEventListener('notifications-updated', handleNotificationsUpdated as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', handleNotificationsUpdated as EventListener);
    };
  }, [user, token, logout]);

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchDropdownOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setIsSearchDropdownOpen(true);
  };

  // Handle search input key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchDropdownOpen(false);
    }
  };

  // Handle product selection from search
  const handleProductSelect = (product: SearchProduct) => {
    // You can implement navigation to product detail page here
    console.log('Selected product:', product);
    setIsSearchDropdownOpen(false);
    onSearchChange('');
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchDropdownOpen(false);
    }
  };

  return (
    <>
    <header ref={headerRef} className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 w-full shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center mr-2 sm:mr-4 md:mr-6 shrink-0">
            <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold mr-1 sm:mr-2 leading-tight text-center fade-in hover:opacity-80 transition-opacity">
              <div className="text-white text-shadow">NHÀ THUỐC</div>
              <div className="text-white text-xl sm:text-2xl md:text-3xl text-shadow gradient-text">THÔNG MINH</div>
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 mx-2 sm:mx-4 md:mx-6 max-w-[920px]">
            <div className="relative slide-up">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-colors" />
              <Input
                ref={searchInputRef}
                data-testid="input-search"
                type="text"
                placeholder="Bạn đang tìm gì hôm nay..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyPress={handleSearchKeyPress}
                className="w-full h-10 sm:h-12 pl-8 sm:pl-10 pr-16 sm:pr-20 rounded-full text-foreground bg-white border-0 focus-visible:ring-2 focus-visible:ring-secondary transition-all duration-300 hover:shadow-md focus:shadow-lg mobile-text"
              />
              <Button
                data-testid="button-search"
                onClick={handleSearchClick}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 sm:px-5 h-8 sm:h-9 rounded-full transition-all duration-300 hover:scale-105 mobile-text"
              >
                <span className="hidden sm:inline">Tìm</span>
                <span className="sm:hidden">🔍</span>
              </Button>
              
              {/* Search Dropdown */}
              <SearchDropdown
                query={searchQuery}
                isOpen={isSearchDropdownOpen}
                onClose={() => setIsSearchDropdownOpen(false)}
                onSelectProduct={handleProductSelect}
              />
            </div>
            {/* Suggestion links under search */}
            <div className="mt-2 hidden md:flex flex-wrap gap-4 text-xs text-primary-foreground/90 fade-in">
              {[
                "sữa dinh dưỡng",
                "probiotics",
                "khẩu trang",
                "kem chống nắng",
                "collagen",
                "giải nhiệt",
                "hạ sốt",
                "Mua 1 Tặng 1",
              ].map((label, index) => (
                <button 
                  key={label} 
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(label)}`;
                  }}
                  className="hover:underline transition-all duration-300 hover:text-secondary hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* User actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 bounce-in">
            {user ? (
              <Link href="/account/thong-bao">
                <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-white/10 transition-all duration-300 hover:scale-110 h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 transition-all duration-300 hover:scale-110 h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            {isCartPage ? (
              <Link href="/cart">
                <Button
                  data-testid="button-cart"
                  variant="ghost"
                  size="icon"
                  className="relative text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-accent text-accent-foreground rounded-full text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </Link>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Link href="/cart">
                    <Button
                      data-testid="button-cart"
                      variant="ghost"
                      size="icon"
                      className="relative text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-accent text-accent-foreground rounded-full text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center">
                        {itemCount}
                      </span>
                    </Button>
                  </Link>
                </DialogTrigger>
                <DialogContent overlayClassName="bg-black/30" className="max-w-2xl w-[92vw] p-0">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Giỏ hàng</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center text-muted-foreground">Chưa có sản phẩm nào trong giỏ hàng.</div>
                    <div className="mt-6 flex justify-start">
                      <Button variant="secondary">Tiếp tục mua sắm</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <span className="h-6 w-px bg-primary-foreground/30" />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account">
                  <span className="text-sm text-primary-foreground hover:text-secondary cursor-pointer">
                    Xin chào, {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Khách hàng'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-primary-foreground hover:text-secondary"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <GarenaAuthDialog>
                <Button
                  data-testid="button-login"
                  className="rounded-full bg-white text-primary hover:bg-white/90 px-2 sm:px-4 h-8 sm:h-9"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Đăng nhập/ Đăng ký</span>
                  <span className="text-xs sm:hidden">Đăng nhập</span>
                </Button>
              </GarenaAuthDialog>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="border-t border-primary-foreground/20 py-2" ref={navRef}>
          <div className="relative flex items-center gap-6 text-sm">
            <Button className="rounded-md bg-primary-foreground text-primary px-4 h-9" onClick={() => setIsCategoryOpen((v) => !v)}>
              <Menu className="h-4 w-4 mr-2" />
              Danh mục
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
            </Button>

            {isCategoryOpen && (
              <div className="absolute left-0 top-[110%] z-40 w-[1180px] max-w-[95vw] bg-background text-foreground rounded-md shadow-xl border overflow-hidden">
                <div className="grid grid-cols-[300px_1fr]">
                  <div className="bg-muted/40">
                    {[
                      { label: "Thuốc", icon: Pill, href: "/thuoc" },
                      { label: "Tra cứu bệnh", icon: Stethoscope, href: "/benh" },
                      { label: "Thực phẩm bảo vệ sức khỏe", icon: Sparkles, href: "/thuc-pham" },
                      { label: "Chăm sóc cá nhân", icon: Heart, href: "/cham-soc-ca-nhan" },
                      { label: "Chăm sóc sắc đẹp", icon: Sparkles, href: "/cham-soc-sac-dep" },
                      { label: "Thiết bị y tế", icon: Syringe, href: "/thiet-bi-y-te" },
                      { label: "Sản phẩm tiện lợi", icon: Thermometer },
                    ].map((item, idx) => (
                      <Link key={item.label} href={(item as any).href || "#"} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-background transition-colors ${idx === 0 ? "bg-background" : ""}`}>
                        {(() => {
                          const Icon = item.icon;
                          return <Icon className="h-5 w-5 text-primary" />;
                        })()}
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-5 gap-6">
                      {[
                        { label: "Thuốc không kê đơn", href: "/thuoc" },
                        { label: "Thuốc kê đơn", href: "/thuoc" },
                        { label: "Thuốc khác", href: "/thuoc" },
                        { label: "Vitamin & Thực phẩm...", href: "/thuc-pham" },
                        { label: "Xem tất cả", href: "/thuoc" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href || "#"} className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                          <div className="h-24 w-full rounded-md bg-muted" />
                          <div className="text-sm text-center leading-snug">{item.label}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ul className="flex items-center gap-6 overflow-x-auto">
              <li>
                <Link href="/thuoc" className="hover:text-secondary transition-colors" data-testid="link-medicine">
                  Thuốc
                </Link>
              </li>
              <li>
                <Link href="/benh" className="hover:text-secondary transition-colors" data-testid="link-lookup">
                  Tra cứu bệnh
                </Link>
              </li>
              <li>
                <Link href="/thuc-pham" className="hover:text-secondary transition-colors" data-testid="link-supplements">
                  Thực phẩm bảo vệ sức khỏe
                </Link>
              </li>
              <li>
                <Link href="/me-va-be" className="hover:text-secondary transition-colors" data-testid="link-mother-baby">
                  Mẹ và bé
                </Link>
              </li>
              <li>
                <Link href="/cham-soc-ca-nhan" className="hover:text-secondary transition-colors" data-testid="link-personal-care">
                  Chăm sóc cá nhân
                </Link>
              </li>
              <li>
                <Link href="/cham-soc-sac-dep" className="hover:text-secondary transition-colors" data-testid="link-beauty-care">
                  Chăm sóc sắc đẹp
                </Link>
              </li>
              <li>
                <Link href="/thiet-bi-y-te" className="hover:text-secondary transition-colors" data-testid="link-medical-devices">
                  Thiết bị y tế
                </Link>
              </li>
              <li>
                <Link href="/tu-van-thuoc" className="hover:text-secondary transition-colors" data-testid="link-drug-consultation">
                  Tư vấn thuốc
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-secondary transition-colors" data-testid="link-track-order">
                  Theo dõi đơn hàng
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <div style={{ height: headerHeight }} />
    </>
  );
}
