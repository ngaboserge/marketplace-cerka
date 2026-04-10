import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useCartStore, useAuthStore } from '@/store';
import { ShoppingCart, Plus, Minus, Trash2, Search, ArrowRight, MessageCircle } from '@/lib/icons';
import { formatCurrency } from '@/lib/currency';

export function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, loading, fetchCart, updateCartItem, removeFromCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const updateQuantity = async (itemId: string, newQuantity: number, minOrder: number) => {
    try {
      const quantity = Math.max(minOrder, newQuantity);
      await updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.listing?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    // Navigate to checkout or quote request
    navigate('/buyers/quotes');
  };

  return (
    <Layout>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-marketplace section-padding">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Shopping Cart</h1>
              <p className="text-neutral-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Link to="/buyers/search" className="btn-secondary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-neutral-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const listing = item.listing;
                  if (!listing) return null;

                  const minOrder = listing.min_quantity || 1;
                  const price = listing.price || 0;

                  return (
                    <div key={item.id} className="bg-white rounded-lg border border-neutral-200 p-6">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        {listing.photos && listing.photos.length > 0 ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.material?.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-neutral-400 text-xs">No image</span>
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            {listing.title || listing.material?.name}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {listing.supplier?.business_name || listing.supplier?.full_name || 'Supplier'}
                          </p>
                          {listing.location && (
                            <p className="text-sm text-neutral-500">{listing.location}</p>
                          )}
                          
                          {/* Price */}
                          <div className="mt-3">
                            <span className="text-lg font-bold text-neutral-900">
                              {formatCurrency(price)}
                            </span>
                            <span className="text-sm text-neutral-500 ml-1">
                              per {listing.material?.unit || 'unit'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, minOrder)}
                              disabled={item.quantity <= minOrder}
                              className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, minOrder)}
                              className="p-2 hover:bg-neutral-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-neutral-600">
                            Minimum order: {minOrder} {listing.material?.unit || 'units'}
                          </span>
                          <button
                            onClick={() => {
                              const messageParams = new URLSearchParams({
                                userId: listing.supplier_id,
                                context: 'cart',
                                productName: listing.title || listing.material?.name || 'Product',
                                productId: listing.id,
                                quantity: item.quantity.toString()
                              });
                              navigate('/messages?' + messageParams.toString());
                            }}
                            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Contact Supplier
                          </button>
                        </div>
                        <span className="font-semibold text-neutral-900">
                          Subtotal: {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-neutral-200 p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Items ({items.length})</span>
                      <span className="text-neutral-900">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Estimated delivery</span>
                      <span className="text-neutral-900">Contact suppliers</span>
                    </div>
                    <hr className="border-neutral-200" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-neutral-900">Total</span>
                      <span className="text-neutral-900">{formatCurrency(getTotalPrice())}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Request Quotes
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <p className="text-xs text-neutral-500 mt-3 text-center">
                    Prices may vary. Final quotes will be provided by suppliers.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Your cart is empty</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Add products to your cart to request quotes from suppliers
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