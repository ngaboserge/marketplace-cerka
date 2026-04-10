import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore, useAuthStore } from '@/store';
import { Heart, ShoppingCart, Eye, Star, Shield, Clock, MapPin, MessageCircle } from '@/lib/icons';

interface ProductCardProps {
  id: string;
  title: string;
  price: {
    min: number;
    max?: number;
    unit: string;
  };
  image: string;
  images?: string[];
  supplier: {
    name: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    responseTime: string;
    location: string;
    yearsInBusiness?: number;
  };
  minOrder: {
    quantity: number;
    unit: string;
  };
  category: string;
  badges?: string[];
  discount?: {
    percentage: number;
    originalPrice: number;
  };
  inStock: boolean;
  featured?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onContactSupplier?: () => void;
  isFavorite?: boolean;
}

export function ProductCard({
  id,
  title,
  price,
  image,
  images = [],
  supplier,
  minOrder,
  category,
  badges = [],
  discount,
  inStock,
  featured = false,
  onAddToCart,
  onToggleFavorite,
  onContactSupplier,
  isFavorite = false,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const allImages = [image, ...images];

  // Check if item is in wishlist
  const isWishlisted = id ? isInWishlist(id) : false;

  const handleToggleFavorite = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!id) {
      console.error('No listing ID provided');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist({
          listing_id: id,
          title,
          price: price.min,
          image,
          supplier_name: supplier.name
        });
      }
      onToggleFavorite?.();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!id) {
      console.error('No listing ID provided');
      return;
    }

    try {
      await addToCart({
        listing_id: id,
        title,
        price: price.min,
        image,
        supplier_name: supplier.name,
        quantity: minOrder.quantity
      });
      onAddToCart?.();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleContactSupplier = () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (user.id === supplier.id) {
      alert('You cannot message yourself. This is your own listing.');
      return;
    }

    const messageParams = new URLSearchParams({
      userId: supplier.id || '',
      supplierName: supplier.name,
      context: 'product',
      productName: title,
      productId: id
    });
    
    navigate('/messages?' + messageParams.toString());
    onContactSupplier?.();
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-neutral-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`product-card group relative ${
        featured ? 'ring-2 ring-orange-200 shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge badge-primary font-semibold">
            Featured
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="badge bg-red-500 text-white font-semibold">
            -{discount.percentage}%
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleToggleFavorite();
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          discount ? 'top-12' : ''
        } ${
          isWishlisted
            ? 'bg-red-500 text-white shadow-md'
            : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
        } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/marketplace/product/${id}`} className="block">
        {/* Image Section */}
        <div className="relative">
          <img
            src={allImages[currentImageIndex]}
            alt={title}
            className="product-image"
            loading="lazy"
          />
          
          {/* Image Navigation Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white shadow-md'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                // Quick view functionality
              }}
              className="btn-secondary bg-white/90 hover:bg-white text-xs px-3 py-1.5"
            >
              <Eye className="w-3 h-3 mr-1" />
              Quick View
            </button>
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="btn-primary text-xs px-3 py-1.5"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </button>
            )}
            {onContactSupplier && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleContactSupplier();
                }}
                className="btn-secondary bg-white/90 hover:bg-white text-xs px-3 py-1.5"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Contact
              </button>
            )}
          </div>

          {/* Stock Status */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-neutral-700">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="product-info">
          {/* Category */}
          <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
            {category}
          </div>

          {/* Title */}
          <h3 className="product-title">
            {title}
          </h3>

          {/* Price */}
          <div className="mb-3">
            {discount ? (
              <div className="flex items-center gap-2">
                <span className="product-price">
                  {formatPrice(price.min)}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  {formatPrice(discount.originalPrice)}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="product-price">
                  {formatPrice(price.min)}
                </span>
                {price.max && price.max !== price.min && (
                  <>
                    <span className="text-neutral-500">-</span>
                    <span className="product-price">
                      {formatPrice(price.max)}
                    </span>
                  </>
                )}
                <span className="text-sm text-neutral-500">/ {price.unit}</span>
              </div>
            )}
          </div>

          {/* Min Order */}
          <div className="text-sm text-neutral-600 mb-3">
            Min. Order: <span className="font-medium">{minOrder.quantity} {minOrder.unit}</span>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {badges.slice(0, 2).map((badge, index) => (
                <span key={index} className="badge badge-primary text-xs">
                  {badge}
                </span>
              ))}
              {badges.length > 2 && (
                <span className="badge bg-neutral-100 text-neutral-600 text-xs">
                  +{badges.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Supplier Info */}
          <div className="border-t border-neutral-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="product-supplier truncate">
                  {supplier.name}
                </span>
                {supplier.verified && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Shield className="w-3 h-3" />
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="product-rating mb-2">
              <div className="flex items-center gap-1">
                {renderStars(supplier.rating)}
              </div>
              <span className="text-xs text-neutral-600">
                {supplier.rating} ({supplier.reviewCount})
              </span>
            </div>

            {/* Supplier Details */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{supplier.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{supplier.responseTime}</span>
              </div>
            </div>

            {supplier.yearsInBusiness && (
              <div className="text-xs text-neutral-500 mt-1">
                {supplier.yearsInBusiness} years in business
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}