import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardWithQuantity from "./product-card-with-quantity";
import { API_BASE } from "@/lib/utils";
import { hasValidImage } from "@/lib/imageUtils";
import { useAuth } from "@/contexts/AuthContext";

interface ProductGridProps {}

export default function ProductGrid({}: ProductGridProps) {
  const { isInitialized } = useAuth();
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const result = await response.json();
      return result.data.products || [];
    },
    enabled: isInitialized, // Chỉ chạy khi AuthContext đã sẵn sàng
  });

  if (isLoading) {
    return (
      <section className="bg-secondary py-8">
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
      <section className="bg-secondary py-8">
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
      <section className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Sản phẩm nổi bật</h2>
          <a href="#" className="text-primary hover:text-primary/80 font-medium">Xem thêm</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products
            .filter(product => hasValidImage(product.imageUrl))
            .slice(0, 6)
            .map((product) => (
            <ProductCardWithQuantity key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
