import { useMemo } from 'react';
import { Product } from '@shared/schema';
import { useFilters } from '@/contexts/FilterContext';

export function useFilteredProducts(products: Product[]) {
  const { filters } = useFilters();

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (filters.selectedCategory) {
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
