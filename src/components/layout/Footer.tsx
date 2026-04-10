import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store';
import { useStatsStore } from '../../store/statsStore';
import { useEffect } from 'react';
import { 
  Building, Wheat, Meat, Smartphone, Car, Home as HomeIcon, Tool, Cow,
  ShoppingCart, Package, TrendingUp, Search, Plus, BarChart, ArrowRight,
  Star, Shield, Clock, MapPin, Eye, Heart, CheckCircle, MessageCircle,
  Users, Database, Globe, Server, Phone, Mail, Grid
} from '@/lib/icons';

export function Footer() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { stats, fetchStats } = useStatsStore();
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  // Get user's platform preference
  const platformPreference = user?.platform_preference || 'both';
  const showMarketplace = platformPreference === 'marketplace' || platformPreference === 'both';
  const isAdmin = user?.role === 'admin';

  const marketplaceCategories = [
    { name: 'Construction', icon: <Building className="w-4 h-4" />, path: '/marketplace/construction' },
    { name: 'Agriculture', icon: <Wheat className="w-4 h-4" />, path: '/marketplace/agriculture' },
    { name: 'Electronics', icon: <Smartphone className="w-4 h-4" />, path: '/marketplace/electronics' },
    { name: 'Vehicles', icon: <Car className="w-4 h-4" />, path: '/marketplace/vehicles' },
  ];

  const quickStats = [
    { 
      label: 'Active Suppliers', 
      value: stats.totalSuppliers > 0 ? `${stats.totalSuppliers}+` : '0', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      label: 'Products Listed', 
      value: stats.totalProducts > 0 ? `${stats.totalProducts}+` : '0', 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      label: 'Categories', 
      value: stats.totalCategories > 0 ? `${stats.totalCategories}+` : '0', 
      icon: <Grid className="w-5 h-5" /> 
    },
    { 
      label: 'Active Listings', 
      value: stats.totalListings > 0 ? `${stats.totalListings}+` : '0', 
      icon: <Star className="w-5 h-5" /> 
    },
  ];
  
  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10">
        {/* Top Section - Newsletter & Quick Stats */}
        <div className="border-b border-neutral-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Newsletter Signup */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-100">Stay Updated with Market Intelligence</h3>
                <p className="text-neutral-400 mb-6">Get real-time price alerts, market trends, and exclusive supplier deals delivered to your inbox.</p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-orange-500/25">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600/20 group-hover:border-orange-500/30 transition-all duration-300">
                      <div className="text-orange-500">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-500 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/images/cerka-logo.jpeg" 
                  alt="Cerka" 
                  className="w-10 h-10 rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Cerka</h3>
                  <p className="text-sm text-neutral-500">B2B Trading Platform</p>
                </div>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Cerka is Rwanda's leading B2B marketplace connecting verified suppliers with businesses across 14+ industry sectors. 
                Trade with confidence using our real-time pricing intelligence and secure platform.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>+250 788 123 456</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>support@cerka.rw</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>

              {/* Social Links - Removed duplicate icons */}
              <div className="mt-6">
                <p className="text-sm text-neutral-500 mb-3">Follow us for updates:</p>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/cerka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500 transition-colors text-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://twitter.com/cerka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500 transition-colors text-sm"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://linkedin.com/company/cerka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-orange-500 transition-colors text-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Marketplace Categories */}
            <div>
              <h4 className="font-semibold text-neutral-100 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-orange-500" />
                Categories
              </h4>
              <ul className="space-y-3">
                {marketplaceCategories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      to={category.path} 
                      className="flex items-center gap-3 text-neutral-400 hover:text-orange-500 transition-colors group"
                    >
                      <div className="text-neutral-500 group-hover:text-orange-500 transition-colors">
                        {category.icon}
                      </div>
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/marketplace/categories" 
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-medium"
                  >
                    View All Categories
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Buyers */}
            <div>
              <h4 className="font-semibold text-neutral-100 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                For Buyers
              </h4>
              <ul className="space-y-3">
                <li><Link to="/buyers/search" className="text-neutral-400 hover:text-orange-500 transition-colors">Browse Products</Link></li>
                <li><Link to="/materials/trends" className="text-neutral-400 hover:text-orange-500 transition-colors">Price Intelligence</Link></li>
                <li><Link to="/buyers/wishlist" className="text-neutral-400 hover:text-orange-500 transition-colors">Wishlist</Link></li>
                <li><Link to="/buyers/cart" className="text-neutral-400 hover:text-orange-500 transition-colors">Shopping Cart</Link></li>
                <li><Link to="/messages" className="text-neutral-400 hover:text-orange-500 transition-colors">Messages</Link></li>
                <li><Link to="/help" className="text-neutral-400 hover:text-orange-500 transition-colors">Buyer Guide</Link></li>
              </ul>
            </div>

            {/* For Suppliers */}
            <div>
              <h4 className="font-semibold text-neutral-100 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                For Suppliers
              </h4>
              <ul className="space-y-3">
                <li><Link to="/suppliers/create" className="text-neutral-400 hover:text-orange-500 transition-colors">List Products</Link></li>
                <li><Link to="/suppliers/listings" className="text-neutral-400 hover:text-orange-500 transition-colors">My Listings</Link></li>
                <li><Link to="/materials/submit" className="text-neutral-400 hover:text-orange-500 transition-colors">Submit Prices</Link></li>
                <li><Link to="/suppliers/verification" className="text-neutral-400 hover:text-orange-500 transition-colors">Get Verified</Link></li>
                <li><Link to="/suppliers/analytics" className="text-neutral-400 hover:text-orange-500 transition-colors">Analytics</Link></li>
                <li><Link to="/help" className="text-neutral-400 hover:text-orange-500 transition-colors">Seller Guide</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-neutral-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                  <Shield className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">Verified Suppliers</div>
                <div className="text-xs text-neutral-500">100% Background Checked</div>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">Fast Response</div>
                <div className="text-xs text-neutral-500">Average 2 Hours</div>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-amber-600/10 border border-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-600/20 group-hover:border-amber-500/30 transition-all duration-300">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">Quality Guaranteed</div>
                <div className="text-xs text-neutral-500">Quality Guaranteed</div>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all duration-300">
                  <Globe className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">Nationwide Coverage</div>
                <div className="text-xs text-neutral-500">All 30 Districts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/50 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p className="text-sm text-neutral-500">© 2026 Cerka. All rights reserved.</p>
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <Link to="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
                  <span>•</span>
                  <Link to="/cookies" className="hover:text-neutral-400 transition-colors">Cookie Policy</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>System Status: Operational</span>
                </div>
                <span className="text-xs text-neutral-600 font-mono">v2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
