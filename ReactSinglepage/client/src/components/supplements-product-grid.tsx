import { Skeleton } from "@/components/ui/skeleton";
import { supplementProducts, SupplementProduct } from "@/data/supplements";
import { useMemo } from "react";
import GenericProductCard from "./generic-product-card";

interface SupplementsProductGridProps {}

export default function SupplementsProductGrid({}: SupplementsProductGridProps) {
  
  const products = supplementProducts;

  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
        <div className="container mx-auto px-4 max-w-screen-2xl">
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
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.map((p) => (
            <GenericProductCard 
              key={p.id} 
              product={p as any} 
              categoryLabel="Thực phẩm bảo vệ sức khỏe"
              categoryColor="bg-green-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
}


