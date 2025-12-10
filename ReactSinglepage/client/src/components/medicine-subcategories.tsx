import { Card } from "@/components/ui/card";
import { useFilters } from "@/contexts/FilterContext";

interface Subcategory {
  label: string;
  imageUrl: string;
  value: string;
  slug: string;
}

interface MedicineSubcategoriesProps {
  subcategories: Subcategory[];
}

export default function MedicineSubcategories({ subcategories }: MedicineSubcategoriesProps) {
  const { filters, updateFilters } = useFilters();

  const handleSubcategoryClick = (subcategoryValue: string) => {
    updateFilters({
      selectedSubcategory: filters.selectedSubcategory === subcategoryValue ? null : subcategoryValue
    });
  };

  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {subcategories.map((subcategory) => (
          <Card
            key={subcategory.value}
            className={`p-4 text-center border rounded-2xl cursor-pointer hover:shadow-md transition-shadow ${
              filters.selectedSubcategory === subcategory.value
                ? 'border-primary shadow-md bg-primary/5'
                : ''
            }`}
            onClick={() => handleSubcategoryClick(subcategory.value)}
          >
            <div className="mx-auto h-20 w-20 rounded-full bg-muted mb-3 overflow-hidden flex items-center justify-center">
              <img
                src={subcategory.imageUrl}
                alt={subcategory.label}
                className="w-full h-full object-contain p-2"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/medicines/default.jpg";
                }}
              />
            </div>
            <div className={`text-xs font-medium leading-snug ${
              filters.selectedSubcategory === subcategory.value
                ? 'text-primary font-semibold'
                : ''
            }`}>
              {subcategory.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

