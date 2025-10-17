import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SupplementsProductGrid from "@/components/supplements-product-grid";
import { useState } from "react";
import { supplementProducts } from "@/data/supplements";

export default function SupplementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);
  const [brandFilterQuery, setBrandFilterQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const categories = [
    { label: "Dành cho trẻ em", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250411071005-0-P18601.jpg?versionId=n9lgvaUpkc_3cg4dzN9eZp5prNMk9Wx7" },
    { label: "Chăm sóc sắc đẹp", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410100932-0-P28150_2.jpg?versionId=2nQOVboChHRdAc3waLGaHuKt_dJERIPN" },
    { label: "Nhóm tim mạch", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410101700-0-P24634_1.jpg?versionId=GUq.zkJ7WT_c5LvNisyVVfwCYLTZ1tIF" },
    { label: "Nhóm hô hấp", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410101736-0-P28369_2.jpg?versionId=kEAMiEcxz3J8T4sFqFut7dq43IMdaPZn" },
    { label: "Nhóm Mắt/Tai/Mũi", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250626101457-0-P22479_2.jpg?versionId=V4ixkDrJ._B8zfFN4lrTf6b749Yl_cld" },
    { label: "Vitamin và khoáng chất", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250520020121-0-P22151_1.jpg?versionId=VjTpuDUAwwGzMxAEcu3h3CnlC8EHw4jJ" },
    { label: "Hỗ trợ sinh lý nam nữ", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102101-0-P07764_1.jpg?versionId=53NwlaSe7TqdWYKQWe90GcnMuwgNF97F" },
    { label: "Chăm sóc gan", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102155-0-P28366_2.jpg?versionId=Qjr86woUj6Ge8TKQYyw_Hsv.Rd8WxomW" },
    { label: "Nhóm thần kinh", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102417-0-P14477.png?versionId=NmFA04AYulZ.QcnL5bs9oJFUI7VcvUdz" },
    { label: "Hỗ trợ giảm cân", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250603044216-0-P14497.jpg?versionId=tQ2a.NqG1GFqkrrx3ak.w.gBeCks6jFK" },
    { label: "Nhóm đường huyết", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102531-0-P28362_2.jpg?versionId=55pDlbpRUxFkwxFuevuwf9gx3_ICbqOB" },
    { label: "Nhóm cơ xương khớp", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102709-0-P25400_1.jpg?versionId=LfrHg5v7CQw9Uzjx8gZ7BNBM0ftuyK2_" },
    { label: "Nhóm dạ dày", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102740-0-P28363_2.jpg?versionId=fb1Y0671.esBE7qxDXUcY1vTgd.VtJx5" },
    { label: "Nhóm thận tiết niệu", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102835-0-P01116_1.png?versionId=ZRj8h77L4G9h6DMR8tY0PrkM70YkUzQr" },
    { label: "Dành cho phụ nữ mang thai", imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20250410102942-0-P28033_2.jpg?versionId=XEVjlLGTNYuEw4PFaMlEdxdkB2FXb2qx" },
  ];

  const brands = [
    "IMC",
    "Kolmar",
    "Pharmacity",
    "Thai Minh",
    "DHG Pharma",
    "Nam Dược",
    "Mega WeCare",
    "Traphaco",
  ];

  const visibleBrands = (showAllBrands ? brands : brands.slice(0, 5)).filter((b) =>
    b.toLowerCase().includes(brandFilterQuery.toLowerCase())
  );

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
                <BreadcrumbPage>Thực phẩm bảo vệ sức khỏe</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-bold mb-5">Thực phẩm bảo vệ sức khỏe</h1>

        <section className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {categories.map((c) => (
              <Card key={c.label} className="p-4 text-center border rounded-2xl">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted mb-3 overflow-hidden">
                  <img 
                    src={c.imageUrl} 
                    alt={c.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-sm font-medium leading-snug">{c.label}</div>
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

            <SupplementsProductGrid />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


