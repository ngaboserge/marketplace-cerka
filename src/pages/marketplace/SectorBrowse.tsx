import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SearchFilters } from '@/components/marketplace/SearchFilters';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import { 
  ArrowLeft, Package, TrendingUp, Grid, List, Shield, Clock,
  Building, Wheat, Meat, Smartphone, Car, Home as HomeIcon, 
  Tool, Cow, Lightning, Hammer, Box, Hospital, Tractor, Shirt
} from '@/lib/icons';

const SECTOR_CONFIG = {
  'construction-materials': {
    name: 'Construction Materials',
    icon: <Building className="w-16 h-16" />,
    description: 'Building materials, cement, steel, and construction supplies',
    color: 'from-orange-500 to-red-500',
    dbSector: 'construction'
  },
  'construction': {
    name: 'Construction',
    icon: <Building className="w-16 h-16" />,
    description: 'Building materials, cement, steel, and construction supplies',
    color: 'from-blue-500 to-indigo-500',
    dbSector: 'construction'
  },
  agriculture: {
    name: 'Agriculture',
    icon: <Wheat className="w-16 h-16" />,
    description: 'Seeds, fertilizer, produce, and farming supplies',
    color: 'from-green-500 to-emerald-500',
    dbSector: 'agriculture'
  },
  'food-and-beverage': {
    name: 'Food & Beverage',
    icon: <Meat className="w-16 h-16" />,
    description: 'Staples, proteins, produce, dairy, and beverages',
    color: 'from-red-500 to-pink-500',
    dbSector: 'food'
  },
  'food': {
    name: 'Food & Beverage',
    icon: <Meat className="w-16 h-16" />,
    description: 'Staples, proteins, produce, dairy, and beverages',
    color: 'from-orange-500 to-red-500',
    dbSector: 'food'
  },
  electronics: {
    name: 'Electronics',
    icon: <Smartphone className="w-16 h-16" />,
    description: 'Phones, laptops, solar panels, and electronic devices',
    color: 'from-blue-500 to-indigo-500',
    dbSector: 'electronics'
  },
  vehicles: {
    name: 'Vehicles',
    icon: <Car className="w-16 h-16" />,
    description: 'Cars, motorcycles, trucks, and vehicle parts',
    color: 'from-gray-500 to-slate-500',
    dbSector: 'vehicles'
  },
  'real-estate': {
    name: 'Real Estate',
    icon: <HomeIcon className="w-16 h-16" />,
    description: 'Houses, apartments, shops, and commercial spaces',
    color: 'from-purple-500 to-violet-500',
    dbSector: 'real-estate'
  },
  'rentals': {
    name: 'Real Estate',
    icon: <HomeIcon className="w-16 h-16" />,
    description: 'Houses, apartments, shops, and commercial spaces',
    color: 'from-indigo-500 to-purple-500',
    dbSector: 'real-estate'
  },
  services: {
    name: 'Services',
    icon: <Tool className="w-16 h-16" />,
    description: 'Labor, transport, equipment rental, and professional services',
    color: 'from-indigo-500 to-blue-500',
    dbSector: 'services'
  },
  livestock: {
    name: 'Livestock',
    icon: <Cow className="w-16 h-16" />,
    description: 'Cows, goats, chickens, and animal products',
    color: 'from-amber-500 to-yellow-500',
    dbSector: 'livestock'
  },
  'energy-and-utilities': {
    name: 'Energy & Utilities',
    icon: <Lightning className="w-16 h-16" />,
    description: 'Charcoal, gas, solar, and energy solutions',
    color: 'from-yellow-500 to-orange-500',
    dbSector: 'energy'
  },
  'hardware-and-tools': {
    name: 'Hardware & Tools',
    icon: <Hammer className="w-16 h-16" />,
    description: 'Tools, equipment, and hardware supplies',
    color: 'from-slate-500 to-gray-500',
    dbSector: 'hardware'
  },
  'manufactured-goods': {
    name: 'Manufactured Goods',
    icon: <Box className="w-16 h-16" />,
    description: 'Clothes, shoes, plastic goods, and consumer products',
    color: 'from-cyan-500 to-blue-500',
    dbSector: 'manufactured'
  },
  'health-and-hygiene': {
    name: 'Health & Hygiene',
    icon: <Hospital className="w-16 h-16" />,
    description: 'Soap, sanitizers, medical supplies, and hygiene products',
    color: 'from-pink-500 to-rose-500',
    dbSector: 'health'
  },
  'automotive-and-transport': {
    name: 'Automotive & Transport',
    icon: <Tractor className="w-16 h-16" />,
    description: 'Fuel, spare parts, tires, and automotive supplies',
    color: 'from-emerald-500 to-green-500',
    dbSector: 'automotive'
  },
  'textiles-and-tailoring': {
    name: 'Textiles & Tailoring',
    icon: <Shirt className="w-16 h-16" />,
    description: 'Fabric, thread, buttons, and tailoring supplies',
    color: 'from-violet-500 to-purple-500',
    dbSector: 'textiles'
  }
};

export default function SectorBrowse() {
  const { sector } = useParams<{ sector: string }>();
  const navigate = useNavigate();
  const { listings, loading, fetchListingsBySector } = useMarketplaceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'rating'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 10000,
    verifiedOnly: false
  });
  
  const config = sector ? SECTOR_CONFIG[sector as keyof typeof SECTOR_CONFIG] : null;
  
  useEffect(() => {
    if (sector && config) {
      fetchListingsBySector(config.dbSector);
    }
  }, [sector, config, fetchListingsBySector]);

  // Convert real listings to ProductCard format
  const convertToProductCards = (listings: any[]) => {
    return listings.map(listing => ({
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
        location: listing.supplier?.location || listing.location || 'Rwanda',
        yearsInBusiness: 3
      },
      minOrder: {
        quantity: listing.min_quantity || 1,
        unit: listing.material?.unit || 'units'
      },
      category: config?.name || 'General',
      badges: listing.supplier?.is_verified_supplier ? ['Verified Supplier'] : [],
      inStock: listing.availability_status === 'available',
      featured: listing.view_count > 10
    }));
  };

  const products = convertToProductCards(listings);

  // Calculate real category counts from listings
  const getCategoryCount = (category: string) => {
    return listings.filter(listing => 
      listing.material?.category?.toLowerCase().includes(category.toLowerCase())
    ).length;
  };

  const getLocationCount = (location: string) => {
    return listings.filter(listing => 
      listing.location?.toLowerCase().includes(location.toLowerCase())
    ).length;
  };

  const categories = [
    { id: 'cement', label: 'Cement', count: getCategoryCount('cement') },
    { id: 'steel', label: 'Steel & Metal', count: getCategoryCount('steel') },
    { id: 'bricks', label: 'Bricks & Blocks', count: getCategoryCount('brick') },
    { id: 'roofing', label: 'Roofing Materials', count: getCategoryCount('roofing') },
    { id: 'tools', label: 'Construction Tools', count: getCategoryCount('tools') }
  ];

  const locations = [
    { id: 'kigali', label: 'Kigali', count: getLocationCount('kigali') },
    { id: 'huye', label: 'Huye', count: getLocationCount('huye') },
    { id: 'musanze', label: 'Musanze', count: getLocationCount('musanze') },
    { id: 'rubavu', label: 'Rubavu', count: getLocationCount('rubavu') }
  ];
  
  if (!config) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container-marketplace section-padding text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Category not found</h1>
          <p className="text-neutral-600 mb-6">The category "{sector}" doesn't exist or is not available yet.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/marketplace/categories')}
              className="btn-primary"
            >
              Browse All Categories
            </button>
            <button 
              onClick={() => navigate('/marketplace/construction-materials')}
              className="btn-secondary"
            >
              View Construction Materials
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleContactSupplier = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const listing = listings.find(l => l.id === productId);
    
    if (product && listing) {
      const messageParams = new URLSearchParams({
        userId: listing.supplier_id,
        supplierName: listing.supplier?.business_name || listing.supplier?.full_name || listing.supplier?.name || 'Supplier',
        context: 'product',
        productName: product.title,
        productId: productId,
        sector: sector || ''
      });
      navigate('/messages?' + messageParams.toString());
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <div className={`promo-banner bg-gradient-to-r ${config.color}`}>
        <div className="container-marketplace">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-white">{config.icon}</div>
            <div>
              <h1 className="promo-title text-5xl">{config.name}</h1>
              <p className="promo-subtitle text-xl">{config.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Package className="w-4 h-4" />
              <span>{products.length} Products Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>Verified Suppliers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span>Price Intelligence</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Fast Response</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-marketplace py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-orange-600">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span>/</span>
            <button onClick={() => navigate('/marketplace/categories')} className="hover:text-orange-600">
              All Categories
            </button>
            <span>/</span>
            <span className="text-neutral-900">{config.name}</span>
          </div>
        </div>
      </div>

      {/* Search Filters with Results */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        locations={locations}
        priceRange={{ min: filters.minPrice, max: filters.maxPrice }}
        onPriceRangeChange={(range) => setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }))}
        resultCount={products.length}
        isLoading={loading}
      >
        {/* Results */}
        <div className="section-padding">
          {/* View Controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {config.name} Products
              </h2>
              <p className="text-neutral-600">
                {products.length} products from verified suppliers
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recent">Most Recent</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
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

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton h-96"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">No products found</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Try adjusting your search filters or browse other categories
              </p>
              <button 
                onClick={() => navigate('/marketplace/categories')}
                className="btn-primary"
              >
                Browse Other Categories
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'product-grid' : 'space-y-4'}>
              {products.map((product, index) => (
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
                    onContactSupplier={() => handleContactSupplier(product.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Post a request and let suppliers in the {config.name.toLowerCase()} sector come to you with their best offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/materials/submit')}
                className="btn-primary"
              >
                Post a Request
              </button>
              <button
                onClick={() => navigate('/materials/trends')}
                className="btn-secondary"
              >
                View Price Trends
              </button>
            </div>
          </div>
        </div>
      </SearchFilters>

      <Footer />
    </div>
  );
}