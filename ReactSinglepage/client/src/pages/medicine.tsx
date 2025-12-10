import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import MedicineProductGrid from "@/components/medicine-product-grid";
import FilterSidebar from "@/components/filter-sidebar";
import CategoryTabs from "@/components/category-tabs";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import { useState, useEffect } from "react";

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:5000";

// Default brands from images (fallback if API fails) - moved outside component to avoid recreation
const defaultBrands = [
    "STELLA",
    "DHG Pharma",
    "Davipharm",
    "Hasan- Demarpharm",
    "Domesco",
    "AGIPHARM",
    "Mekophar",
    "Pymepharco",
    "Novartis",
    "Savi",
    "Imexpharm",
    "Khanh Hoa",
    "Boston",
    "BIDIPHAR",
    "Medisun",
    "An Thien",
    "Danapha",
    "TVPharma",
    "Pharmedic",
    "GSK ETC",
    "GLOMED-ABBOTT",
    "STADA",
    "Vidipha",
    "Abbott",
    "Ha Tay",
    "OPV",
    "Phil Inter Pharma",
    "Sanofi GEM",
    "Boehringer Ingelheim",
    "Mediplantex",
    "Duoc pham 3/2",
    "SPM",
    "Traphaco",
    "OPC",
    "AstraZeneca",
    "Mega Lifesciences",
    "Ampharco U.S.A",
    "Merap Group",
    "United Pharma",
    "Pharbaco (TW1)",
    "Merck Sharp & Dohme",
    "Servier International",
    "US Pharma",
    "Glenmark",
    "Meyer-BPC",
    "Egis Pharma",
    "Nadyphar",
    "Janssen",
    "Bayer (Others)",
];

// Main categories - 16 categories as shown in the image
// Images should be placed in: ReactSinglepage/client/public/images/subcategories/
export const medicineCategories = [
  {
    label: "Thuốc ngừa thai",
    imageUrl: "/images/subcategories/Thuốc Ngừa Thai.jpg",
    value: "contraceptives",
  },
  {
    label: "Thuốc kháng dị ứng",
    imageUrl: "/images/subcategories/Thuốc kháng dị ứng.jpg",
    value: "antihistamines",
  },
  {
    label: "Thuốc kháng viêm",
    imageUrl: "/images/subcategories/Thuốc kháng viêm.jpg",
    value: "anti-inflammatory",
  },
  {
    label: "Thuốc cảm lạnh",
    imageUrl: "/images/subcategories/Thuốc cảm lạnh.jpg",
    value: "cold-medicine",
  },
  {
    label: "Thuốc giảm cân",
    imageUrl: "/images/subcategories/Thuốc giảm cân.jpg",
    value: "weight-loss",
  },
  {
    label: "Thuốc Mắt/Tai/Mũi",
    imageUrl: "/images/subcategories/Thuốc Mắt,Tai,Mũi.jpg",
    value: "eye-ear-nose",
  },
  {
    label: "Thuốc tiêu hóa",
    imageUrl: "/images/subcategories/Thuốc tiêu hóa.jpg",
    value: "digestive",
  },
  {
    label: "Thuốc dành cho nam",
    imageUrl: "/images/subcategories/Thuốc dành cho nam giới.jpg",
    value: "mens-medicine",
  },
  {
    label: "Giảm đau, hạ sốt",
    imageUrl: "/images/subcategories/Giảm đau, hạ sốt.jpg",
    value: "pain-fever",
  },
  {
    label: "Thuốc da liễu",
    imageUrl: "/images/subcategories/Thuốc da liễu.jpg",
    value: "dermatological",
  },
  {
    label: "Thuốc dành cho phụ nữ",
    imageUrl: "/images/subcategories/Thuốc dành cho phụ nữ.jpg",
    value: "womens-medicine",
  },
  {
    label: "Thuốc thần kinh",
    imageUrl: "/images/subcategories/Thuốc thần kinh.jpg",
    value: "nervous-system",
  },
  {
    label: "Thuốc cơ xương khớp",
    imageUrl: "/images/subcategories/Thuốc cơ xương khớp.jpg",
    value: "musculoskeletal",
  },
  {
    label: "Dầu, Cao xoa bóp",
    imageUrl: "/images/subcategories/Dầu, cao xoa bóp.jpg",
    value: "oils-balms",
  },
  {
    label: "Thuốc khác",
    imageUrl: "/images/subcategories/Thuốc khác.jpg",
    value: "other-medicines",
  },
  {
    label: "Vitamin & Khoáng chất",
    imageUrl: "/images/subcategories/Vitamin & khoáng chất.jpg",
    value: "vitamins-minerals",
  },
  {
    label: "Thuốc kháng sinh",
    imageUrl: "/images/subcategories/Thuốc kháng sinh.jpg.jpg",
    value: "antibiotics",
  },
  {
    label: "Thuốc tiết niệu",
    imageUrl: "/images/subcategories/Thuốc tiết niệu.jpg.jpg",
    value: "urinary",
  },
  {
    label: "Thuốc tiểu đường",
    imageUrl: "/images/subcategories/Thuốc tiểu đường.jpg.jpg",
    value: "diabetes",
  },
  {
    label: "Thuốc tim mạch, huyết áp",
    imageUrl: "/images/subcategories/Thuốc tim mạch, huyết áp.jpg.jpg",
    value: "cardiovascular",
  },
  {
    label: "Thuốc ung thư",
    imageUrl: "/images/subcategories/Thuốc ung thư.jpg.jpg",
    value: "cancer",
  },
  {
    label: "Thuốc tiêu hóa cho trẻ",
    imageUrl: "/images/subcategories/Thuốc tiêu hóa cho trẻ em.jpg",
    value: "digestive-children",
  },
  {
    label: "Thuốc nhỏ mắt",
    imageUrl: "/images/subcategories/Thuốc nhỏ mắt.jpg",
    value: "eye-drops",
  },
  {
    label: "Chăm sóc vết thương",
    imageUrl: "/images/subcategories/Chăm sóc vết thương.jpg",
    value: "wound-care",
  },
  {
    label: "Xịt mũi",
    imageUrl: "/images/subcategories/Xịt mũi.jpg",
    value: "nasal-spray",
  },
  {
    label: "Sản phẩm trị mụn",
    imageUrl: "/images/subcategories/Sản phẩm trị mụn.jpg",
    value: "acne-treatment",
  },
  {
    label: "Thuốc ho, long đờm",
    imageUrl: "/images/subcategories/Thuốc ho, long đờm.avif",
    value: "cough-expectorant",
  },
];

function MedicinePageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<string[]>(defaultBrands);
  const { filters } = useFilters();

  const categories = medicineCategories;

  useEffect(() => {
    // Helper function to check if a string looks like an ObjectId (24 hex characters)
    const isObjectId = (str: string): boolean => {
      return /^[0-9a-fA-F]{24}$/.test(str);
    };

    // Helper function to check if a string is a valid brand name
    const isValidBrandName = (brand: any): boolean => {
      // Must be a string
      if (typeof brand !== 'string') return false;
      
      const trimmed = brand.trim();
      
      // Must not be empty
      if (trimmed === '') return false;
      
      // Must not be an ObjectId (24 hex characters)
      if (isObjectId(trimmed)) return false;
      
      // Must not be just numbers
      if (/^\d+$/.test(trimmed)) return false;
      
      // Must have at least one letter
      if (!/[a-zA-ZÀ-ỹ]/.test(trimmed)) return false;
      
      return true;
    };

    // Fetch brands from API
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/brands`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            // Filter out ObjectIds and invalid brand names
            const apiBrands = (data.data as string[])
              .filter(isValidBrandName)
              .map(brand => brand.trim());
            
            // Merge API brands with default brands, remove duplicates
            const allBrands = [...new Set([...defaultBrands, ...apiBrands])]
              .filter(isValidBrandName)
              .sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
            
            setBrands(allBrands);
          } else {
            setBrands(defaultBrands);
          }
        } else {
          setBrands(defaultBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands(defaultBrands);
      }
    };

    fetchBrands();
  }, []);

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
  );
}

export default function MedicinePage() {
  return (
    <FilterProvider>
      <MedicinePageContent />
    </FilterProvider>
  );
}


