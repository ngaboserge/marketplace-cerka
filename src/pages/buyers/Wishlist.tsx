import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useWishlistStore, useCartStore, useAuthStore } from '@/store';
import { Heart, Trash2, Search, ShoppingCart } from '@/lib/icons';
import { formatCurrency } from '@/lib/currency';

export function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const handleRemoveFromWishlist = async (listingId: string) => {
    if (!user) return;
    try {
      await removeFromWishlist(listingId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (listingId: string) => {
    if (!user) return;
    try {
      // Add with default quantity of 1 (or minimum order quantity)
      const listing = items.find(item => item.listing_id === listingId)?.listing;
      const quantity = listing?.min_quantity || 1;
      const title = listing?.title || listing?.material?.name || 'Product';
      const price = listing?.price || 0;
      const image = listing?.photos?.[0] || '';
      const supplierName = listing?.supplier?.business_name || listing?.supplier?.full_name || 'Supplier';
      
      await addToCart({
        listing_id: listingId,
        title,
        price,
        image,
        supplier_name: supplierName,
        quantity
      });
      
      // Show success message
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-marketplace section-padding">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Wishlist</h1>
              <p className="text-neutral-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <Link to="/buyers/search" className="btn-secondary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Products
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const listing = item.listing;
                if (!listing) return null;

                return (
                  <div key={item.id} className="relative">
                    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Product Image */}
                      <div className="relative">
                        {listing.photos && listing.photos.length > 0 ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.material?.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                            <span className="text-neutral-400 text-sm">No image</span>
                          </div>
                        )}
                        
                        {/* Remove from wishlist button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(listing.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                          {listing.title || listing.material?.name}
                        </h3>
                        
                        <div className="text-lg font-bold text-neutral-900 mb-2">
                          {formatCurrency(listing.price)}
                          <span className="text-sm font-normal text-neutral-500 ml-1">
                            per {listing.material?.unit}
                          </span>
                        </div>

                        {listing.location && (
                          <p className="text-sm text-neutral-600 mb-3">{listing.location}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/marketplace/product/${listing.id}`)}
                            className="flex-1 btn-secondary text-sm py-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleAddToCart(listing.id)}
                            className="btn-primary text-sm py-2 px-3 flex items-center gap-1"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Your wishlist is empty</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Save products you're interested in to easily find them later
              </p>
              <Link to="/buyers/search" className="btn-primary">
                <Search className="w-4 h-4 mr-2" />
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}