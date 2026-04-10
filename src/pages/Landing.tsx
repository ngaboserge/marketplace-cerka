import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { 
  Building, Wheat, Smartphone, Car, Home as HomeIcon, Tool, 
  Users, Search, TrendingUp, Shield, Star, Clock, ArrowRight,
  Package, ShoppingCart, Eye, CheckCircle, MessageCircle,
  BarChart3, Globe, Target, Briefcase, ChevronRight,
  MapPin, ExternalLink, Activity, Lightning
} from '@/lib/icons';

export function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productSlides.length);
    }, 3500); // Change slide every 3.5 seconds for 6 slides

    return () => clearInterval(interval);
  }, [productSlides.length]);
  
  return (
    <Layout>
      {/* Hero Section - Completely Redesigned */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden flex items-center">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          {/* Hero Background Image - African Business Scene */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1920&h=1080&fit=crop&crop=center')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h50v50H0V0zm50 50h50v50H50V50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Elements */}
          <div className="absolute top-32 right-32 w-4 h-4 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/3 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        <div className="container-fluid relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-8 animate-fadeInDown">
                <span className="text-white font-semibold">🇷🇼 Cerka - Rwanda's Premier B2B Platform</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fadeInUp">
                <span className="text-white">
                  Transform Your
                </span>
                <br />
                <span className="text-orange-400">
                  Business Today
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                Connect with verified suppliers, access real-time market intelligence, and scale your business across Rwanda's growing B2B marketplace powered by Cerka.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => navigate('/register')}
                  className="group relative bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="relative flex items-center justify-center gap-3">
                    <Package className="w-6 h-6" />
                    Start Trading Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/buyers/search')}
                  className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
                >
                  <Lightning className="w-5 h-5" />
                  Explore Marketplace
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-blue-200">Fully Verified</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-blue-200">Quality Assured</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-blue-200">Real-time Data</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Product Showcase Carousel */}
            <div className="relative animate-fadeInRight">
              {/* Product Showcase Carousel - Connect & Trade */}
              <div className="relative mb-6 overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
                <div className="relative h-80">
                  {/* Sliding Product Images */}
                  <div 
                    className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {productSlides.map((slide, index) => (
                      <div key={index} className="w-full flex-shrink-0 relative">
                        <img 
                          src={slide.image}
                          alt={`${slide.category} - ${slide.title}`}
                          className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <div className={`${slide.color} px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block`}>
                            {slide.category}
                          </div>
                          <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                          <p className="text-sm opacity-90">{slide.description}</p>
                          <p className="text-xs mt-1 opacity-75">{slide.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {productSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-opacity ${
                          index === currentSlide ? 'bg-white opacity-100' : 'bg-white/50 opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Connect & Trade Overlay */}
                  <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                    <h3 className="text-white text-lg font-bold mb-1">Connect & Trade</h3>
                    <p className="text-white/90 text-sm">Discover thousands of products</p>
                  </div>
                </div>
              </div>
              
              {/* Secondary Images Grid - Black Business Owners */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <img 
                    src="/images/aa.JPG"
                    alt="African woman supplier in her business"
                    className="w-full h-32 object-cover rounded-2xl shadow-lg border-2 border-white/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                    Suppliers
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="/images/bb.webp"
                    alt="African businessman buyer in marketplace"
                    className="w-full h-32 object-cover rounded-2xl shadow-lg border-2 border-white/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                    Buyers
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">RWF</div>
                  <div className="text-xs text-blue-200">Rwandan Francs</div>
                  <div className="text-xs text-emerald-400 mt-1">💰 Local Currency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Value Propositions */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-24">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4" />
              Choose Your Path
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Built for Every Business Need</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Whether you're buying or selling, Cerka provides the tools and network you need to succeed in Rwanda's dynamic marketplace.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Enhanced Buyers Card */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-blue-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">For Buyers</h3>
                    <p className="text-slate-600 text-lg">Source quality products with confidence</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Wide range of verified products</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Real-time price comparison</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Direct supplier contact</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Market intelligence</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/buyers/search')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-3 group"
                >
                  Start Buying
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Enhanced Suppliers Card */}
            <div className="group relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">For Suppliers</h3>
                    <p className="text-emerald-100 text-lg">Expand your reach and grow sales</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-emerald-100">Free product listings</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-emerald-100">Verified supplier badge</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-emerald-100">Order management</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-emerald-100">Analytics dashboard</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-white text-emerald-700 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 group shadow-lg"
                >
                  Start Selling
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="bg-white py-24">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Globe className="w-4 h-4" />
              Explore Categories
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Multiple Industry Sectors</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">From construction materials to cutting-edge electronics, discover everything your business needs in Cerka's B2B marketplace.</p>
          </div>
          
          {/* Category Images Showcase */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative group cursor-pointer" onClick={() => navigate('/marketplace/construction')}>
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center"
                alt="Construction materials and building supplies in Africa"
                className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-1">Construction Materials</h3>
                <p className="text-sm opacity-90">Cement, steel, bricks & building supplies</p>
                <div className="text-xs mt-2 bg-orange-500 px-2 py-1 rounded-full inline-block">
                  Starting from 5,000 RWF
                </div>
              </div>
            </div>
            
            <div className="relative group cursor-pointer" onClick={() => navigate('/marketplace/agriculture')}>
              <img 
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=300&fit=crop&crop=center"
                alt="Fresh agricultural products and farming in Rwanda"
                className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-1">Agriculture & Food</h3>
                <p className="text-sm opacity-90">Fresh produce, seeds & farming equipment</p>
                <div className="text-xs mt-2 bg-green-500 px-2 py-1 rounded-full inline-block">
                  From 2,000 RWF/kg
                </div>
              </div>
            </div>
            
            <div className="relative group cursor-pointer" onClick={() => navigate('/marketplace/electronics')}>
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center"
                alt="Electronics and technology products marketplace"
                className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-1">Electronics & Tech</h3>
                <p className="text-sm opacity-90">Computers, phones & tech equipment</p>
                <div className="text-xs mt-2 bg-blue-500 px-2 py-1 rounded-full inline-block">
                  From 50,000 RWF
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-16">
            {[
              { icon: <Building className="w-8 h-8" />, name: 'Construction', route: '/marketplace/construction' },
              { icon: <Wheat className="w-8 h-8" />, name: 'Agriculture', route: '/marketplace/agriculture' },
              { icon: <Package className="w-8 h-8" />, name: 'Food & Beverage', route: '/marketplace/food' },
              { icon: <Smartphone className="w-8 h-8" />, name: 'Electronics', route: '/marketplace/electronics' },
              { icon: <Car className="w-8 h-8" />, name: 'Vehicles', route: '/marketplace/vehicles' },
              { icon: <HomeIcon className="w-8 h-8" />, name: 'Real Estate', route: '/marketplace/rentals' },
              { icon: <Tool className="w-8 h-8" />, name: 'Services', route: '/marketplace/services' }
            ].map((cat, index) => (
              <div
                key={cat.name}
                onClick={() => navigate(cat.route)}
                className={`group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-orange-300 hover:-translate-y-2 animate-fadeInUp`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className={`font-bold text-center text-slate-700 group-hover:text-orange-600 transition-colors`}>{cat.name}</h3>
                <div className="text-center mt-2">
                  <span className="text-xs text-slate-500 group-hover:text-slate-600">Explore</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/marketplace/categories')}
              className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-slate-900 hover:to-black transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto group"
            >
              View All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Price Intelligence Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-fluid relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <BarChart3 className="w-4 h-4" />
                Market Intelligence
              </div>
              
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Rwanda Economic
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Price Index
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Make data-driven decisions with real-time market intelligence. Access verified pricing data from suppliers across Rwanda and optimize your procurement strategy.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-semibold">Live Data</span>
                  </div>
                  <p className="text-blue-200 text-sm">Real-time price updates from verified suppliers</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">Trends</span>
                  </div>
                  <p className="text-blue-200 text-sm">Historical analysis and market forecasting</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Regional</span>
                  </div>
                  <p className="text-blue-200 text-sm">District-level price comparison and analysis</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-semibold">Business</span>
                  </div>
                  <p className="text-blue-200 text-sm">Sector-specific insights and recommendations</p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/materials/trends')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-3 group"
              >
                Explore Price Index
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Simple Dashboard Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-xl">Market Intelligence</h3>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-mono">LIVE</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-white font-medium">Construction Materials</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">Live Pricing</div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <TrendingUp className="w-3 h-3" />
                        <span>Updated</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-white font-medium">Agricultural Products</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">Market Trends</div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <TrendingUp className="w-3 h-3" />
                        <span>Available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Electronics & Tech</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">Price Analysis</div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <Star className="w-3 h-3" />
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">Live RWF Pricing</div>
                    <div className="text-blue-200 text-sm">Real-time market intelligence in Rwandan Francs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics & Social Proof */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-24">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Built for Rwanda's Businesses</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Experience the benefits of trading on Rwanda's B2B marketplace platform.</p>
          </div>
          
          {/* Success Stories with Images */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="flex items-start gap-6">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face"
                  alt="African businesswoman entrepreneur"
                  className="w-16 h-16 rounded-full object-cover border-4 border-orange-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">
                    "This marketplace transformed our construction business. We now source materials at 30% better prices and connect with verified suppliers across Rwanda. The RWF pricing transparency is incredible!"
                  </p>
                  <div>
                    <div className="font-semibold text-slate-900">Sarah Uwimana</div>
                    <div className="text-sm text-slate-600">Construction Company Owner, Kigali</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="flex items-start gap-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                  alt="African businessman supplier"
                  className="w-16 h-16 rounded-full object-cover border-4 border-orange-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">
                    "As an agricultural supplier, this marketplace helped us reach customers nationwide. Our sales increased by 150% in just 6 months. The verification system builds real trust with buyers."
                  </p>
                  <div>
                    <div className="font-semibold text-slate-900">Jean Baptiste Nzeyimana</div>
                    <div className="text-sm text-slate-600">Agricultural Supplier, Musanze</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Verified Network</h3>
              <p className="text-slate-600 text-sm">All suppliers undergo rigorous background verification for your safety</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Fast Response</h3>
              <p className="text-slate-600 text-sm">Quick connections with suppliers and rapid quote responses</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">RWF Pricing</h3>
              <p className="text-slate-600 text-sm">Transparent pricing in Rwandan Francs with real-time market data</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="bg-white py-24">
        <div className="container-fluid">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Package className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Get started in minutes with our streamlined process designed for Rwanda's business community.</p>
          </div>
          
          {/* Process Images */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop&crop=center"
                alt="African professional searching marketplace on laptop"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold">Search & Discover</h4>
                <p className="text-xs opacity-90">Browse products & suppliers</p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/cc.webp"
                alt="African business professionals in meeting discussing deals"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold">Connect & Compare</h4>
                <p className="text-xs opacity-90">Contact suppliers directly</p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/dd.webp"
                alt="African businesswoman celebrating successful transaction"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-bold">Trade & Grow</h4>
                <p className="text-xs opacity-90">Complete transactions</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Search & Discover</h3>
              <p className="text-slate-600 leading-relaxed">Browse our comprehensive catalog of products across multiple industry sectors. Use advanced filters to find exactly what you need with prices in Rwandan Francs.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Connect & Compare</h3>
              <p className="text-slate-600 leading-relaxed">Contact verified suppliers directly, compare prices in RWF in real-time, and request detailed quotes. Build relationships with trusted partners across Rwanda.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Trade & Grow</h3>
              <p className="text-slate-600 leading-relaxed">Complete secure transactions in Rwandan Francs, track orders, and build lasting business relationships. Scale your operations with confidence across Rwanda's markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-fluid text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-6 py-3 rounded-full text-sm font-semibold mb-8">
              <Activity className="w-4 h-4" />
              Join Rwanda's Business Revolution
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-white">
                Ready to Transform
              </span>
              <br />
              <span className="text-orange-400">
                Your Business?
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join successful businesses already trading on Rwanda's trusted B2B marketplace. Start your journey today and unlock new opportunities for growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="group relative bg-orange-600 text-white px-12 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="relative flex items-center justify-center gap-3">
                  <Package className="w-6 h-6" />
                  Get Started Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={() => navigate('/buyers/search')}
                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 px-12 py-5 rounded-xl font-semibold text-xl transition-all flex items-center justify-center gap-3"
              >
                <Eye className="w-6 h-6" />
                Explore Marketplace
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span>Support available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const messageParams = new URLSearchParams({
              userId: 'support',
              context: 'landing-help',
              subject: 'Getting Started Help'
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
    </Layout>
  );
}