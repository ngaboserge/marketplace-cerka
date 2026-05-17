import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { supabase } from '@/lib/supabase';
import { useAuthStore, useWishlistStore, useCartStore } from '@/store';
import type { SupplierListing } from '@/types/materials.types';
import { QuoteRequestModal } from '@/components/marketplace/QuoteRequestModal';
import { 
  Heart, ShoppingCart, Star, Shield, Clock, MapPin, 
  ArrowLeft, Share2, MessageCircle, Plus, Minus, Package,
  Truck, CheckCircle
} from '@/lib/icons';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Check if item is in wishlist
  const isWishlisted = id ? isInWishlist(id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data: listing, error } = await supabase
          .from('supplier_listings')
          .select(`
            *,
            material:materials(*)
          `)
          .eq('id', id)
          .single() as { data: SupplierListing | null; error: any };

        if (error) throw error;

        if (listing) {
          // Fetch supplier data separately
          let supplierData: any = null;
          if (listing.supplier_id) {
            try {
              const { data: supplier, error: supplierError } = await supabase
                .from('profiles')
                .select('id, full_name, business_name, location, is_verified_supplier, average_rating, total_reviews')
                .eq('id', listing.supplier_id)
                .maybeSingle();
              
              if (supplier && !supplierError) {
                supplierData = supplier;
              } else {
                // Fallback for known supplier
                if (listing.supplier_id === 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1') {
                  supplierData = {
                    id: listing.supplier_id,
                    business_name: 'Sugira Aime',
                    full_name: null,
                    is_verified_supplier: false,
                    location: 'Kigali, Rwanda'
                  };
                }
              }
            } catch (error) {
              console.error('Failed to fetch supplier data:', error);
            }
          }

          // Convert database listing to product format
          const productData = {
            id: listing.id,
            title: listing.title,
            description: listing.description || `High-quality ${listing.material?.name} from verified supplier. Perfect for your business needs.`,
            price: { 
              min: listing.price, 
              max: listing.price * 1.05, // Small price range for negotiation
              unit: listing.material?.unit || 'unit' 
            },
            images: listing.photos && listing.photos.length > 0 
              ? listing.photos 
              : ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop'],
            supplier: {
              id: supplierData?.id || listing.supplier_id,
              name: (supplierData?.business_name || supplierData?.full_name || supplierData?.name || listing.title || 'Supplier').trim(),
              verified: supplierData?.is_verified_supplier || false,
              rating: supplierData?.average_rating || 4.2,
              reviewCount: supplierData?.total_reviews || listing.quote_request_count || 5,
              responseTime: '< 2 hours',
              location: supplierData?.location || listing.location || 'Kigali, Rwanda',
              yearsInBusiness: 3,
              totalProducts: 15,
              completedOrders: 50
            },
            minOrder: { 
              quantity: listing.min_quantity || 1, 
              unit: listing.material?.unit || 'units' 
            },
            category: listing.material?.category || 'General',
            badges: supplierData?.is_verified_supplier ? ['Verified Supplier', 'Quality Guaranteed'] : ['Quality Guaranteed'],
            inStock: listing.availability_status === 'available',
            stockQuantity: listing.stock_quantity || 100,
            specifications: {
              'Material': listing.material?.name || 'N/A',
              'Category': listing.material?.category || 'N/A',
              'Unit': listing.material?.unit || 'N/A',
              'Sector': listing.material?.sector || 'N/A',
              'Status': listing.status,
              'Listed': new Date(listing.created_at).toLocaleDateString()
            },
            features: [
              'High quality materials',
              'Competitive pricing',
              'Fast delivery',
              'Reliable supplier',
              'Quality guaranteed'
            ]
          };
          
          setProduct(productData);
          setQuantity(productData.minOrder.quantity);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!product || !id) return;

    try {
      await addToCart({
        listing_id: id,
        title: product.title,
        price: product.price.min,
        image: product.images[0],
        supplier_name: product.supplier.name,
        quantity
      });
      
      // Show success message or redirect to cart
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!product || !id) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist({
          listing_id: id,
          title: product.title,
          price: product.price.min,
          image: product.images[0],
          supplier_name: product.supplier.name
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const handleContactSupplier = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!product?.supplier?.id) return;
    
    // Check if user is trying to contact themselves
    if (user?.id === product.supplier.id) {
      alert('You cannot message yourself. This is your own listing.');
      return;
    }
    
    // Use the best available name for the supplier
    const supplierName = product.supplier.name !== 'Business Supplier' && product.supplier.name !== 'Supplier' 
      ? product.supplier.name 
      : `${product.title} Supplier`; // Use product title as fallback
    
    const messageParams = new URLSearchParams({
      userId: product.supplier.id,
      supplierName: supplierName,
      context: 'product',
      productName: product.title,
      productId: id || ''
    });
    
    navigate('/messages?' + messageParams.toString());
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-marketplace section-padding">
          <div className="skeleton h-96 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton h-64"></div>
            <div className="space-y-4">
              <div className="skeleton h-8"></div>
              <div className="skeleton h-6"></div>
              <div className="skeleton h-20"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-marketplace section-padding text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product not found</h1>
          <button onClick={() => navigate('/buyers/search')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-marketplace section-padding">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-orange-600">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-neutral-900">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImageIndex === index ? 'border-orange-500' : 'border-neutral-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                {/* Title and Price */}
                <h1 className="text-3xl font-bold text-neutral-900 mb-4">{product.title}</h1>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-orange-600">
                    RWF {product.price.min.toLocaleString()}
                  </span>
                  {product.price.max && product.price.max !== product.price.min && (
                    <>
                      <span className="text-neutral-500">-</span>
                      <span className="text-3xl font-bold text-orange-600">
                        RWF {product.price.max.toLocaleString()}
                      </span>
                    </>
                  )}
                  <span className="text-lg text-neutral-500">/ {product.price.unit}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.badges.map((badge: string, index: number) => (
                    <span key={index} className="badge badge-primary">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-neutral-700 mb-6">{product.description}</p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity (Min. {product.minOrder.quantity} {product.minOrder.unit})
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(product.minOrder.quantity, quantity - 10))}
                        className="p-3 hover:bg-neutral-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-3 min-w-[80px] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 10)}
                        className="p-3 hover:bg-neutral-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-neutral-600">{product.price.unit}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    Total: RWF {(product.price.min * quantity).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-lg border transition-colors ${
                      isWishlisted 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Contact Supplier */}
                <button
                  onClick={handleContactSupplier}
                  className="btn-secondary w-full flex items-center justify-center gap-2 mb-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Supplier
                </button>

                {/* Request Quote */}
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
                >
                  <Package className="w-5 h-5" />
                  Request a Quote
                </button>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                  <CheckCircle className="w-4 h-4" />
                  <span>In Stock ({product.stockQuantity.toLocaleString()} {product.price.unit} available)</span>
                </div>

                {/* Delivery Info */}
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Truck className="w-4 h-4" />
                    <span>Delivery available in Kigali area</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span>Response time: {product.supplier.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-lg border border-neutral-200 mb-12">
            <div className="border-b border-neutral-200">
              <div className="flex">
                <button className="px-6 py-4 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                  Specifications
                </button>
                <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
                  Features
                </button>
                <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
                  Reviews
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="font-medium text-neutral-700">{key}:</span>
                    <span className="text-neutral-900">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">About the Supplier</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => navigate(`/suppliers/profile/${product.supplier.id}`)}
                    className="text-lg font-semibold text-neutral-900 hover:text-orange-600 transition-colors text-left"
                  >
                    {product.supplier.name}
                  </button>
                  {product.supplier.verified && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{product.supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.supplier.yearsInBusiness} years in business</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{product.supplier.rating}</span>
                    <span className="text-neutral-500">({product.supplier.reviewCount} reviews)</span>
                  </div>
                  <div>
                    <span className="font-medium">{product.supplier.totalProducts}</span>
                    <span className="text-neutral-500"> products</span>
                  </div>
                  <div>
                    <span className="font-medium">{product.supplier.completedOrders}</span>
                    <span className="text-neutral-500"> orders completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              const messageParams = new URLSearchParams({
                userId: product?.supplier?.id || 'support',
                supplierName: product?.supplier?.name || 'Support',
                context: 'product-help',
                productName: product.title,
                productId: id || ''
              });
              navigate('/messages?' + messageParams.toString());
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
            title="Need help with this product?"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-medium">Need Help?</span>
          </button>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && product && (
        <QuoteRequestModal
          listing={{
            id: id!,
            title: product.title,
            price: product.price.min,
            supplier_id: product.supplier.id,
            supplier_name: product.supplier.name,
            min_quantity: product.minOrder.quantity,
            unit: product.price.unit,
            location: product.supplier.location,
            image: product.images?.[0],
          }}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </Layout>
  );
}