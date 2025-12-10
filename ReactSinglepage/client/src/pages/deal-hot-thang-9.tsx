import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCardWithQuantity from "@/components/product-card-with-quantity";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE } from "@/lib/utils";
import { hasValidImage } from "@/lib/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Flame } from "lucide-react";

export default function DealHotThang9Page() {
  const { isInitialized } = useAuth();
  
  const { data: hotDeals, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/hot"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/products/hot`);
      if (!response.ok) {
        throw new Error("Failed to fetch hot products");
      }
      const result = await response.json();
      return result.data || [];
    },
    enabled: isInitialized,
  });

  // Filter products from September (month 9)
  const septemberDeals = hotDeals?.filter(product => {
    // If product has createdAt, check if it's from September
    // Otherwise, just show all hot deals
    return true; // Show all hot deals for now
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Deal Hot Tháng 9</h1>
              <p className="text-muted-foreground">
                Các sản phẩm hot với giá tốt nhất trong tháng 9
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl p-4">
                <Skeleton className="w-full h-32 rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : error || !septemberDeals.length ? (
          <div className="text-center py-12">
            <Flame className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có deal hot</h3>
            <p className="text-muted-foreground">
              Hiện tại chưa có deal hot nào trong tháng 9.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {septemberDeals
              .filter(product => hasValidImage(product.imageUrl))
              .map((product) => (
                <ProductCardWithQuantity key={product.id} product={product} />
              ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

