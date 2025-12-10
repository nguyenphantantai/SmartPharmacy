import { useMemo } from 'react';
import { Product } from '@shared/schema';
import { useFilters } from '@/contexts/FilterContext';
import { medicineCategories } from '@/pages/medicine';
import { isCategoryMatch } from '@/utils/categoryMapping';

// Helper function to get category label from value
function getCategoryLabel(categoryValue: string): string | null {
  const category = medicineCategories.find(cat => cat.value === categoryValue);
  return category ? category.label : null;
}

export function useFilteredProducts(products: Product[]) {
  const { filters } = useFilters();

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category - map category value to categoryName
    if (filters.selectedCategory) {
      const categoryLabel = getCategoryLabel(filters.selectedCategory);
      console.log(`🔍 Filtering by category: "${filters.selectedCategory}" → Label: "${categoryLabel}"`);
      
      if (categoryLabel) {
        // Filter by categoryName from database using category mapping
        console.log(`📊 Before filter: ${filtered.length} products`);
        console.log(`🔍 Looking for category: "${categoryLabel}"`);
        
        filtered = filtered.filter(product => {
          const productCategory = (product as any).categoryName || (product as any).category || '';
          if (!productCategory) {
            return false;
          }
          
          // Sử dụng category mapping để kiểm tra match
          const matches = isCategoryMatch(productCategory, categoryLabel);
          
          return matches;
        });
        
        console.log(`✅ After filter: ${filtered.length} products found for category "${categoryLabel}"`);
        
        // Log một vài products được filter
        if (filtered.length > 0) {
          console.log(`📝 Sample filtered products:`);
          filtered.slice(0, 5).forEach((p: any) => {
            console.log(`   - "${p.name}" (category: "${(p as any).categoryName || (p as any).category || 'N/A'}")`);
          });
        } else {
          console.log(`⚠️ No products found! Checking all products with categories:`);
          // Log tất cả products có category để debug
          const productsWithCategory = products.filter((p: any) => 
            (p as any).categoryName || (p as any).category
          );
          console.log(`   Total products with category: ${productsWithCategory.length}`);
          productsWithCategory.slice(0, 10).forEach((p: any) => {
            console.log(`   - "${p.name}" (categoryName: "${p.categoryName || 'N/A'}", category: "${p.category || 'N/A'}")`);
          });
          
          // Log để xem có products nào có category tương tự không
          const similarCategories = products
            .map((p: any) => (p as any).categoryName || (p as any).category)
            .filter(Boolean)
            .filter((cat, idx, arr) => arr.indexOf(cat) === idx)
            .slice(0, 10);
          console.log(`   Available categories in products:`, similarCategories);
        }
      } else {
        // Fallback to old logic for special categories
        filtered = filtered.filter(product => {
          switch (filters.selectedCategory) {
            case 'non-prescription':
              return !product.isPrescription;
            case 'prescription':
              return product.isPrescription;
            case 'vitamin':
              return product.name.toLowerCase().includes('vitamin') || 
                     product.description?.toLowerCase().includes('vitamin') ||
                     product.brand?.toLowerCase().includes('vitamin');
            case 'other':
              return !product.isPrescription && 
                     !product.name.toLowerCase().includes('vitamin') &&
                     !product.description?.toLowerCase().includes('vitamin');
            default:
              return true;
          }
        });
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (filters.priceRange) {
          case 'lt-100':
            return price < 100000;
          case '100-300':
            return price >= 100000 && price <= 300000;
          case '300-500':
            return price >= 300000 && price <= 500000;
          case '>500':
            return price > 500000;
          default:
            return true;
        }
      });
    }

    // Filter by custom price range
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      filtered = filtered.filter(product => {
        const price = product.price;
        if (filters.minPrice !== null && price < filters.minPrice) return false;
        if (filters.maxPrice !== null && price > filters.maxPrice) return false;
        return true;
      });
    }

    // Filter by brands
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        filters.selectedBrands.some(brand => 
          product.brand?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  return filteredProducts;
}
