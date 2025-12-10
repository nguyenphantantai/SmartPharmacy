import { useFilters } from "@/contexts/FilterContext";
import { Card } from "@/components/ui/card";

interface CategoryTabsProps {
  categories: Array<{
    label: string;
    imageUrl: string;
    value: string;
  }>;
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const { filters, updateFilters } = useFilters();

  const handleCategorySelect = (categoryValue: string) => {
    updateFilters({
      selectedCategory: filters.selectedCategory === categoryValue ? null : categoryValue
    });
  };

  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Card
            key={category.value}
            className={`p-4 text-center border rounded-2xl cursor-pointer hover:shadow-md transition-shadow ${
              filters.selectedCategory === category.value
                ? 'border-primary shadow-md bg-primary/5'
                : ''
            }`}
            onClick={() => handleCategorySelect(category.value)}
          >
            <div className="h-24 w-24 mx-auto rounded-full bg-muted mb-2 overflow-hidden flex items-center justify-center">
              <img
                src={category.imageUrl}
                alt={category.label}
                className="h-full w-full object-contain p-2"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/medicines/default.jpg";
                }}
              />
            </div>
            <div className={`text-sm text-center leading-snug ${
              filters.selectedCategory === category.value ? 'font-semibold text-primary' : ''
            }`}>
              {category.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
