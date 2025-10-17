import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import MedicineProductGrid from "@/components/medicine-product-grid";
import FilterSidebar from "@/components/filter-sidebar";
import CategoryTabs from "@/components/category-tabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useState } from "react";

export default function MedicinePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      label: "Thuốc không kê đơn",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191727-0-P00126_5.png",
      value: "non-prescription",
    },
    {
      label: "Thuốc kê đơn",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
      value: "prescription",
    },
    {
      label: "Thuốc khác",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241114032116-0-P01147_1.png?versionId=vjQWD_h1BWBzg10ZLGzWbTfrxumLOzPo",
      value: "other",
    },
    {
      label: "Vitamin & Thực phẩm chức năng",
      imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/product/20241128031704-0-P28451_1.jpg?versionId=co6QK3WcZuzQyCzl5q6CrXov0GkwnoEu",
      value: "vitamin",
    },
  ];

  const brands = [
    "STELLA",
    "DHG Pharma",
    "Davipharm",
    "Hasan- Demarpharm",
    "Domesco",
    "Pymepharco",
    "Imexpharm",
    "Traphaco",
    "Sao Thái Dương",
  ];

  return (
    <FilterProvider>
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
                  <BreadcrumbPage>Thuốc</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <h1 className="text-2xl font-bold mb-4">Thuốc</h1>

          <CategoryTabs categories={categories} />

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <FilterSidebar brands={brands} />
            <section>
              <MedicineProductGrid />
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </FilterProvider>
  );
}


