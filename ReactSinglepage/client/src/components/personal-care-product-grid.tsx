import { Skeleton } from "@/components/ui/skeleton";
import { PersonalCareProduct } from "@/data/personal-care";
import GenericProductCard from "./generic-product-card";

interface PersonalCareProductGridProps { products: PersonalCareProduct[]; }

export default function PersonalCareProductGrid({ products }: PersonalCareProductGridProps) {

  if (!products || products.length === 0) {
    return (
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
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
              categoryLabel="Chăm sóc cá nhân"
              categoryColor="bg-blue-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
}


