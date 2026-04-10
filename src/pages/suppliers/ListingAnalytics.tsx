import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuthStore, useSuppliersStore } from '@/store';
import { 
  ArrowLeft, Eye, MessageCircle, TrendingUp, Calendar, 
  Users, ShoppingCart, Star, BarChart3, Activity
} from '@/lib/icons';

export function ListingAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedListing, analytics, loading, fetchListing, fetchListingAnalytics } = useSuppliersStore();

  useEffect(() => {
    if (id && user) {
      fetchListing(id);
      fetchListingAnalytics(id);
    }
  }, [id, user]);

  if (loading) {
    return (
      <Layout>
        <div className="container-marketplace section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!selectedListing) {
    return (
      <Layout>
        <div className="container-marketplace section-padding">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Listing not found</h2>
            <button 
              onClick={() => navigate('/suppliers/listings')}
              className="btn-primary"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Mock analytics data since we don't have real analytics yet
  const mockAnalytics = {
    views: 156,
    inquiries: 12,
    favorites: 8,
    conversion_rate: 7.7,
    avg_response_time: '2 hours',
    rating: 4.2,
    reviews: 5
  };

  return (
    <Layout>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-marketplace section-padding">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate('/suppliers/listings')} 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to My Listings</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Analytics: {selectedListing.title || selectedListing.material?.name}
                </h1>
                <p className="text-neutral-600">Performance insights for your listing</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/suppliers/edit/${selectedListing.id}`)}
                  className="btn-secondary"
                >
                  Edit Listing
                </button>
                <button 
                  onClick={() => navigate(`/marketplace/product/${selectedListing.id}`)}
                  className="btn-primary"
                >
                  View Public
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-neutral-900">{mockAnalytics.views}</span>
              </div>
              <p className="text-sm text-neutral-600">Total Views</p>
              <div className="text-xs text-green-600 mt-1">+12% this week</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-neutral-900">{mockAnalytics.inquiries}</span>
              </div>
              <p className="text-sm text-neutral-600">Inquiries</p>
              <div className="text-xs text-green-600 mt-1">+3 this week</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-orange-600" />
                <span className="text-2xl font-bold text-neutral-900">{mockAnalytics.favorites}</span>
              </div>
              <p className="text-sm text-neutral-600">Favorites</p>
              <div className="text-xs text-green-600 mt-1">+2 this week</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-neutral-900">{mockAnalytics.conversion_rate}%</span>
              </div>
              <p className="text-sm text-neutral-600">Conversion Rate</p>
              <div className="text-xs text-green-600 mt-1">+0.5% this week</div>
            </div>
          </div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Chart */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Views</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Inquiries</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Favorites</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Average Response Time</span>
                  <span className="text-sm font-medium text-neutral-900">{mockAnalytics.avg_response_time}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-900">{mockAnalytics.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Reviews</span>
                  <span className="text-sm font-medium text-neutral-900">{mockAnalytics.reviews}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-600">Listed</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {new Date(selectedListing.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Improve Visibility</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Add more photos and detailed descriptions to increase views by up to 40%.
                </p>
                <button 
                  onClick={() => navigate(`/suppliers/edit/${selectedListing.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit Listing →
                </button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Faster Responses</h4>
                <p className="text-sm text-green-700 mb-3">
                  Respond to inquiries within 1 hour to improve your conversion rate.
                </p>
                <button 
                  onClick={() => navigate('/messages')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Check Messages →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}