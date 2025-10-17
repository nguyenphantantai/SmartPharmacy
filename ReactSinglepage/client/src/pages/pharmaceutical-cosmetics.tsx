import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BeautyCareProductGrid from "../components/beauty-care-product-grid";
import { useState, useMemo } from "react";
import { beautyCareProducts } from "@/data/beauty-care";
import { Link } from "wouter";

export default function PharmaceuticalCosmeticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const pharmaceuticalProducts = useMemo(() => {
    return beautyCareProducts.filter(product => product.category === "Dược - Mỹ Phẩm");
  }, []);

  const brands = useMemo(() => {
    const allBrands = pharmaceuticalProducts.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, [pharmaceuticalProducts]);

  const visibleBrands = useMemo(() => {
    const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
    const matchedBrands = brands.filter((brand) =>
      brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
    );
    return showAllBrands ? matchedBrands : matchedBrands.slice(0, 5);
  }, [brands, brandFilterQuery, showAllBrands]);

  const filteredProducts = useMemo(() => {
    let filtered = pharmaceuticalProducts;

    if (priceRange) {
      switch (priceRange) {
        case "lt-100":
          filtered = filtered.filter((product) => parseInt(product.price) < 100000);
          break;
        case "100-300":
          filtered = filtered.filter((product) => parseInt(product.price) >= 100000 && parseInt(product.price) <= 300000);
          break;
        case "300-500":
          filtered = filtered.filter((product) => parseInt(product.price) >= 300000 && parseInt(product.price) <= 500000);
          break;
        case "gt-500":
          filtered = filtered.filter((product) => parseInt(product.price) > 500000);
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
  }, [pharmaceuticalProducts, priceRange, minPrice, maxPrice, selectedBrands]);

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

  const productTypes = [
    {
      label: "Kem dưỡng ẩm",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241023043607-0-P24394_1.jpg?versionId=UiHaCZIEgYtzDdkraEIfmyzxq5hJ6jHa",
      link: "/kem-duong-am"
    },
    {
      label: "Nước tẩy trang & sữa rửa mặt",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241023043859-0-P05373_1.png?versionId=da8O6dbwCKxOEwSzYG9NQkyLtBKOoaox",
      link: "/nuoc-tay-trang-sua-rua-mat"
    },
    {
      label: "Sản phẩm hỗ trợ giảm sẹo",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240225114409-0-P01859_1.png",
      link: "/san-pham-ho-tro-giam-seo"
    },
    {
      label: "Nước cân bằng & xịt khoáng",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241023044003-0-P05099_1.png?versionId=qsc7pTyK3A17ftZFhnuocP3_1g2MD97q",
      link: "/nuoc-can-bang-xit-khoang"
    },
    {
      label: "Son dưỡng môi",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240225114253-0-P22717_1.png",
      link: "/son-duong-moi"
    },
    {
      label: "Sản phẩm hỗ trợ chống lão hóa",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240225114222-0-P19606_3.png",
      link: "/san-pham-ho-tro-chong-lao-hoa"
    },
    {
      label: "Sản phẩm hỗ trợ giảm mụn",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241023043515-0-P23466_11.jpg?versionId=2pjH.uuhhblX8AWbo7FclBAfmpJTMsCs",
      link: "/san-pham-ho-tro-giam-mun"
    },
    {
      label: "Tẩy tế bào chết chuyên sâu",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250715031853-0-P29420_1.jpg?versionId=OeO9ddQvly3dJr7H3nVw8gFDQeYF6cdB",
      link: "/tay-te-bao-chet-chuyen-sau"
    },
    {
      label: "Sữa tắm chuyên sâu",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250623045738-0-P24165_1.jpg?versionId=ZKQEoNDUB9r4CSty_a3Z5.Q9Tz36m.NQ",
      link: "/sua-tam-chuyen-sau"
    },
    {
      label: "Tinh chất & Serum",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240225093317-0-P23898_1.png",
      link: "/tinh-chat-serum"
    },
    {
      label: "Sản phẩm chống nắng & sau khi đi nắng",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241023043402-0-P27816_2.jpg?versionId=rkaPyn1wsIZ1sdvxXpSRXaaOIPV9iekA",
      link: "/san-pham-chong-nang-sau-khi-di-nang"
    },
    {
      label: "Sữa rửa mặt",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250623034637-0-P29287_1.jpg?versionId=FrXaj3AVC.aqNBO7B7lgUqU2_WleBlYs",
      link: "/sua-rua-mat"
    },
    {
      label: "Hỗ trợ giảm lão hóa",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250623034533-0-P29288_1.jpg?versionId=vAqY2UjaU9Bk8cOfMcv8gTtQbuxUqxgn",
      link: "/ho-tro-giam-lao-hoa"
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
                <BreadcrumbLink href="/cham-soc-sac-dep">Chăm sóc sắc đẹp</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dược - Mỹ phẩm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Dược - Mỹ phẩm</h1>

        {/* Product Type Categories */}
        <section className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {productTypes.map((type) => (
              <Card key={type.label} className={`p-3 text-center border rounded-2xl ${type.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {type.link ? (
                  <Link href={type.link}>
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted mb-2 overflow-hidden">
                      <img
                        src={type.imageUrl}
                        alt={type.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs font-medium leading-snug">{type.label}</div>
                  </Link>
                ) : (
                  <>
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted mb-2 overflow-hidden">
                      <img
                        src={type.imageUrl}
                        alt={type.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs font-medium leading-snug">{type.label}</div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </section>

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
                      <RadioGroupItem id="pr3" value="300-500" />
                      <Label htmlFor="pr3" className="font-normal">300.000 ₫ - 500.000 ₫</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr4" value="gt-500" />
                      <Label htmlFor="pr4" className="font-normal">Trên 500.000 ₫</Label>
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

            <BeautyCareProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
