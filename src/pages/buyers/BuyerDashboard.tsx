import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, useMaterialsStore } from '../../store';
import { formatCurrency } from '../../lib/currency';
import { Search, TrendingUp, Package, MessageCircle, MapPin, ShoppingCart, BarChart3, Users, ArrowRight, Star, CheckCircle } from '../../lib/icons';
import { priceSubmissionsService } from '../../services/priceSubmissions.service';

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { materials, fetchMaterials } = useMaterialsStore();
  const [popularMaterials, setPopularMaterials] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchMaterials();
    loadRecentSubmissions();
  }, []);

  useEffect(() => {
    if (materials.length > 0) {
      setPopularMaterials(materials.slice(0, 6));
    }
  }, [materials]);

  const loadRecentSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const submissions = await priceSubmissionsService.getSubmissions({
        status: 'approved',
        limit: 20
      });
      setRecentSubmissions(submissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-marketplace section-padding">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Welcome back, {user?.email?.split('@')[0] || 'Buyer'}</h1>
              <p className="text-neutral-600">Discover quality products from verified suppliers</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="cursor-pointer group" onClick={() => navigate('/buyers/search')}>
            <div className="bg-white rounded-lg border border-neutral-200 p-6 h-full hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-2">Find Suppliers</h3>
                  <p className="text-sm text-neutral-600 mb-3">Browse thousands of products from verified suppliers across Rwanda</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Start browsing</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cursor-pointer group" onClick={() => navigate('/materials/trends')}>
            <div className="bg-white rounded-lg border border-neutral-200 p-6 h-full hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-2">Market Intelligence</h3>
                  <p className="text-sm text-neutral-600 mb-3">Get real-time price insights and market trends for informed decisions</p>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <span>View trends</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cursor-pointer group" onClick={() => navigate('/materials/submit')}>
            <div className="bg-white rounded-lg border border-neutral-200 p-6 h-full hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                  <Package className="w-7 h-7 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-2">Submit Prices</h3>
                  <p className="text-sm text-neutral-600 mb-3">Share market prices and help build Rwanda's price intelligence</p>
                  <div className="flex items-center text-orange-600 text-sm font-medium">
                    <span>Contribute data</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Marketplace Activity */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Latest from Suppliers</h2>
              <p className="text-neutral-600">Fresh listings from verified suppliers</p>
            </div>
            <button onClick={() => navigate('/buyers/search')} className="btn-secondary flex items-center gap-2">
              <span>View all listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingSubmissions ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton h-80"></div>
              ))}
            </div>
          ) : recentSubmissions.length > 0 ? (
            <div className="product-grid">
              {recentSubmissions.slice(0, 6).map((submission: any) => (
                <div
                  key={submission.id}
                  className="cursor-pointer group"
                  onClick={() => navigate('/materials/' + submission.material_id)}
                >
                  <div className="product-card h-full">
                    <div className="p-6">
                      {/* Supplier Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="badge badge-success text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </span>
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>4.8</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {submission.materials?.name || 'Unknown Product'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <MapPin className="w-4 h-4" />
                          <span>{submission.location}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-neutral-900">
                          {formatCurrency(submission.price)}
                        </p>
                        <p className="text-sm text-neutral-500">
                          per {submission.materials?.unit || 'unit'}
                        </p>
                      </div>

                      {/* Quantity */}
                      {submission.quantity && (
                        <p className="text-sm text-neutral-600 mb-4">
                          Available: {submission.quantity} {submission.materials?.unit}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              console.log('Please log in to contact suppliers');
                              return;
                            }
                            const messageParams = new URLSearchParams({
                              userId: submission.user_id,
                              context: 'materials',
                              materialName: submission.materials?.name || '',
                              price: formatCurrency(submission.price),
                              location: submission.location
                            });
                            navigate('/messages?' + messageParams.toString());
                          }}
                          className="btn-primary text-sm px-3 py-1.5"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">No listings yet</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Be the first to contribute to Rwanda's marketplace by submitting price data
              </p>
              <button onClick={() => navigate('/materials/submit')} className="btn-primary">
                Submit Price Data
              </button>
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Popular Categories</h2>
              <p className="text-neutral-600">Explore trending product categories</p>
            </div>
            <button onClick={() => navigate('/materials/trends')} className="btn-secondary flex items-center gap-2">
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="category-grid">
            {popularMaterials.map((material) => (
              <div key={material.id} className="cursor-pointer group" onClick={() => navigate('/materials/' + material.id)}>
                <div className="category-card h-full">
                  <div className="category-icon bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="category-name">
                    {material.name}
                  </h3>
                  <p className="category-count">{material.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Growth Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Trusted Network</h3>
                <p className="text-neutral-700 mb-4">
                  Connect with over 500 verified suppliers across Rwanda. Every supplier is vetted for quality and reliability.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-neutral-700">500+ Suppliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-neutral-700">Verified Network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Market Intelligence</h3>
                <p className="text-neutral-700 mb-4">
                  Make informed decisions with real-time price data and market trends from actual transactions.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-neutral-700">Real-time Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-neutral-700">Price Trends</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
