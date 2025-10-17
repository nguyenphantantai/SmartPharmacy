import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OralCareProductGrid from "../components/oral-care-product-grid";
import { useState, useMemo } from "react";
import { personalCareProducts } from "@/data/personal-care";

export default function ToothpastePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toothpasteProducts = useMemo(() => {
    return personalCareProducts.filter(product => product.subCategory === "Kem đánh răng");
  }, []);

  const brands = useMemo(() => {
    const allBrands = toothpasteProducts.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, [toothpasteProducts]);

  const visibleBrands = useMemo(() => {
    const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
    const matchedBrands = brands.filter((brand) =>
      brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
    );
    return showAllBrands ? matchedBrands : matchedBrands.slice(0, 5);
  }, [brands, brandFilterQuery, showAllBrands]);

  const filteredProducts = useMemo(() => {
    let filtered = toothpasteProducts;

    if (priceRange) {
      switch (priceRange) {
        case "lt-100":
          filtered = filtered.filter((product) => parseInt(product.price) < 100000);
          break;
        case "100-300":
          filtered = filtered.filter((product) => parseInt(product.price) >= 100000 && parseInt(product.price) <= 300000);
          break;
        case "gt-300":
          filtered = filtered.filter((product) => parseInt(product.price) > 300000);
          break;
      }
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = parseInt(product.price);
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
    }

    return filtered;
  }, [toothpasteProducts, priceRange, minPrice, maxPrice, selectedBrands]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setPriceRange(undefined);
    setBrandFilterQuery("");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/personal-care">Chăm sóc cá nhân</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cham-soc-rang-mieng">Chăm sóc răng miệng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Kem đánh răng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Kem đánh răng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-card rounded-xl border p-4 h-max">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Bộ lọc</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>Thiết lập lại</Button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium mb-2">Khoảng giá</div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tối thiểu"
                    className="h-9"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-sm">₫</span>
                  <Input
                    placeholder="Tối đa"
                    className="h-9"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <span className="text-sm">₫</span>
                </div>
                <Button className="mt-3 w-full">Áp dụng</Button>

                <div className="mt-3 space-y-2">
                  <RadioGroup value={priceRange} onValueChange={setPriceRange} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr1" value="lt-100" />
                      <Label htmlFor="pr1" className="font-normal">Dưới 100.000 ₫</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr2" value="100-300" />
                      <Label htmlFor="pr2" className="font-normal">100.000 ₫ - 300.000 ₫</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr3" value="gt-300" />
                      <Label htmlFor="pr3" className="font-normal">Trên 300.000 ₫</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="h-px bg-border" />

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
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                      />
                      <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
                    </div>
                  ))}
                </div>
                {!showAllBrands && brands.length > 5 && (
                  <Button variant="link" className="px-0 mt-2" onClick={() => setShowAllBrands(true)}>
                    Xem thêm
                  </Button>
                )}
              </div>
            </div>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Sắp xếp theo:</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Giá giảm dần</Button>
                <Button variant="outline" size="sm">Giá tăng dần</Button>
              </div>
            </div>

            <OralCareProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
