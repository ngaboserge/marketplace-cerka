import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { SearchFilters } from '@/components/marketplace/SearchFilters';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import { useMaterialsStore, useAuthStore } from '@/store';
import { ArrowLeft, Grid, List, Search } from '@/lib/icons';
import type { SearchFilters as SearchFiltersType } from '@/types/materials.types';

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'recent';
type ViewMode = 'grid' | 'list';

export default function BuyerSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { listings, loading, fetchAllListings } = useMarketplaceStore();
  const { materials, fetchMaterials } = useMaterialsStore();

  // Check for featured parameter in URL
  const searchParams = new URLSearchParams(location.search);
  const showFeaturedOnly = searchParams.get('featured') === 'true';

  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [filters, setFilters] = useState<SearchFiltersType>({
    material_id: location.state?.materialId || '',
    location: '',
    min_price: undefined,
    max_price: undefined,
    min_rating: undefined,
    verified_only: false
  });

  // Calculate real category counts from listings
  const getCategoryCount = (sector: string) => {
    return listings.filter(listing => listing.material?.sector === sector).length;
  };

  const getLocationCount = (location: string) => {
    return listings.filter(listing => 
      listing.supplier?.location?.toLowerCase().includes(location.toLowerCase()) ||
      listing.title?.toLowerCase().includes(location.toLowerCase())
    ).length;
  };

  const categories = [
    { id: 'construction', label: 'Construction Materials', count: getCategoryCount('construction') },
    { id: 'agriculture', label: 'Agriculture', count: getCategoryCount('agriculture') },
    { id: 'food', label: 'Food & Beverage', count: getCategoryCount('food') },
    { id: 'electronics', label: 'Electronics', count: getCategoryCount('electronics') },
    { id: 'textiles', label: 'Textiles', count: getCategoryCount('textiles') },
  ];

  const locations = [
    { id: 'kigali', label: 'Kigali', count: getLocationCount('kigali') },
    { id: 'musanze', label: 'Musanze', count: getLocationCount('musanze') },
    { id: 'huye', label: 'Huye', count: getLocationCount('huye') },
    { id: 'rubavu', label: 'Rubavu', count: getLocationCount('rubavu') },
    { id: 'nyagatare', label: 'Nyagatare', count: getLocationCount('nyagatare') },
  ];

  useEffect(() => {
    fetchMaterials();
    fetchAllListings();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔍 BuyerSearch Debug Info:');
    console.log('- showFeaturedOnly:', showFeaturedOnly);
    console.log('- listings count:', listings.length);
    console.log('- loading:', loading);
    console.log('- listings data:', listings);
    
    if (listings.length > 0) {
      console.log('- listings view counts:', listings.map(l => `${l.title}: ${l.view_count}`));
    }
  }, [showFeaturedOnly, listings, loading]);

  const handleSearch = () => {
    // Search is now handled by filtering the listings array
    // The filtered results will be calculated in the render
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter listings based on current filters and search query
  const filteredListings = listings.filter(listing => {
    // Featured filter - if showFeaturedOnly is true, only show listings with high view count
    if (showFeaturedOnly && listing.view_count <= 10) {
      console.log(`❌ ${listing.title} filtered out: view_count ${listing.view_count} <= 10`);
      return false;
    }
    
    // Text search
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Material filter
    if (filters.material_id && listing.material_id !== filters.material_id) {
      return false;
    }
    
    // Price range filter
    if (filters.min_price && listing.price < filters.min_price) {
      return false;
    }
    if (filters.max_price && listing.price > filters.max_price) {
      return false;
    }
    
    // Location filter (search in title for now)
    if (filters.location && !listing.title.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    if (showFeaturedOnly) {
      console.log(`✅ ${listing.title} passes featured filter: view_count ${listing.view_count} > 10`);
    }
    
    return true;
  });

  // Debug the filtered results
  useEffect(() => {
    if (showFeaturedOnly) {
      console.log('🎯 Featured filtering results:');
      console.log('- Total listings:', listings.length);
      console.log('- Filtered listings:', filteredListings.length);
      console.log('- Featured listings:', filteredListings.map(l => `${l.title} (${l.view_count} views)`));
    }
  }, [filteredListings, showFeaturedOnly]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Apply filters logic here
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setPriceRange(range);
    setFilters(prev => ({
      ...prev,
      min_price: range.min,
      max_price: range.max
    }));
  };

  // Convert search results to ProductCard format
  const convertToProductCards = (results: any[]) => {
    return results.map(listing => ({
      id: listing.id,
      title: listing.title,
      price: {
        min: listing.price,
        max: listing.price * 1.05, // Small price range for negotiation
        unit: listing.material?.unit || 'unit'
      },
      image: listing.photos?.[0] || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
      images: listing.photos?.slice(1) || [],
      supplier: {
        name: listing.supplier?.business_name || listing.supplier?.full_name || listing.supplier?.name || 'Business Supplier',
        verified: listing.supplier?.is_verified_supplier || false,
        rating: listing.supplier?.average_rating || 4.2,
        reviewCount: listing.supplier?.total_reviews || listing.quote_request_count || 5,
        responseTime: '< 2 hours',
        location: listing.supplier?.location || 'Kigali, Rwanda',
        yearsInBusiness: 3
      },
      minOrder: {
        quantity: listing.min_quantity || 1,
        unit: listing.material?.unit || 'units'
      },
      category: listing.material?.category || 'General',
      badges: ['Verified Supplier'],
      inStock: listing.availability_status === 'available',
      featured: listing.view_count > 10 || showFeaturedOnly
    }));
  };

  const productCards = convertToProductCards(filteredListings);

  const sortedResults = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return 0; // No rating data available
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading && filteredListings.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50">
          <div className="container-marketplace py-8">
            <div className="skeleton h-8 w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="skeleton h-96"></div>
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-48"></div>)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container-marketplace py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/home')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {showFeaturedOnly ? 'Featured Products' : 'Browse Products'}
                  </h1>
                  <p className="text-neutral-600">
                    {showFeaturedOnly 
                      ? 'Discover our top-rated and most popular products' 
                      : 'Find quality products from verified suppliers'
                    }
                  </p>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filters with Results */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          locations={locations}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          resultCount={filteredListings.length}
          isLoading={loading}
        >
          {/* Results Content */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {showFeaturedOnly ? 'No featured products found' : 'No products found'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {showFeaturedOnly 
                  ? 'Try browsing all products or check back later for featured items'
                  : 'Try adjusting your search filters or browse our categories'
                }
              </p>
              <div className="flex gap-4 justify-center">
                {showFeaturedOnly && (
                  <button 
                    onClick={() => navigate('/buyers/search')}
                    className="btn-primary"
                  >
                    Browse All Products
                  </button>
                )}
                <button 
                  onClick={() => navigate('/marketplace/categories')}
                  className="btn-secondary"
                >
                  Browse Categories
                </button>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}>
              {productCards.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    {...product}
                    onAddToCart={() => {
                      console.log('Added to cart:', product.id);
                    }}
                    onToggleFavorite={() => {
                      console.log('Added to favorites:', product.id);
                    }}
                    onContactSupplier={() => {
                      const listing = filteredListings.find(l => l.id === product.id);
                      const messageParams = new URLSearchParams({
                        userId: listing?.supplier_id || 'unknown',
                        supplierName: listing?.supplier?.business_name || listing?.supplier?.full_name || listing?.supplier?.name || 'Supplier',
                        context: 'product',
                        productName: product.title,
                        productId: product.id
                      });
                      navigate('/messages?' + messageParams.toString());
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </SearchFilters>
      </div>
    </Layout>
  );
}
