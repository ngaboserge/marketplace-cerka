import { useState } from 'react';
import { Search, Filter, X, ChevronDown, Star } from '@/lib/icons';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  categories: FilterOption[];
  locations: FilterOption[];
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  resultCount?: number;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  onFiltersChange,
  categories,
  locations,
  priceRange,
  onPriceRangeChange,
  resultCount,
  isLoading = false,
  children,
}: SearchFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    suppliers: [] as string[],
    verified: false,
    minRating: 0,
    inStock: false,
    featured: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    location: true,
    supplier: false,
    rating: true,
    other: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType: string, value: string | boolean | number) => {
    let newFilters = { ...activeFilters };

    if (filterType === 'categories' || filterType === 'locations' || filterType === 'suppliers') {
      const currentArray = newFilters[filterType] as string[];
      if (currentArray.includes(value as string)) {
        newFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        newFilters[filterType] = [...currentArray, value as string];
      }
    } else {
      (newFilters as any)[filterType] = value;
    }

    setActiveFilters(newFilters);
    
    // Convert to the format expected by the parent component
    const parentFilters = {
      material_id: '',
      location: newFilters.locations.length > 0 ? newFilters.locations[0] : '',
      min_price: undefined,
      max_price: undefined,
      min_rating: newFilters.minRating > 0 ? newFilters.minRating : undefined,
      verified_only: newFilters.verified,
      categories: newFilters.categories,
      in_stock: newFilters.inStock,
      featured: newFilters.featured
    };
    
    onFiltersChange(parentFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      locations: [],
      suppliers: [],
      verified: false,
      minRating: 0,
      inStock: false,
      featured: false,
    };
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onPriceRangeChange({ min: 0, max: 10000 });
  };

  const getActiveFilterCount = () => {
    return (
      activeFilters.categories.length +
      activeFilters.locations.length +
      activeFilters.suppliers.length +
      (activeFilters.verified ? 1 : 0) +
      (activeFilters.minRating > 0 ? 1 : 0) +
      (activeFilters.inStock ? 1 : 0) +
      (activeFilters.featured ? 1 : 0)
    );
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="filter-group">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="filter-title flex items-center justify-between w-full text-left hover:text-orange-600 transition-colors"
      >
        {title}
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ 
    label, 
    count, 
    checked, 
    onChange 
  }: { 
    label: string; 
    count?: number; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <label className="filter-option">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-orange-600 border-neutral-300 rounded focus:ring-orange-500"
      />
      <span className="text-sm text-neutral-700 flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-neutral-500">({count})</span>
      )}
    </label>
  );

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="container-marketplace py-6 border-b border-neutral-200">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for materials, products, suppliers..."
              className="search-input pl-12 pr-4 w-full shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="container-marketplace py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {resultCount !== undefined && (
              <span className="text-sm text-neutral-600">
                {isLoading ? 'Searching...' : `${resultCount.toLocaleString()} results`}
              </span>
            )}
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear all filters ({getActiveFilterCount()})
              </button>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden btn-secondary text-sm px-3 py-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="container-marketplace">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}>
            <div className="sticky top-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Filters</h3>

              {/* Categories */}
              <FilterSection title="Categories" sectionKey="categories">
                {categories.map((category) => (
                  <CheckboxOption
                    key={category.id}
                    label={category.label}
                    count={category.count}
                    checked={activeFilters.categories.includes(category.id)}
                    onChange={(checked) => handleFilterChange('categories', category.id)}
                  />
                ))}
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range" sectionKey="price">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => onPriceRangeChange({
                        ...priceRange,
                        min: Number(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <span className="text-neutral-500 self-center">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ''}
                      onChange={(e) => onPriceRangeChange({
                        ...priceRange,
                        max: Number(e.target.value) || 10000
                      })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onPriceRangeChange({ min: 0, max: 100 })}
                      className="btn-secondary text-xs flex-1"
                    >
                      $0-$100
                    </button>
                    <button 
                      onClick={() => onPriceRangeChange({ min: 100, max: 500 })}
                      className="btn-secondary text-xs flex-1"
                    >
                      $100-$500
                    </button>
                    <button 
                      onClick={() => onPriceRangeChange({ min: 500, max: 1000 })}
                      className="btn-secondary text-xs flex-1"
                    >
                      $500+
                    </button>
                  </div>
                </div>
              </FilterSection>

              {/* Location */}
              <FilterSection title="Location" sectionKey="location">
                {locations.map((location) => (
                  <CheckboxOption
                    key={location.id}
                    label={location.label}
                    count={location.count}
                    checked={activeFilters.locations.includes(location.id)}
                    onChange={(checked) => handleFilterChange('locations', location.id)}
                  />
                ))}
              </FilterSection>

              {/* Rating */}
              <FilterSection title="Supplier Rating" sectionKey="rating">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={activeFilters.minRating === rating}
                      onChange={() => handleFilterChange('minRating', rating)}
                      className="w-4 h-4 text-orange-600 border-neutral-300 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-neutral-700 ml-1">& up</span>
                    </div>
                  </label>
                ))}
              </FilterSection>

              {/* Other Filters */}
              <FilterSection title="Other" sectionKey="other">
                <CheckboxOption
                  label="Verified Suppliers Only"
                  checked={activeFilters.verified}
                  onChange={(checked) => handleFilterChange('verified', checked)}
                />
                <CheckboxOption
                  label="In Stock Only"
                  checked={activeFilters.inStock}
                  onChange={(checked) => handleFilterChange('inStock', checked)}
                />
                <CheckboxOption
                  label="Featured Products"
                  checked={activeFilters.featured}
                  onChange={(checked) => handleFilterChange('featured', checked)}
                />
              </FilterSection>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}