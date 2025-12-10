import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCardWithQuantity from "./product-card-with-quantity";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE } from "@/lib/utils";
import { hasValidImage } from "@/lib/imageUtils";
import { useAuth } from "@/contexts/AuthContext";

export default function DealHuntSection() {
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
      <section className="py-10 bg-gradient-to-b from-cyan-500 via-teal-400 to-blue-600 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-6 fade-in">
            <h2 className="text-2xl font-extrabold text-white text-shadow">Săn Deal</h2>
            <div className="flex items-center gap-2 text-white/90">
              {["52", "46", "41"].map((n, i) => (
                <span 
                  key={i} 
                  className="bg-white text-cyan-600 font-bold rounded-md px-2 py-1 leading-none floating-animation shadow-lg"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-animation">
            {Array.from({ length: 12 }).map((_, index) => (
              <div 
                key={index} 
                className="slide-up hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <Skeleton className="w-full h-32 rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-gradient-to-b from-cyan-500 via-teal-400 to-blue-600 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-6 fade-in">
            <h2 className="text-2xl font-extrabold text-white text-shadow">Săn Deal</h2>
            <div className="flex items-center gap-2 text-white/90">
              {["52", "46", "41"].map((n, i) => (
                <span 
                  key={i} 
                  className="bg-white text-cyan-600 font-bold rounded-md px-2 py-1 leading-none floating-animation shadow-lg"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-white/80">Không thể tải sản phẩm deal. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-10 bg-gradient-to-b from-cyan-500 via-teal-400 to-blue-600 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-6 fade-in">
            <h2 className="text-2xl font-extrabold text-white text-shadow">Săn Deal</h2>
            <div className="flex items-center gap-2 text-white/90">
              {["52", "46", "41"].map((n, i) => (
                <span 
                  key={i} 
                  className="bg-white text-cyan-600 font-bold rounded-md px-2 py-1 leading-none floating-animation shadow-lg"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-white/80">Không có sản phẩm deal nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-cyan-500 via-teal-400 to-blue-600 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-6 fade-in">
          <h2 className="text-2xl font-extrabold text-white text-shadow">Săn Deal</h2>
          <div className="flex items-center gap-2 text-white/90">
            {["52", "46", "41"].map((n, i) => (
              <span 
                key={i} 
                className="bg-white text-cyan-600 font-bold rounded-md px-2 py-1 leading-none floating-animation shadow-lg"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-animation">
          {products
            .filter(product => hasValidImage(product.imageUrl))
            .slice(0, 12)
            .map((p, index) => (
            <div 
              key={p.id} 
              className="slide-up hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCardWithQuantity product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
