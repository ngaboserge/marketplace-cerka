import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { useStatsStore } from '../store/statsStore';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { priceIndexService, type PriceIndexItem, type MarketSummary } from '../services/priceIndex.service';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, QuickActionCard, StatCard, AnimatedCard } from '@/components/ui';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { 
  Building, Wheat, Meat, Smartphone, Car, Home as HomeIcon, Tool, Cow,
  ShoppingCart, Package, TrendingUp, TrendingDown, BarChart, Plus, Search,
  Star, Shield, Clock, ArrowRight, Eye, Heart, CheckCircle, MessageCircle,
  Users, Database, Globe, Server, Pulse, Analytics, Brain, Workflow
} from '@/lib/icons';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, fetchStats } = useStatsStore();
  const { listings, fetchAllListings } = useMarketplaceStore();
  const [priceIndex, setPriceIndex] = useState<PriceIndexItem[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);

  useEffect(() => {
    fetchStats();
    fetchAllListings();
    
    // Fetch real price index data
    const loadPriceIndex = async () => {
      try {
        const { priceIndex: realPriceIndex, marketSummary: realMarketSummary } = await priceIndexService.getRealPriceIndex();
        setPriceIndex(realPriceIndex);
        setMarketSummary(realMarketSummary);
      } catch (error) {
        console.error('Error loading price index:', error);
      }
    };
    
    loadPriceIndex();
  }, []);

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
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProductSlide, setCurrentProductSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop",
      title: "Construction Materials"
    },
    {
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&h=1080&fit=crop", 
      title: "Agriculture Products"
    },
    {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop",
      title: "Steel & Metal"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
      title: "Building Materials"
    },
    {
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop",
      title: "Roofing Solutions"
    }
  ];

  // Product slides from Landing page
  const productSlides = [
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&crop=center',
      category: 'Construction',
      title: 'Building Materials',
      description: 'Cement, Steel, Bricks & More',
      price: 'Starting from 5,000 RWF',
      color: 'bg-orange-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&crop=center',
      category: 'Vehicles',
      title: 'Cars & Motorcycles',
      description: 'New & Used Vehicles',
      price: 'From 2,500,000 RWF',
      color: 'bg-red-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&h=400&fit=crop&crop=center',
      category: 'Agriculture',
      title: 'Fresh Produce',
      description: 'Fruits, Vegetables & Seeds',
      price: 'From 2,000 RWF/kg',
      color: 'bg-green-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&crop=center',
      category: 'Electronics',
      title: 'Tech Products',
      description: 'Computers, Phones & Gadgets',
      price: 'From 50,000 RWF',
      color: 'bg-blue-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&crop=center',
      category: 'Textiles',
      title: 'Fabrics & Clothing',
      description: 'Quality Textiles & Materials',
      price: 'From 3,000 RWF/meter',
      color: 'bg-purple-500'
    },
    {
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&crop=center',
      category: 'Home & Garden',
      title: 'Furniture & Decor',
      description: 'Home Improvement Items',
      price: 'From 15,000 RWF',
      color: 'bg-indigo-500'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-advance product slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductSlide((prev) => (prev + 1) % productSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [productSlides.length]);

  // Update slide classes and add parallax effect
  useEffect(() => {
    const slideElements = document.querySelectorAll('.slide');
    const indicatorElements = document.querySelectorAll('.slide-indicator');
    
    slideElements.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    indicatorElements.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });

    // Add subtle parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.hero-slideshow');
      if (parallax) {
        (parallax as HTMLElement).style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSlide]);

  const marketplaceCategories = [
    { id: 'construction', name: 'Construction', icon: <Building className="w-6 h-6" />, count: '2,450', color: 'bg-blue-500' },
    { id: 'agriculture', name: 'Agriculture', icon: <Wheat className="w-6 h-6" />, count: '1,890', color: 'bg-green-500' },
    { id: 'food', name: 'Food & Beverage', icon: <Meat className="w-6 h-6" />, count: '3,120', color: 'bg-orange-500' },
    { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-6 h-6" />, count: '1,650', color: 'bg-purple-500' },
    { id: 'vehicles', name: 'Vehicles', icon: <Car className="w-6 h-6" />, count: '890', color: 'bg-red-500' },
    { id: 'rentals', name: 'Real Estate', icon: <HomeIcon className="w-6 h-6" />, count: '560', color: 'bg-indigo-500' },
    { id: 'services', name: 'Services', icon: <Tool className="w-6 h-6" />, count: '2,340', color: 'bg-yellow-500' },
    { id: 'livestock', name: 'Livestock', icon: <Cow className="w-6 h-6" />, count: '780', color: 'bg-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Enhanced Hero Section with Sliding Photos */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          <div className="hero-slideshow">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.8), rgba(239, 68, 68, 0.8)), url("${slide.image}")`
                }}
              />
            ))}
          </div>
        </div>

        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-fluid relative z-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 animate-fadeInDown">
                <span className="text-white font-semibold flex items-center gap-2">
                  🇷🇼 <span>Made for Rwanda's Economy by Cerka</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
                {user ? (
                  <>
                    Welcome back,
                    <span className="block text-orange-200">{user.name?.split(' ')[0]}!</span>
                  </>
                ) : (
                  <>
                    Cerka's Leading
                    <span className="block text-orange-200">B2B Marketplace</span>
                  </>
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {user 
                  ? 'Your gateway to Cerka\'s B2B marketplace and economic intelligence' 
                  : `Connect with verified suppliers, access real-time pricing, and grow your business across ${stats.totalCategories > 0 ? `${stats.totalCategories}+` : 'multiple'} sectors`
                }
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => navigate('/buyers/search')}
                  className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Search className="w-6 h-6" />
                  Browse Products
                </button>
                <button
                  onClick={handleListProducts}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3"
                >
                  <Plus className="w-6 h-6" />
                  {!user ? 'Start Selling' : user.role === 'supplier' ? 'List Products' : 'Become a Supplier'}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-orange-100 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">{stats.totalSuppliers > 0 ? `${stats.totalSuppliers}+` : '0'} Verified Suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Fast Response</span>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase + Stats Cards */}
            <div className="space-y-6 animate-fadeInRight">
              {/* Product Showcase Carousel */}
              <div className="relative mb-6 overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
                {/* TEMPORARY MARKER - REMOVE AFTER TESTING */}
                <div className="absolute top-0 left-0 bg-red-500 text-white p-2 z-50 text-xs">
                  🔴 NEW PRODUCT CAROUSEL LOADED
                </div>
                <div className="relative h-64">
                  {/* Sliding Product Images */}
                  <div 
                    className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" 
                    style={{ transform: `translateX(-${currentProductSlide * 100}%)` }}
                  >
                    {productSlides.map((slide, index) => (
                      <div key={index} className="w-full flex-shrink-0 relative">
                        <img 
                          src={slide.image}
                          alt={`${slide.category} - ${slide.title}`}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className={`${slide.color} px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block`}>
                            {slide.category}
                          </div>
                          <h3 className="text-lg font-bold mb-1">{slide.title}</h3>
                          <p className="text-sm opacity-90">{slide.description}</p>
                          <p className="text-xs mt-1 opacity-75">{slide.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {productSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentProductSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                          index === currentProductSlide ? 'bg-white opacity-100' : 'bg-white/50 opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Product Showcase Overlay */}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                    <h3 className="text-white text-sm font-bold mb-1">Product Showcase</h3>
                    <p className="text-white/90 text-xs">Discover marketplace products</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-2">15K+</div>
                  <div className="text-orange-200 text-sm">Active Listings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-2">2.5K+</div>
                  <div className="text-orange-200 text-sm">Suppliers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-2">{stats.totalCategories > 0 ? `${stats.totalCategories}+` : '0'}</div>
                  <div className="text-orange-200 text-sm">Sectors</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-orange-200 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div 
              onClick={() => navigate('/buyers/search')}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-400 transition-colors">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Browse Products</h3>
                  <p className="text-orange-200 text-sm">{stats.totalListings > 0 ? `${stats.totalListings}+` : '0'} listings available</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/materials/trends')}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Price Intelligence</h3>
                  <p className="text-orange-200 text-sm">Real-time market data</p>
                </div>
              </div>
            </div>

            <div 
              onClick={handleListProducts}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-400 transition-colors">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">
                    {!user ? 'Start Selling' : user.role === 'supplier' ? 'List Products' : 'Become a Supplier'}
                  </h3>
                  <p className="text-orange-200 text-sm">
                    {!user ? `Join ${stats.totalSuppliers > 0 ? `${stats.totalSuppliers}+` : '0'} suppliers` : user.role === 'supplier' ? 'Create new listing' : 'Switch to supplier account'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container-fluid py-12">
        {/* User Dashboard Stats */}
        {user && (
          <div className="mb-16 animate-fadeInUp">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Your Dashboard</h2>
              <Button variant="ghost" onClick={() => navigate('/suppliers/dashboard')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                label="Active Listings"
                value="15"
                icon={<Package className="w-5 h-5" />}
                color="primary"
                delay={0}
              />
              <StatCard
                label="Quote Requests"
                value="9"
                icon={<ShoppingCart className="w-5 h-5" />}
                trend={{ value: 12, isPositive: true }}
                color="success"
                delay={100}
              />
              <StatCard
                label="Profile Views"
                value="234"
                icon={<Eye className="w-5 h-5" />}
                trend={{ value: 8, isPositive: true }}
                color="warning"
                delay={200}
              />
              <StatCard
                label="Saved Items"
                value="8"
                icon={<Heart className="w-5 h-5" />}
                color="neutral"
                delay={300}
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickActionCard
              icon={<Search className="w-8 h-8" />}
              title="Browse Products"
              description="Explore our marketplace"
              onClick={() => navigate('/buyers/search')}
              color="primary"
              delay={0}
            />
            <QuickActionCard
              icon={<Plus className="w-8 h-8" />}
              title="List Products"
              description="Start selling today"
              onClick={handleListProducts}
              color="success"
              delay={50}
            />
            <QuickActionCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Price Trends"
              description="Market intelligence"
              onClick={() => navigate('/materials/trends')}
              color="warning"
              delay={100}
            />
            <QuickActionCard
              icon={<BarChart className="w-8 h-8" />}
              title="Analytics"
              description="Business insights"
              onClick={() => navigate(user ? '/suppliers/dashboard' : '/materials/trends')}
              color="neutral"
              delay={150}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Browse by Category</h2>
              <p className="text-neutral-600">Discover products across {stats.totalCategories > 0 ? `${stats.totalCategories}+` : '0'} industry sectors</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/marketplace/categories')}
              className="hidden md:flex"
            >
              View All Categories <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {marketplaceCategories.map((category, index) => (
              <div
                key={category.id}
                className="card card-interactive p-6 text-center group animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/marketplace/${category.id}`)}
              >
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1 text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-500">{category.count} products</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Featured Products</h2>
              <p className="text-neutral-600">Hand-picked quality products from verified suppliers</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/buyers/search?featured=true')}
              className="hidden md:flex"
            >
              View All Featured <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.slice(0, 4).map((listing, index) => {
                const productData = {
                  id: listing.id,
                  title: listing.title,
                  price: { 
                    min: listing.price, 
                    max: listing.price * 1.05, 
                    unit: listing.material?.unit || 'unit' 
                  },
                  image: listing.photos && listing.photos.length > 0 
                    ? listing.photos[0] 
                    : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
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
                  badges: listing.supplier?.is_verified_supplier ? ['Verified Supplier'] : [],
                  inStock: listing.availability_status === 'available',
                  featured: true
                };

                return (
                  <div
                    key={listing.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard
                      {...productData}
                      onAddToCart={() => {
                        console.log('Add to cart:', listing.id);
                      }}
                      onToggleFavorite={() => {
                        console.log('Toggle favorite:', listing.id);
                      }}
                      onContactSupplier={() => {
                        const messageParams = new URLSearchParams({
                          userId: listing.supplier_id,
                          supplierName: listing.supplier?.business_name || listing.supplier?.full_name || listing.supplier?.name || 'Supplier',
                          context: 'product',
                          productName: listing.title,
                          productId: listing.id
                        });
                        navigate('/messages?' + messageParams.toString());
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products available yet</h3>
              <p className="text-neutral-600 mb-6">Be the first to list products on our marketplace</p>
              <Button onClick={handleListProducts}>
                Start Selling <Plus className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Financial-Grade Price Intelligence Section */}
        <div className="mb-16">
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
                      Real-time commodity pricing intelligence for Rwanda's marketplace
                    </p>
                  </div>

                  {/* Market Status Panel */}
                  <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 min-w-[300px] mt-6 lg:mt-0">
                    <div className="text-slate-400 text-sm font-mono mb-4">MARKET STATUS</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Market Value</span>
                        <span className="text-white font-mono font-bold">{marketSummary?.marketCap || '0.1M RWF'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Growth Rate</span>
                        <span className="text-green-400 font-mono font-bold">{marketSummary?.volume24h || '+12.5%'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Active Products</span>
                        <span className="text-white font-mono font-bold">{marketSummary?.totalMaterials || 2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Total Listings</span>
                        <span className="text-yellow-400 font-mono font-bold">{marketSummary?.totalListings || 2}</span>
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
                    <div className="text-3xl font-bold font-mono mb-1">{stats.totalSuppliers > 0 ? stats.totalSuppliers : 1}</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <div className="text-green-400 text-sm font-mono">Active</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">COMMODITIES</div>
                      <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">{marketSummary?.totalMaterials || 2}</div>
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-blue-400" />
                      <div className="text-blue-400 text-sm font-mono">Available</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">DISTRICTS</div>
                      <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">30</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                      <div className="text-purple-400 text-sm font-mono">Nationwide</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-slate-400 text-sm font-mono">PLATFORM</div>
                      <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Server className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-mono mb-1">99.9%</div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-400" />
                      <div className="text-green-400 text-sm font-mono">Reliable</div>
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

                {/* Enhanced Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-xl p-6 hover:border-green-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Analytics className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-green-400">Real-Time Pricing</h3>
                    <p className="text-slate-300 text-sm mb-4">Live price updates from verified suppliers across Rwanda</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-green-400 text-xs font-mono">Updated Daily</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">Market Intelligence</h3>
                    <p className="text-slate-300 text-sm mb-4">Smart insights to help you make better buying decisions</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="text-blue-400 text-xs font-mono">AI-Powered</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-xl p-6 hover:border-purple-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-purple-400">Verified Suppliers</h3>
                    <p className="text-slate-300 text-sm mb-4">All suppliers are verified for quality and reliability</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="text-purple-400 text-xs font-mono">100% Verified</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 rounded-xl p-6 hover:border-yellow-600/50 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Workflow className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-yellow-400">Direct Trading</h3>
                    <p className="text-slate-300 text-sm mb-4">Connect directly with suppliers for the best deals</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="text-yellow-400 text-xs font-mono">No Middlemen</div>
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
                      <span className="font-mono">VIEW PRICE TRENDS</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-8 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-mono">Live Prices</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-mono">Market Trends</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="font-mono">Price History</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimatedCard hover="lift" animation="fadeInUp" delay={0} className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-neutral-900">{stats.totalCategories > 0 ? `${stats.totalCategories}+` : '0'} Industry Sectors</h3>
                <p className="text-neutral-600 mb-4">
                  From construction materials to electronics - everything Rwanda's businesses need in one marketplace.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{stats.totalProducts > 0 ? `${stats.totalProducts}+` : '0'} products available</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard hover="lift" animation="fadeInUp" delay={100} className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-neutral-900">Verified Suppliers</h3>
                <p className="text-neutral-600 mb-4">
                  Trade with confidence knowing all suppliers are verified and rated by the community.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{stats.totalSuppliers > 0 ? `${stats.totalSuppliers}+` : '0'} verified suppliers</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            hover="lift" 
            animation="fadeInUp" 
            delay={200} 
            className="p-8 cursor-pointer"
            onClick={() => navigate('/materials/trends')}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-neutral-900">Price Intelligence</h3>
                <p className="text-neutral-600 mb-4">
                  Real-time market data and trends to make informed purchasing and selling decisions.
                </p>
                <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700 p-0">
                  Explore Price Index <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Call to Action for Non-Users */}
        {!user && (
          <AnimatedCard
            animation="fadeInUp"
            className="bg-gradient-primary text-white text-center p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already trading on Cerka's leading B2B marketplace
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-accent-600 text-white hover:bg-accent-700 font-bold px-8 py-4 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/buyers/search')}
                className="bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 backdrop-blur-sm font-semibold px-8 py-4 text-lg"
              >
                Browse Marketplace
                <Eye className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </AnimatedCard>
        )}
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const messageParams = new URLSearchParams({
              userId: 'support',
              context: 'general-help',
              subject: 'Platform Help'
            });
            navigate('/messages?' + messageParams.toString());
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
          title="Need help getting started?"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Need Help?</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}