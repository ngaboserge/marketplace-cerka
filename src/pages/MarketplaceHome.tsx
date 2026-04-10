import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { useStatsStore } from '../store/statsStore';
import { priceIndexService } from '../services/priceIndex.service';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { 
  Building, Wheat, Meat, Smartphone, Car, Home as HomeIcon, Tool, Cow,
  ShoppingCart, Package, TrendingUp, TrendingDown, Search, Plus, BarChart, ArrowRight,
  Star, Shield, Clock, MapPin, Eye, Heart, Users, Database, Globe, Server, 
  Pulse, Analytics, Brain, Workflow, CheckCircle
} from '@/lib/icons';

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { listings, fetchAllListings, loading } = useMarketplaceStore();
  const { stats, fetchStats } = useStatsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [priceIndex, setPriceIndex] = useState<any[]>([]);
  const [marketSummary, setMarketSummary] = useState<any>(null);

  useEffect(() => {
    fetchAllListings();
    fetchStats();
    loadPriceIndex();
  }, []);

  const loadPriceIndex = async () => {
    try {
      const { priceIndex: priceData, marketSummary: summary } = await priceIndexService.getRealPriceIndex();
      setPriceIndex(priceData);
      setMarketSummary(summary);
    } catch (error) {
      console.error('Failed to load price index:', error);
    }
  };

  // Combined hero slides with product showcase
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop&crop=center',
      title: 'Construction Materials',
      subtitle: 'Cement, Steel, Bricks & More - Starting from 5,000 RWF',
      category: 'Construction',
      color: 'bg-orange-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&crop=center',
      title: 'Cars & Motorcycles',
      subtitle: 'New & Used Vehicles - From 2,500,000 RWF',
      category: 'Vehicles',
      color: 'bg-red-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&h=1080&fit=crop&crop=center',
      title: 'Fresh Produce',
      subtitle: 'Fruits, Vegetables & Seeds - From 2,000 RWF/kg',
      category: 'Agriculture',
      color: 'bg-green-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=1080&fit=crop&crop=center',
      title: 'Tech Products',
      subtitle: 'Computers, Phones & Gadgets - From 50,000 RWF',
      category: 'Electronics',
      color: 'bg-blue-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop&crop=center',
      title: 'Fabrics & Clothing',
      subtitle: 'Quality Textiles & Materials - From 3,000 RWF/meter',
      category: 'Textiles',
      color: 'bg-purple-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=1080&fit=crop&crop=center',
      title: 'Furniture & Decor',
      subtitle: 'Home Improvement Items - From 15,000 RWF',
      category: 'Home & Garden',
      color: 'bg-indigo-500'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyers/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleListProducts = () => {
    if (!user) {
      navigate('/register?role=supplier');
    } else if (user.role === 'supplier') {
      navigate('/suppliers/create');
    } else {
      const shouldRedirect = window.confirm(
        'To list products, you need a supplier account. Would you like to create a supplier account now?'
      );
      if (shouldRedirect) {
        navigate('/register?role=supplier');
      }
    }
  };

  // Calculate real category counts from listings
  const getCategoryCount = (sector: string) => {
    return listings.filter(listing => listing.material?.sector === sector).length;
  };

  const marketplaceCategories = [
    { id: 'construction', name: 'Construction', icon: <Building className="w-6 h-6" />, count: getCategoryCount('construction').toString(), color: 'bg-blue-500' },
    { id: 'agriculture', name: 'Agriculture', icon: <Wheat className="w-6 h-6" />, count: getCategoryCount('agriculture').toString(), color: 'bg-green-500' },
    { id: 'food', name: 'Food & Beverage', icon: <Meat className="w-6 h-6" />, count: getCategoryCount('food').toString(), color: 'bg-orange-500' },
    { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-6 h-6" />, count: getCategoryCount('electronics').toString(), color: 'bg-purple-500' },
    { id: 'vehicles', name: 'Vehicles', icon: <Car className="w-6 h-6" />, count: getCategoryCount('vehicles').toString(), color: 'bg-red-500' },
    { id: 'rentals', name: 'Real Estate', icon: <HomeIcon className="w-6 h-6" />, count: getCategoryCount('rentals').toString(), color: 'bg-indigo-500' },
    { id: 'services', name: 'Services', icon: <Tool className="w-6 h-6" />, count: getCategoryCount('services').toString(), color: 'bg-yellow-500' },
    { id: 'livestock', name: 'Livestock', icon: <Cow className="w-6 h-6" />, count: getCategoryCount('livestock').toString(), color: 'bg-pink-500' },
  ];

  // Use real listings from database instead of mock data
  const featuredProducts = listings.slice(0, 4).map(listing => ({
    id: listing.id,
    title: listing.title,
    price: { min: listing.price, max: listing.price, unit: listing.material?.unit || 'unit' },
    image: listing.photos && listing.photos.length > 0 ? listing.photos[0] : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    supplier: {
      name: listing.supplier?.business_name || listing.supplier?.full_name || listing.supplier?.name || 'Business Supplier',
      verified: listing.supplier?.is_verified_supplier || false,
      rating: listing.supplier?.average_rating || 4.0,
      reviewCount: Math.floor(Math.random() * 100) + 10, // Temporary until we have real review counts
      responseTime: '< 2 hours',
      location: 'Rwanda',
      yearsInBusiness: Math.floor(Math.random() * 10) + 2
    },
    minOrder: { quantity: 1, unit: listing.material?.unit || 'unit' },
    category: listing.material?.category || 'General',
    badges: listing.supplier?.is_verified_supplier ? ['Verified Supplier'] : [],
    inStock: true,
    featured: true
  }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Enhanced Hero Section with Sliding Photos */}
      <div className="hero-slideshow relative overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-marketplace relative z-10 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="promo-title text-4xl md:text-5xl lg:text-6xl leading-tight">
                Cerka's Leading
                <span className="block text-blue-200">B2B Marketplace</span>
              </h1>
              <p className="promo-subtitle text-xl md:text-2xl max-w-2xl mx-auto">
                Connect with verified suppliers, access real-time pricing, and grow your business across 14+ sectors
              </p>
            </div>

            {/* Search Bar */}
            <div className="animate-fade-in max-w-3xl mx-auto mb-8" style={{ animationDelay: '0.2s' }}>
              <form onSubmit={handleSearch} className="relative">
                <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, materials, suppliers..."
                      className="w-full pl-16 pr-6 py-6 text-lg text-neutral-900 placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-6 bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              {/* Popular Searches */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="text-blue-200 text-sm">Popular:</span>
                {['Cement', 'Steel', 'Rice', 'Construction Materials', 'Electronics'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/buyers/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="animate-fade-in flex flex-wrap justify-center gap-8 text-blue-100" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Fast Response</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Local & Export</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Slide Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="nav-arrow absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="nav-arrow absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Current Slide Info with Product Details */}
        <div className="slide-info absolute bottom-16 md:bottom-20 left-3 md:left-6 right-3 md:right-auto z-20 text-white max-w-lg">
          <div className="animate-fade-in">
            <div className={`${heroSlides[currentSlide].color} px-4 py-2 rounded-full text-sm font-semibold mb-3 inline-block`}>
              {heroSlides[currentSlide].category}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{heroSlides[currentSlide].title}</h3>
            <p className="text-blue-200 text-base md:text-lg">{heroSlides[currentSlide].subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container-marketplace">
        {/* Quick Stats */}
        {user && (
          <div className="section-padding animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Your Dashboard</h2>
              <button 
                onClick={() => navigate('/suppliers/listings')}
                className="btn-secondary flex items-center gap-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-orange-600" />
                  <span className="text-2xl font-bold text-neutral-900">15</span>
                </div>
                <p className="text-sm text-neutral-600">Active Listings</p>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-neutral-900">9</span>
                </div>
                <p className="text-sm text-neutral-600">Quote Requests</p>
                <div className="text-xs text-green-600 mt-1">+12% this week</div>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-8 h-8 text-yellow-600" />
                  <span className="text-2xl font-bold text-neutral-900">234</span>
                </div>
                <p className="text-sm text-neutral-600">Profile Views</p>
                <div className="text-xs text-green-600 mt-1">+8% this week</div>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-neutral-600" />
                  <span className="text-2xl font-bold text-neutral-900">8</span>
                </div>
                <p className="text-sm text-neutral-600">Saved Items</p>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="section-padding">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Browse by Category</h2>
              <p className="text-neutral-600">Discover products across 14+ industry sectors</p>
            </div>
            <button
              onClick={() => navigate('/marketplace/categories')}
              className="btn-secondary hidden md:flex items-center gap-2"
            >
              View All Categories <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="category-grid">
            {marketplaceCategories.map((category, index) => (
              <div
                key={category.id}
                className="category-card animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/marketplace/${category.id}`)}
              >
                <div className={`category-icon ${category.color} text-white`}>
                  {category.icon}
                </div>
                <h3 className="category-name">
                  {category.name}
                </h3>
                <p className="category-count">{category.count} products</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="section-padding">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Featured Products</h2>
              <p className="text-neutral-600">Hand-picked quality products from verified suppliers</p>
            </div>
            <button
              onClick={() => navigate('/buyers/search?featured=true')}
              className="btn-secondary hidden md:flex items-center gap-2"
            >
              View All Featured <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  {...product}
                  onAddToCart={() => {
                    // Handle add to cart
                    console.log('Add to cart:', product.id);
                  }}
                  onToggleFavorite={() => {
                    // Handle toggle favorite
                    console.log('Toggle favorite:', product.id);
                  }}
                  onContactSupplier={() => {
                    // Handle contact supplier
                    const messageParams = new URLSearchParams({
                      userId: 'supplier-id', // This would come from product data
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
        </div>

        {/* Financial-Grade Price Intelligence Section */}
        <div className="section-padding">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700">
            {/* Financial Grid Background */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff88' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Animated Market Lines */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-pulse"></div>
              <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="max-w-7xl mx-auto">
                {/* Financial Header */}
                <div className="flex flex-col lg:flex-row items-start justify-between mb-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-mono font-semibold">LIVE</span>
                      </div>
                      <div className="text-slate-400 text-sm font-mono">
                        Last Updated: {new Date().toLocaleTimeString()} EAT
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-mono tracking-tight">
                      RWANDA
                      <span className="block text-green-400">PRICE INDEX</span>
                      <span className="block text-2xl md:text-3xl text-slate-400 font-normal">RPI-2024</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl">
                      Real-time commodity pricing intelligence for institutional investors and financial markets
                    </p>
                  </div>

                  {/* Market Status Panel */}
                  <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 min-w-[300px] mt-6 lg:mt-0">
                    <div className="text-slate-400 text-sm font-mono mb-4">MARKET STATUS</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Market Cap</span>
                        <span className="text-white font-mono font-bold">$2.4B RWF</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">24h Volume</span>
                        <span className="text-green-400 font-mono font-bold">+12.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Active Markets</span>
                        <span className="text-white font-mono font-bold">847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Volatility Index</span>
                        <span className="text-yellow-400 font-mono font-bold">23.4</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">SUPPLIERS</div>
                      <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">2,547</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <div className="text-green-400 text-sm font-mono">+8.2% MoM</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">COMMODITIES</div>
                      <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">847</div>
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-blue-400" />
                      <div className="text-blue-400 text-sm font-mono">+15 New</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">REGIONS</div>
                      <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">30</div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-purple-400" />
                      <div className="text-purple-400 text-sm font-mono">100% Coverage</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">UPTIME</div>
                      <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Server className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">99.9%</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <div className="text-green-400 text-sm font-mono">SLA Compliant</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Price Movement Ticker */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-12 overflow-hidden relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Pulse className="w-4 h-4 text-green-400 animate-pulse" />
                    <span className="text-slate-400 text-xs font-mono">LIVE MARKET DATA</span>
                  </div>
                  <div className="flex items-center gap-8 animate-marquee">
                    {priceIndex.length > 0 ? (
                      priceIndex.slice(0, 6).map((item) => (
                        <div key={item.name} className="flex items-center gap-3 whitespace-nowrap">
                          <div className={`w-2 h-2 bg-${item.color} rounded-full`}></div>
                          <span className="text-slate-400 font-mono text-sm">{item.name}</span>
                          <span className="text-white font-mono font-bold">
                            {item.currentPrice.toLocaleString()} RWF
                          </span>
                          <div className="flex items-center gap-1">
                            {item.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`font-mono text-sm ${
                              item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {item.trend === 'up' ? '+' : '-'}{item.trendPercent}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-mono text-xs">
                              {item.listingCount} listing{item.listingCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 whitespace-nowrap text-slate-400">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="font-mono text-sm">No active listings yet</span>
                        <span className="font-mono text-sm">- Be the first to list products</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Financial Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-xl p-6 hover:border-green-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Analytics className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-green-400">Real-Time Analytics</h3>
                    <p className="text-slate-300 text-sm mb-4">Live price feeds with millisecond precision for algorithmic trading</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-green-400 text-xs font-mono">API: 99.99% uptime</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">Predictive Models</h3>
                    <p className="text-slate-300 text-sm mb-4">AI-powered forecasting with 94% accuracy for risk management</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="text-blue-400 text-xs font-mono">ML: Neural Networks</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-xl p-6 hover:border-purple-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-purple-400">Institutional Grade</h3>
                    <p className="text-slate-300 text-sm mb-4">Bank-level security with SOC2 compliance and audit trails</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="text-purple-400 text-xs font-mono">SEC: Compliant</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 rounded-xl p-6 hover:border-yellow-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Workflow className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-yellow-400">Market Making</h3>
                    <p className="text-slate-300 text-sm mb-4">Liquidity provision and price discovery for commodity derivatives</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="text-yellow-400 text-xs font-mono">FIX: Protocol 4.4</div>
                    </div>
                  </div>
                </div>

                {/* Professional CTA */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-6">
                    <button
                      onClick={() => navigate('/materials/trends')}
                      className="group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 inline-flex items-center gap-3 border border-green-400/20"
                    >
                      <span className="font-mono">ACCESS TERMINAL</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-8 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-mono">Real-time API</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-mono">Historical Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="font-mono">Enterprise SLA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-padding">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              className="bg-white rounded-lg border border-neutral-200 p-6 text-center cursor-pointer hover-lift animate-fade-in"
              onClick={() => navigate('/buyers/search')}
            >
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Browse Products</h3>
              <p className="text-sm text-neutral-600">Explore our marketplace</p>
            </div>
            <div
              className="bg-white rounded-lg border border-neutral-200 p-6 text-center cursor-pointer hover-lift animate-fade-in"
              style={{ animationDelay: '50ms' }}
              onClick={handleListProducts}
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">
                {!user ? 'Start Selling' : user.role === 'supplier' ? 'List Products' : 'Become a Supplier'}
              </h3>
              <p className="text-sm text-neutral-600">
                {!user ? 'Join as a supplier' : user.role === 'supplier' ? 'Start selling today' : 'Switch to supplier account'}
              </p>
            </div>
            <div
              className="bg-white rounded-lg border border-neutral-200 p-6 text-center cursor-pointer hover-lift animate-fade-in"
              style={{ animationDelay: '100ms' }}
              onClick={() => navigate('/materials/trends')}
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Price Trends</h3>
              <p className="text-sm text-neutral-600">Market intelligence</p>
            </div>
            <div
              className="bg-white rounded-lg border border-neutral-200 p-6 text-center cursor-pointer hover-lift animate-fade-in"
              style={{ animationDelay: '150ms' }}
              onClick={() => navigate('/suppliers/listings')}
            >
              <div className="w-12 h-12 bg-neutral-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Analytics</h3>
              <p className="text-sm text-neutral-600">Business insights</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
