import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HairCareProductGrid from "../components/hair-care-product-grid";
import { useState, useMemo } from "react";
import { personalCareProducts } from "@/data/personal-care";
import { Link } from "wouter";

export default function HairCareProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Lọc sản phẩm chăm sóc tóc
  const hairCareProducts = useMemo(() => {
    return personalCareProducts.filter(product => product.category === "Chăm sóc tóc");
  }, []);

  const brands = useMemo(() => {
    const allBrands = hairCareProducts.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, [hairCareProducts]);

  const visibleBrands = useMemo(() => {
    const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
    const matchedBrands = brands.filter((brand) =>
      brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
    );
    return showAllBrands ? matchedBrands : matchedBrands.slice(0, 5);
  }, [brands, brandFilterQuery, showAllBrands]);

  const filteredProducts = useMemo(() => {
    let filtered = hairCareProducts;

    // Lọc theo khoảng giá
    if (priceRange) {
      switch (priceRange) {
        case "lt-100":
          filtered = filtered.filter((product) => parseInt(product.price) < 100000);
          break;
        case "gt-100":
          filtered = filtered.filter((product) => parseInt(product.price) >= 100000);
          break;
      }
    }

    // Lọc theo giá tùy chỉnh
    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = parseInt(product.price);
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Lọc theo thương hiệu đã chọn
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
    }

    return filtered;
  }, [hairCareProducts, priceRange, minPrice, maxPrice, selectedBrands]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleApplyPriceRange = () => {
    // Logic để áp dụng khoảng giá tùy chỉnh
    // Có thể thêm state để lưu khoảng giá tùy chỉnh
  };

  const resetFilters = () => {
    setPriceRange(undefined);
    setBrandFilterQuery("");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const productTypes = [
    { 
      label: "Dầu gội đầu", 
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241024095026-0-P21168_1.jpg?versionId=1Ay3JAp2YKZa4r6jsbiskaAYbum4lOMU",
      link: "/dau-goi-dau"
    },
    { 
      label: "Dầu xả", 
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241024095120-0-P18993_1.jpg?versionId=DksZYXWVQEznE4HTC5PhmkwbMmho3m7_",
      link: "/dau-xa"
    },
    { 
      label: "Dưỡng tóc", 
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241024095537-0-P25734_1.png?versionId=3BFmuqItYUM6RL2jJ3uFegewyzUs5BvI",
      link: "/duong-toc"
    },
    { 
      label: "Nhuộm tóc", 
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240225090220-0-P15242_2_l.png",
      link: "/nhuom-toc"
    },
  ];

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
                <BreadcrumbPage>Chăm sóc tóc</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Chăm sóc tóc</h1>

        {/* Product Type Categories */}
        <section className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {productTypes.map((type) => (
              <Card key={type.label} className={`p-4 text-center border rounded-2xl ${type.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {type.link ? (
                  <Link href={type.link}>
                    <div className="mx-auto h-24 w-24 rounded-full bg-muted mb-3 overflow-hidden">
                      <img 
                        src={type.imageUrl} 
                        alt={type.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium leading-snug">{type.label}</div>
                  </Link>
                ) : (
                  <>
                    <div className="mx-auto h-24 w-24 rounded-full bg-muted mb-3 overflow-hidden">
                      <img 
                        src={type.imageUrl} 
                        alt={type.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium leading-snug">{type.label}</div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters */}
          <aside className="bg-card rounded-xl border p-4 h-max">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Bộ lọc</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>Thiết lập lại</Button>
            </div>

            <div className="space-y-6">
              {/* Price Range Filter */}
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
                <Button className="mt-3 w-full" onClick={handleApplyPriceRange}>Áp dụng</Button>

                <div className="mt-3 space-y-2">
                  <RadioGroup value={priceRange} onValueChange={setPriceRange} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr1" value="lt-100" />
                      <Label htmlFor="pr1" className="font-normal">Dưới 100.000 ₫</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr2" value="gt-100" />
                      <Label htmlFor="pr2" className="font-normal">Trên 100.000 ₫</Label>
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

          {/* Main Content */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Sắp xếp theo:</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Giá giảm dần</Button>
                <Button variant="outline" size="sm">Giá tăng dần</Button>
              </div>
            </div>

            <HairCareProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
