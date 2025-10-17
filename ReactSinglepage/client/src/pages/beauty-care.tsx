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
import { beautyCareProducts, BeautyCareProduct } from "../data/beauty-care";
import { Link } from "wouter";

export default function BeautyCarePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const categories = [
    { label: "Chăm sóc mặt", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241023044700-0-P22495_1.jpg?versionId=ULKHmv6RDluyFsR9A0QPH7CwBUd7d4hO", link: "/cham-soc-mat" },
    { label: "Sản phẩm chống nắng", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241023045138-0-P10576.jpg?versionId=WZ3NM2JBO7OXT6jd2gCFWYFkODXNI8ix", link: "/san-pham-chong-nang" },
    { label: "Dụng cụ làm đẹp", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241023045536-0-P25899_1.jpg?versionId=pp1FwJM53mTrAc0Ljup96JNF8Gkc5eFx", link: "/dung-cu-lam-dep" },
    { label: "Dược - Mỹ Phẩm", imageUrl: "https://production-cdn.pharmacity.io/digital/144x144/plain/e-com/images/product/20241023045955-0-P25096_1.jpg?versionId=b6tPcO6PoeiymcKzppQPtAc.G7kpD8VT", link: "/duoc-my-pham" },
  ];

  const brands = useMemo(() => {
    const allBrands = beautyCareProducts.map((p: BeautyCareProduct) => p.brand);
    return Array.from(new Set(allBrands)) as string[];
  }, []);

  const visibleBrands = useMemo(() => {
    const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
    const matchedBrands = brands.filter((brand: string) =>
      brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
    );
    return showAllBrands ? matchedBrands : matchedBrands.slice(0, 5);
  }, [brands, brandFilterQuery, showAllBrands]);

  const filteredProducts = useMemo(() => {
    let filtered = beautyCareProducts;

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product: BeautyCareProduct) => {
        const price = parseInt(product.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (brandFilterQuery) {
      const lowerCaseBrandFilterQuery = brandFilterQuery.toLowerCase();
      filtered = filtered.filter((product: BeautyCareProduct) =>
        product.brand.toLowerCase().includes(lowerCaseBrandFilterQuery)
      );
    }

    return filtered;
  }, [priceRange, brandFilterQuery]);

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
                <BreadcrumbPage>Chăm sóc sắc đẹp</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Chăm sóc sắc đẹp</h1>

        <section className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
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

              <div>
                <div className="text-sm font-medium mb-2">Thương hiệu</div>
                <Input
                  value={brandFilterQuery}
                  onChange={(e) => setBrandFilterQuery(e.target.value)}
                  placeholder="Nhập tên thương hiệu"
                  className="h-9 mb-3"
                />
                <div className="space-y-3">
                  {visibleBrands.map((b: string) => (
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

            <BeautyCareProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
