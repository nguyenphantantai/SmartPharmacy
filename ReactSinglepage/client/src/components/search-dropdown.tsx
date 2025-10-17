import { useState, useEffect, useRef } from "react";
import { Search, Clock, TrendingUp, Package, Star, Grid3X3 } from "lucide-react";
import { SearchService, SearchProduct, SearchResult } from "@/services/searchService";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: SearchProduct) => void;
}

export default function SearchDropdown({ query, isOpen, onClose, onSelectProduct }: SearchDropdownProps) {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popularSuggestions] = useState(SearchService.getPopularSuggestions());
  const [trendingProducts] = useState(SearchService.getTrendingProducts());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search products when query changes
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      const results = SearchService.searchProducts(query, 8);
      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(price));
  };

  const getCategoryLink = (type: string) => {
    const categoryMap: Record<string, string> = {
      'medical': '/thiet-bi-y-te',
      'personal': '/cham-soc-ca-nhan',
      'supplement': '/thuc-pham',
      'mom-baby': '/me-va-be',
      'beauty': '/cham-soc-sac-dep'
    };
    return categoryMap[type] || '/thuoc';
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden"
    >
      <div className="max-h-[500px] overflow-y-auto">
        {/* Search Results */}
        {query && query.trim().length >= 2 && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Kết quả tìm kiếm cho "{query}"
              </span>
              {isLoading && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {searchResults && searchResults.products.length > 0 ? (
              <div className="space-y-2">
                {searchResults.products.map((product: SearchProduct) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectProduct(product)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.brand} • {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {searchResults.total > searchResults.products.length && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500">
                      Và {searchResults.total - searchResults.products.length} sản phẩm khác...
                    </span>
                  </div>
                )}
              </div>
            ) : searchResults && !isLoading ? (
              <div className="text-center py-4">
                <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Không tìm thấy sản phẩm nào</p>
                <p className="text-xs text-gray-400">Thử từ khóa khác hoặc kiểm tra chính tả</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Popular Suggestions */}
        {(!query || query.trim().length < 2) && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tìm kiếm phổ biến</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSuggestions.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
                    onClose();
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products */}
        {(!query || query.trim().length < 2) && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
            </div>
            <div className="space-y-2">
              {trendingProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.discountPercentage && (
                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.isNew && (
                      <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
                        Mới
                      </span>
                    )}
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Categories */}
        {(!query || query.trim().length < 2) && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Danh mục nhanh</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Thuốc", href: "/thuoc", icon: "💊" },
                { name: "Thực phẩm bảo vệ sức khỏe", href: "/thuc-pham", icon: "🌿" },
                { name: "Mẹ và bé", href: "/me-va-be", icon: "👶" },
                { name: "Chăm sóc sắc đẹp", href: "/cham-soc-sac-dep", icon: "✨" }
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center gap-2 p-2 text-xs bg-white hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span>{category.icon}</span>
                  <span className="truncate">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
