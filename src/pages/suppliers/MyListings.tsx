import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliersStore, useAuthStore } from '../../store';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { formatCurrency } from '../../lib/currency';
import { 
  Plus, Edit, Trash2, Eye, TrendingUp, ArrowLeft, Package, MapPin, 
  Building, Star, Clock, MessageCircle, BarChart, Users, ShoppingCart, CheckCircle
} from '../../lib/icons';

export default function MyListings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { listings, loading, error, fetchSupplierListings, deleteListing, reactivateListing } = useSuppliersStore();
  
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSupplierListings(user.id);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id);
      setDeleteModal(null);
      // Refresh the listings to ensure UI is updated
      if (user) {
        await fetchSupplierListings(user.id);
      }
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await reactivateListing(id);
      // Refresh the listings to ensure UI is updated
      if (user) {
        await fetchSupplierListings(user.id);
      }
    } catch (error) {
      console.error('Failed to reactivate listing:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container-marketplace section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-64"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-neutral-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container-marketplace section-padding">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Listings</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => user && fetchSupplierListings(user.id)}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="container-marketplace section-padding">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/home')} 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                My Supplier Dashboard
              </h1>
              <p className="text-lg text-neutral-600">
                Manage your listings and grow your business
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => navigate('/suppliers/quotes')}
                className="btn-secondary px-5 py-3 font-semibold flex items-center gap-2 w-fit"
              >
                <MessageCircle className="w-5 h-5" />
                Quote Requests
              </button>
              <button 
                onClick={() => navigate('/suppliers/create')}
                className="btn-primary px-6 py-3 text-lg font-semibold flex items-center gap-2 w-fit"
              >
                <Plus className="w-5 h-5" />
                Create New Listing
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-neutral-900">{listings.length}</span>
            </div>
            <p className="text-sm text-neutral-600">Active Listings</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-neutral-900">
                {listings.reduce((total, listing) => total + (listing.view_count || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-neutral-600">Total Views</p>
            <div className="text-xs text-neutral-500 mt-1">All time</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-neutral-900">
                {listings.reduce((total, listing) => total + (listing.quote_request_count || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-neutral-600">Quote Requests</p>
            <div className="text-xs text-neutral-500 mt-1">All time</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-neutral-900">
                {listings.length > 0 ? '4.8' : '0.0'}
              </span>
            </div>
            <p className="text-sm text-neutral-600">Avg Rating</p>
            <div className="text-xs text-neutral-500 mt-1">
              {listings.length > 0 ? 'Based on reviews' : 'No reviews yet'}
            </div>
          </div>
        </div>

        {/* Listings Section */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Start Your Supplier Journey</h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto text-lg">
              Create your first listing to connect with buyers across Rwanda and grow your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/suppliers/create')}
                className="btn-primary px-8 py-3 text-lg font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Listing
              </button>
              <button 
                onClick={() => navigate('/materials/trends')}
                className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                View Market Trends
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Your Listings ({listings.length})</h2>
              <div className="flex items-center gap-3">
                <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by Date</option>
                  <option>Sort by Price</option>
                  <option>Sort by Views</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
              {listings.map((listing, index) => (
                <div 
                  key={listing.id} 
                  className={`rounded-lg border p-6 hover-lift animate-fade-in ${
                    listing.status === 'inactive' 
                      ? 'bg-neutral-50 border-neutral-300 opacity-75' 
                      : 'bg-white border-neutral-200'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {listing.photos && listing.photos.length > 0 ? (
                        <div className="relative">
                          <img
                            src={listing.photos[0]}
                            alt={listing.material?.name}
                            className="w-full lg:w-32 h-32 object-cover rounded-lg border border-neutral-200"
                          />
                          {listing.photos.length > 1 && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              +{listing.photos.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">
                              {listing.material?.name}
                            </h3>
                            {getStatusBadge(listing.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{listing.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Listed 2 days ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-neutral-900">
                            {formatCurrency(listing.price)}
                          </div>
                          <div className="text-sm text-neutral-500">per {listing.material?.unit}</div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-neutral-900">156</div>
                          <div className="text-xs text-neutral-600">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-neutral-900">12</div>
                          <div className="text-xs text-neutral-600">Inquiries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-neutral-900">
                            {listings.length > 0 ? '4.0' : '0.0'}
                          </div>
                          <div className="text-xs text-neutral-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">+8%</div>
                          <div className="text-xs text-neutral-600">This week</div>
                        </div>
                      </div>

                      {/* Description */}
                      {listing.description && (
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate(`/marketplace/product/${listing.id}`)}
                          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Public
                        </button>
                        <button
                          onClick={() => navigate(`/suppliers/edit/${listing.id}`)}
                          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/suppliers/analytics/${listing.id}`)}
                          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                        >
                          <BarChart className="w-4 h-4" />
                          Analytics
                        </button>
                        {listing.status === 'active' ? (
                          <button
                            onClick={() => setDeleteModal(listing.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(listing.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 hover:border-green-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Reactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Grow Your Business</h3>
              <p className="text-blue-100 text-lg">
                Access market insights, connect with more buyers, and optimize your listings
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/materials/trends')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Market Trends
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Messages
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Delete Listing</h3>
                  <p className="text-neutral-600">This will deactivate your listing</p>
                </div>
              </div>
              
              {/* Show listing details */}
              {(() => {
                const listing = listings.find(l => l.id === deleteModal);
                return listing ? (
                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      {listing.photos && listing.photos.length > 0 ? (
                        <img
                          src={listing.photos[0]}
                          alt={listing.material?.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-200 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{listing.material?.name}</p>
                        <p className="text-sm text-neutral-600">{listing.location}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
              
              <p className="text-neutral-600 mb-6">
                Your listing will be marked as inactive and hidden from buyers. You can reactivate it later by editing the listing.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteModal(null)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Deactivate Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
