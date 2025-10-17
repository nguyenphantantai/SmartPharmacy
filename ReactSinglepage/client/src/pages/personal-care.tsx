import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PersonalCareProductGrid from "@/components/personal-care-product-grid";
import { useState, useMemo } from "react";
import { personalCareProducts } from "@/data/personal-care";
import { Link } from "wouter";

export default function PersonalCarePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const categories = [
    { label: "Sản phẩm khử mùi", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241024030836-0-P26024_1.jpg?versionId=spmwMlPU6eIkPNZQDFa4gTZoHIUJFAkf", link: "/san-pham-khu-mui" },
    { label: "Sản phẩm phòng tắm", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241024031313-0-P12966_1.jpg?versionId=7uh97NVAeF_yrfYrdfQd9v_oVPXty5SL", link: "/san-pham-phong-tam" },
    { label: "Chăm sóc tóc", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/ecommerce/20240223200151-0-P17520_1.png", link: "/cham-soc-toc" },
    { label: "Chăm sóc răng miệng", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241024100437-0-P10405_1.jpg?versionId=4lYaR2CmM8cVoHfyUnmuCg8oElM8mKrn", link: "/cham-soc-rang-mieng" },
    { label: "Vệ sinh phụ nữ", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241024101209-0-P13220_1.png?versionId=Y4dxoELdalNFQsnI40qMZWzsJka.p6x3", link: "/ve-sinh-phu-nu" },
    { label: "Chăm sóc nam giới", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/ecommerce/20240223195748-0-P03307_1.png", link: "/cham-soc-nam-gioi" },
    { label: "Chăm sóc cơ thể", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/ecommerce/20240223195428-0-P13421_1.png", link: "/cham-soc-co-the" },
  ];

  const brands = useMemo(() => {
    const allBrands = personalCareProducts.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, []);

  const visibleBrands = useMemo(() => {
    const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
    const matchedBrands = brands.filter((brand) =>
      brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
    );
    return showAllBrands ? matchedBrands : matchedBrands.slice(0, 5);
  }, [brands, brandFilterQuery, showAllBrands]);

  const filteredProducts = useMemo(() => {
    let filtered = personalCareProducts;

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = parseInt(product.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (brandFilterQuery) {
      const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
      );
    }

    return filtered;
  }, [priceRange, brandFilterQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto max-w-screen-2xl px-6 py-8">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chăm sóc cá nhân</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Chăm sóc cá nhân</h1>

        <section className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
            {categories.map((c) => (
              <Card key={c.label} className={`p-4 text-center border rounded-2xl ${c.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {c.link ? (
                  <Link href={c.link}>
                    <div className="mx-auto h-24 w-24 rounded-full bg-muted mb-3 overflow-hidden">
                      <img 
                        src={c.imageUrl} 
                        alt={c.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium leading-snug">{c.label}</div>
                  </Link>
                ) : (
                  <>
                    <div className="mx-auto h-24 w-24 rounded-full bg-muted mb-3 overflow-hidden">
                      <img 
                        src={c.imageUrl} 
                        alt={c.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium leading-snug">{c.label}</div>
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
              <Button variant="ghost" size="sm">Thiết lập lại</Button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium mb-2">Khoảng giá</div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Tối thiểu" className="h-9" />
                  <Input placeholder="Tối đa" className="h-9" />
                </div>
                <Button className="mt-3 w-full">Áp dụng</Button>

                <div className="mt-3 space-y-2">
                  <RadioGroup value={priceRange} onValueChange={setPriceRange} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr1" value="lt-100" />
                      <Label htmlFor="pr1" className="font-normal">Dưới 100.000 đ</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr2" value="100-300" />
                      <Label htmlFor="pr2" className="font-normal">100.000 đ - 300.000 đ</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr3" value="300-500" />
                      <Label htmlFor="pr3" className="font-normal">300.000 đ - 500.000 đ</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pr4" value=">500" />
                      <Label htmlFor="pr4" className="font-normal">Trên 500.000 đ</Label>
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
                  {visibleBrands.map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <Checkbox id={`brand-${b}`} />
                      <Label htmlFor={`brand-${b}`} className="font-normal">{b}</Label>
                    </div>
                  ))}
                </div>
                {!showAllBrands && (
                  <Button variant="link" className="px-0 mt-2" onClick={() => setShowAllBrands(true)}>Xem thêm</Button>
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

            <PersonalCareProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


