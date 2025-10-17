import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  // Category filters
  selectedCategory: string | null;
  
  // Price filters
  minPrice: number | null;
  maxPrice: number | null;
  priceRange: string | null;
  
  // Brand filters
  selectedBrands: string[];
  
  // Sort options
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

interface FilterContextType {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  selectedCategory: null,
  minPrice: null,
  maxPrice: null,
  priceRange: null,
  selectedBrands: [],
  sortBy: 'newest',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
