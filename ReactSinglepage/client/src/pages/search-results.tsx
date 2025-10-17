import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProductCard from "@/components/product-card";
import { SearchService, SearchProduct, SearchResult } from "@/services/searchService";
import { Product } from "@shared/schema";
import { useState, useEffect } from "react";
import { Search, Filter, SortAsc, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchResultsPage() {
  const [query, setQuery] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  });
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');

  // Search products when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const results = SearchService.searchProducts(query, 50);
      setSearchResults(results);
      setIsLoading(false);
    }
  }, [query]);

  // Sort products
  const sortedProducts = searchResults?.products ? [...searchResults.products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseInt(a.price) - parseInt(b.price);
      case 'price-desc':
        return parseInt(b.price) - parseInt(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // Keep original order for relevance
    }
  }) : [];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(price));
  };

  // Convert SearchProduct to Product for ProductCard component
  const convertToProduct = (searchProduct: SearchProduct): Product => {
    return {
      id: searchProduct.id,
      name: searchProduct.name,
      description: searchProduct.description,
      price: searchProduct.price,
      originalPrice: searchProduct.originalPrice || null,
      discountPercentage: searchProduct.discountPercentage ? parseInt(searchProduct.discountPercentage) : 0,
      imageUrl: searchProduct.imageUrl,
      category: searchProduct.category,
      brand: searchProduct.brand,
      unit: searchProduct.unit,
      inStock: true, // Default to true for search results
      isHot: false, // Default to false
      isNew: searchProduct.isNew || false,
      createdAt: new Date(), // Default to current date
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery={query} onSearchChange={setQuery} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Kết quả tìm kiếm cho "{query}"
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-20"
              />
              <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>

        {/* Results Summary */}
        {searchResults && (
          <div className="mb-6">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{searchResults.total}</span> sản phẩm
              {searchResults.categories.length > 0 && (
                <span> trong {searchResults.categories.length} danh mục</span>
              )}
            </p>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="relevance">Liên quan nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium">Hiển thị:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Đang tìm kiếm...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchResults && searchResults.products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-4">
                Thử từ khóa khác hoặc kiểm tra chính tả
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Gợi ý:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['vitamin C', 'probiotics', 'khẩu trang', 'kem chống nắng'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!isLoading && searchResults && searchResults.products.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }>
            {sortedProducts.map((product) => (
              <div key={product.id}>
                {viewMode === 'grid' ? (
                  <ProductCard product={convertToProduct(product)} />
                ) : (
                  <Card className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-primary font-semibold">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                          {product.discountPercentage && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                          {product.isNew && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">Mới</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Categories */}
        {searchResults && searchResults.categories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Danh mục liên quan</h2>
            <div className="flex flex-wrap gap-2">
              {searchResults.categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {searchResults && searchResults.brands.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Thương hiệu</h2>
            <div className="flex flex-wrap gap-2">
              {searchResults.brands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
