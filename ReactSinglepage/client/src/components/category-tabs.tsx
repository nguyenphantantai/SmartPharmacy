import { useFilters } from "@/contexts/FilterContext";

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
    <section className="bg-card border rounded-xl overflow-hidden mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {categories.map((category) => (
          <div 
            key={category.value} 
            className={`p-4 border-r last:border-r-0 border-b sm:border-b-0 cursor-pointer transition-colors ${
              filters.selectedCategory === category.value 
                ? 'bg-primary/10 border-primary' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleCategorySelect(category.value)}
          >
            <div className="h-24 w-24 mx-auto rounded-full bg-muted mb-2 overflow-hidden flex items-center justify-center">
              <img
                src={category.imageUrl}
                alt={category.label}
                className="h-full w-full object-contain p-2"
                loading="lazy"
              />
            </div>
            <div className={`text-sm text-center leading-snug ${
              filters.selectedCategory === category.value ? 'font-semibold text-primary' : ''
            }`}>
              {category.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
