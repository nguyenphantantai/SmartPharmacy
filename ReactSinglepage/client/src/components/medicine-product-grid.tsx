import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import GenericProductCard from "./generic-product-card";
import { API_BASE } from "@/lib/utils";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";

interface MedicineProductGridProps {}

export default function MedicineProductGrid({}: MedicineProductGridProps) {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", "thuoc"],
    queryFn: async () => {
      console.log('🔍 Fetching medicine products from:', `${API_BASE}/api/products?categorySlug=thuoc`);
      const response = await fetch(`${API_BASE}/products?categorySlug=thuoc`);
      console.log('📡 Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const result = await response.json();
      console.log('📦 API response:', {
        success: result.success,
        productCount: result.data?.products?.length || 0,
        total: result.data?.pagination?.total || 0
      });
      return result.data.products || [];
    },
  });

  const filteredProducts = useFilteredProducts(products || []);

  console.log('🔄 Component state:', { 
    isLoading, 
    error: error?.message, 
    productCount: products?.length,
    filteredCount: filteredProducts.length
  });

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

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="mb-4 text-sm text-muted-foreground">
          Hiển thị {filteredProducts.length} sản phẩm
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
      </div>
    </section>
  );
}


