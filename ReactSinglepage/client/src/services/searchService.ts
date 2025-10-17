import { medicalDevicesProducts, MedicalDeviceProduct } from "@/data/medical-devices";
import { personalCareProducts, PersonalCareProduct } from "@/data/personal-care";
import { supplementProducts, SupplementProduct } from "@/data/supplements";
import { momBabyProducts, MomBabyProduct } from "@/data/mom-baby";
import { beautyCareProducts, BeautyCareProduct } from "@/data/beauty-care";

// Unified product interface
export interface SearchProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  unit: string;
  imageUrl: string;
  category: string;
  brand: string;
  isNew?: boolean;
  discountPercentage?: string;
  isGift?: boolean;
  type: 'medical' | 'personal' | 'supplement' | 'mom-baby' | 'beauty';
}

// Convert all products to unified format
const allProducts: SearchProduct[] = [
  ...medicalDevicesProducts.map(p => ({ ...p, type: 'medical' as const })),
  ...personalCareProducts.map(p => ({ ...p, type: 'personal' as const })),
  ...supplementProducts.map(p => ({ ...p, type: 'supplement' as const })),
  ...momBabyProducts.map(p => ({ ...p, type: 'mom-baby' as const })),
  ...beautyCareProducts.map(p => ({ ...p, type: 'beauty' as const })),
];

export interface SearchResult {
  products: SearchProduct[];
  total: number;
  categories: string[];
  brands: string[];
}

export class SearchService {
  /**
   * Search products by query
   */
  static searchProducts(query: string, limit: number = 8): SearchResult {
    if (!query || query.trim().length < 2) {
      return {
        products: [],
        total: 0,
        categories: [],
        brands: []
      };
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Search in name, description, category, brand
    const filteredProducts = allProducts.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.brand
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });

    // Sort by relevance (exact matches first, then partial matches)
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact name match gets highest priority
      if (aName === searchTerm && bName !== searchTerm) return -1;
      if (bName === searchTerm && aName !== searchTerm) return 1;
      
      // Name starts with search term gets second priority
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      
      // Then sort by name alphabetically
      return aName.localeCompare(bName);
    });

    // Get unique categories and brands from results
    const categories = Array.from(new Set(sortedProducts.map(p => p.category)));
    const brands = Array.from(new Set(sortedProducts.map(p => p.brand)));

    return {
      products: sortedProducts.slice(0, limit),
      total: sortedProducts.length,
      categories,
      brands
    };
  }

  /**
   * Get popular search suggestions
   */
  static getPopularSuggestions(): string[] {
    return [
      "sữa dinh dưỡng",
      "probiotics",
      "khẩu trang",
      "kem chống nắng",
      "collagen",
      "giải nhiệt",
      "hạ sốt",
      "vitamin C",
      "omega 3",
      "canxi",
      "sắt",
      "kẽm",
      "tảo xoắn",
      "nghệ",
      "gừng",
      "mật ong",
      "tinh dầu",
      "serum",
      "toner",
      "sữa rửa mặt"
    ];
  }

  /**
   * Get trending products (products with high discount or new)
   */
  static getTrendingProducts(limit: number = 6): SearchProduct[] {
    return allProducts
      .filter(p => p.isNew || p.discountPercentage)
      .sort((a, b) => {
        // Prioritize new products, then high discount
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        
        const aDiscount = parseInt(a.discountPercentage || '0');
        const bDiscount = parseInt(b.discountPercentage || '0');
        return bDiscount - aDiscount;
      })
      .slice(0, limit);
  }

  /**
   * Get products by category
   */
  static getProductsByCategory(category: string, limit: number = 8): SearchProduct[] {
    return allProducts
      .filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, limit);
  }

  /**
   * Get products by brand
   */
  static getProductsByBrand(brand: string, limit: number = 8): SearchProduct[] {
    return allProducts
      .filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()))
      .slice(0, limit);
  }
}
