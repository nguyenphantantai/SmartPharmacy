import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import GenericProductCard from "./generic-product-card";
import { API_BASE } from "@/lib/utils";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useFilters } from "@/contexts/FilterContext";
import { medicineCategories } from "@/pages/medicine";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface MedicineProductGridProps {}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function MedicineProductGrid({}: MedicineProductGridProps) {
  const { isInitialized } = useAuth();
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20; // Mỗi trang 20 thuốc
  
  // Get category label from selected category
  const getCategoryLabel = (categoryValue: string | null): string | null => {
    if (!categoryValue) return null;
    const category = medicineCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : null;
  };
  
  const categoryLabel = getCategoryLabel(filters.selectedCategory);
  
  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", "thuoc", currentPage, limit, filters.selectedCategory, categoryLabel],
    queryFn: async () => {
      console.log(`🔍 Fetching medicine products - Page ${currentPage}, Limit ${limit}, Category: ${categoryLabel || 'All'}`);
      
      // Build query parameters
      const params = new URLSearchParams({
        categorySlug: 'thuoc',
        limit: limit.toString(),
        page: currentPage.toString(),
      });
      
      // Add categoryName filter if category is selected
      if (categoryLabel) {
        params.append('categoryName', categoryLabel);
      }
      
      const response = await fetch(`${API_BASE}/api/products?${params.toString()}`);
      console.log('📡 Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      console.log('📦 API response:', {
        success: result.success,
        productCount: result.data?.products?.length || 0,
        total: result.data?.pagination?.total || 0,
        page: result.data?.pagination?.page || 0,
        pages: result.data?.pagination?.pages || 0
      });
      
      // Log sample products với categoryName để debug
      if (result.data?.products && result.data.products.length > 0) {
        console.log('📝 Sample products with categories:');
        result.data.products.slice(0, 5).forEach((p: any) => {
          console.log(`   "${p.name}" - categoryName: "${p.categoryName || 'N/A'}"`);
        });
      }
      
      return {
        products: result.data?.products || [],
        pagination: result.data?.pagination || {
          page: currentPage,
          limit: limit,
          total: 0,
          pages: 0
        }
      };
    },
    enabled: isInitialized, // Chỉ chạy khi AuthContext đã sẵn sàng
    refetchInterval: 10 * 1000, // Tự động refetch mỗi 10 giây để đồng bộ realtime
    refetchOnWindowFocus: true, // Refetch khi user quay lại tab
    staleTime: 5 * 1000, // Dữ liệu được coi là stale sau 5 giây
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, pages: 0 };

  // Reset to page 1 when category changes
  useEffect(() => {
    if (filters.selectedCategory && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters.selectedCategory]);

  // Note: Since we're filtering on the backend now, we don't need to filter again on frontend
  // But we keep useFilteredProducts for other filters (price, brand, etc.)
  const filteredProducts = useFilteredProducts(products);

  console.log('🔄 Component state:', { 
    isLoading, 
    error: error?.message, 
    productCount: products.length,
    filteredCount: filteredProducts.length,
    currentPage,
    totalPages: pagination.pages,
    total: pagination.total
  });

  // Reset về page 1 khi filter thay đổi (có thể implement sau)
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [filteredProducts.length]);

  if (isLoading) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl p-4 shadow-md">
                <Skeleton className="w-full h-32 rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-destructive">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp với bộ lọc</p>
          </div>
        </div>
      </section>
    );
  }

  // Tính toán số trang để hiển thị
  const totalPages = pagination.pages || 1;
  const maxVisiblePages = 5; // Hiển thị tối đa 5 số trang
  
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages: (number | 'ellipsis')[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredProducts.length} sản phẩm (Trang {currentPage}/{totalPages} - Tổng {pagination.total} sản phẩm)
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredProducts.map((p) => (
            <GenericProductCard 
              key={p._id || p.id} 
              product={p} 
              categoryLabel="Đang bán chạy"
              categoryColor="bg-red-500"
            />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {getVisiblePages().map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}


