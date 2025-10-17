import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFilters } from "@/contexts/FilterContext";
import { useState } from "react";

interface FilterSidebarProps {
  brands: string[];
}

export default function FilterSidebar({ brands }: FilterSidebarProps) {
  const { filters, updateFilters, resetFilters } = useFilters();
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const visibleBrands = (showAllBrands ? brands : brands.slice(0, 5)).filter((b) =>
    b.toLowerCase().includes(brandFilterQuery.toLowerCase())
  );

  const handleApplyPriceRange = () => {
    const min = minPriceInput ? parseInt(minPriceInput) : null;
    const max = maxPriceInput ? parseInt(maxPriceInput) : null;
    
    updateFilters({
      minPrice: min,
      maxPrice: max,
      priceRange: null, // Clear radio selection when using custom range
    });
  };

  const handlePriceRangeChange = (value: string) => {
    updateFilters({ 
      priceRange: value,
      minPrice: null, // Clear custom inputs when using radio
      maxPrice: null,
    });
  };

  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      updateFilters({
        selectedBrands: [...filters.selectedBrands, brand]
      });
    } else {
      updateFilters({
        selectedBrands: filters.selectedBrands.filter(b => b !== brand)
      });
    }
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy: sortBy as any });
  };

  return (
    <aside className="bg-card rounded-xl border p-4 h-max">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Bộ lọc</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Thiết lập lại
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <div className="text-sm font-medium mb-2">Khoảng giá</div>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Tối thiểu" 
              className="h-9"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
            />
            <Input 
              placeholder="Tối đa" 
              className="h-9"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
            />
          </div>
          <Button className="mt-3 w-full" onClick={handleApplyPriceRange}>
            Áp dụng
          </Button>

          <div className="mt-3 space-y-2">
            <RadioGroup 
              value={filters.priceRange || ""} 
              onValueChange={handlePriceRangeChange} 
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pr1" value="lt-100" />
                <Label htmlFor="pr1" className="font-normal">Dưới 100.000 ₫</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pr2" value="100-300" />
                <Label htmlFor="pr2" className="font-normal">100.000 ₫ - 300.000 ₫</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pr3" value="300-500" />
                <Label htmlFor="pr3" className="font-normal">300.000 ₫ - 500.000 ₫</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pr4" value=">500" />
                <Label htmlFor="pr4" className="font-normal">Trên 500.000 ₫</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Brand Filter */}
        <div>
          <div className="text-sm font-medium mb-2">Thương hiệu</div>
          <Input
            value={brandFilterQuery}
            onChange={(e) => setBrandFilterQuery(e.target.value)}
            placeholder="Nhập tên thương hiệu"
            className="h-9 mb-3"
          />
          <div className="space-y-3">
            {visibleBrands.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox 
                  id={`brand-${brand}`}
                  checked={filters.selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandToggle(brand, checked as boolean)}
                />
                <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
              </div>
            ))}
          </div>
          {brands.length > 5 && !showAllBrands && (
            <Button 
              variant="link" 
              className="px-0 mt-2" 
              onClick={() => setShowAllBrands(true)}
            >
              Xem thêm
            </Button>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Sort Options */}
        <div>
          <div className="text-sm font-medium mb-2">Sắp xếp</div>
          <div className="space-y-2">
            <Button 
              variant={filters.sortBy === 'price-desc' ? 'default' : 'outline'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleSortChange('price-desc')}
            >
              Giá giảm dần
            </Button>
            <Button 
              variant={filters.sortBy === 'price-asc' ? 'default' : 'outline'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleSortChange('price-asc')}
            >
              Giá tăng dần
            </Button>
            <Button 
              variant={filters.sortBy === 'name-asc' ? 'default' : 'outline'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleSortChange('name-asc')}
            >
              Tên A-Z
            </Button>
            <Button 
              variant={filters.sortBy === 'newest' ? 'default' : 'outline'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleSortChange('newest')}
            >
              Mới nhất
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
