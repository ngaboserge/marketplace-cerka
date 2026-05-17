import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useWishlistStore, useCartStore, useNotificationsStore } from '@/store';
import { messagesService } from '@/services/messages.service';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  MapPin, 
  ChevronDown,
  Heart,
  Bell,
  MessageCircle
} from '@/lib/icons';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { items: cartItems, fetchCart } = useCartStore();
  const { notifications: _notifications, unreadCount, fetchNotifications } = useNotificationsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const subscriptionRef = useRef<any>(null);

  // Load unread message count and other data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setUnreadMessageCount(0);
        return;
      }

      try {
        // Load unread message count
        const conversations = await messagesService.getConversations(user.id);
        const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
        setUnreadMessageCount(totalUnread);

        // Load wishlist, cart, and notifications
        await Promise.all([
          fetchWishlist(),
          fetchCart(),
          fetchNotifications()
        ]);
      } catch (error) {
        console.error('Error loading header data:', error);
        setUnreadMessageCount(0);
      }
    };

    loadData();

    // Set up real-time updates for message count
    if (user?.id) {
      // Clean up existing subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = messagesService.subscribeToConversations(user.id, () => {
        loadData(); // Reload all data when conversations change
      });

      // Also refresh count when user comes back to the page
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          loadData();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyers/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    'All Categories',
    'Construction Materials',
    'Agriculture & Food',
    'Electronics',
    'Vehicles & Parts',
    'Machinery',
    'Textiles',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Entertainment'
  ];

  return (
    <>
      {/* Top Header */}
      <div className="marketplace-header">
        <div className="container-marketplace">

          {/* Row 1: Logo + Icons (always visible) */}
          <div className="flex items-center justify-between py-2.5 gap-2">
            {/* Logo */}
            <Link to="/home" className="flex items-center flex-shrink-0">
              <img
                src="https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg"
                alt="Cerka"
                className="h-7 w-auto mr-1.5"
              />
              <span className="text-xl font-bold text-orange-600">Cerka</span>
            </Link>

            {/* Location — desktop only */}
            <div className="hidden lg:flex items-center text-sm text-neutral-600 cursor-pointer hover:text-neutral-900 flex-shrink-0">
              <MapPin className="w-4 h-4 mr-1" />
              <div>
                <div className="text-xs">Deliver to</div>
                <div className="font-semibold">Kigali, Rwanda</div>
              </div>
            </div>

            {/* Search Bar — hidden on mobile (shown in row 2) */}
            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-3">
              <div className="flex w-full">
                <select className="hidden md:block px-2 py-2 text-sm border border-r-0 border-neutral-300 rounded-l-md bg-neutral-100 text-neutral-700 focus:outline-none">
                  <option>All</option>
                  <option>Construction</option>
                  <option>Agriculture</option>
                  <option>Electronics</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, suppliers..."
                  className="search-input flex-1 border-l-0 border-r-0 rounded-none md:rounded-none rounded-l-md"
                />
                <button type="submit" className="search-button flex-shrink-0">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {user ? (
                <>
                  {/* Wishlist */}
                  <button
                    onClick={() => navigate('/buyers/wishlist')}
                    className="relative p-2 text-neutral-600 hover:text-orange-600"
                  >
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                      </span>
                    )}
                  </button>

                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="relative p-2 text-neutral-600 hover:text-orange-600"
                    onClick={() => setTimeout(() => setUnreadMessageCount(0), 100)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications — hidden on very small screens */}
                  <Link to="/notifications" className="relative p-2 text-neutral-600 hover:text-orange-600 hidden xs:block">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <button
                    onClick={() => navigate('/buyers/cart')}
                    className="relative p-2 text-neutral-600 hover:text-orange-600"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.length > 9 ? '9+' : cartItems.length}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-1 text-sm text-neutral-700 hover:text-orange-600 p-1"
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs flex-shrink-0">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className="w-3 h-3 hidden sm:block" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-neutral-100 bg-orange-50">
                          <div className="font-semibold text-neutral-900 text-sm truncate">{user.name || user.email?.split('@')[0]}</div>
                          <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                          <div className="text-xs text-orange-600 font-medium capitalize mt-0.5">{user.role}</div>
                        </div>
                        <div className="py-1">
                          <Link to="/home" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Dashboard</Link>
                          <Link to="/messages" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Messages</Link>
                          <Link to="/buyers/quotes" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">My Quotes</Link>
                          <Link to="/buyers/wishlist" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Wishlist</Link>
                          {user.role === 'supplier' && (
                            <>
                              <hr className="my-1" />
                              <Link to="/suppliers/listings" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">My Listings</Link>
                              <Link to="/suppliers/quotes" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Quote Requests</Link>
                            </>
                          )}
                          {user.role !== 'supplier' && (
                            <Link to="/suppliers/listings" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Sell on Cerka</Link>
                          )}
                          <hr className="my-1" />
                          <Link to="/materials/trends" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Price Intelligence</Link>
                          <Link to="/materials/regional" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Regional Prices</Link>
                          <hr className="my-1" />
                          <button onClick={() => { logout(); setShowUserMenu(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm text-neutral-700 hover:text-orange-600 hidden sm:block">Sign In</Link>
                  <Link to="/register" className="btn-primary text-xs sm:text-sm px-3 py-2">Join Free</Link>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Mobile search bar (visible only on small screens) */}
          <div className="sm:hidden pb-2.5">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, suppliers..."
                className="search-input flex-1 rounded-r-none text-sm"
              />
              <button type="submit" className="search-button px-4 rounded-l-none">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Category Navigation — scrollable on mobile */}
      <div className="nav-categories">
        <div className="container-marketplace">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Link to="/marketplace/categories" className="nav-category-item flex items-center whitespace-nowrap text-xs sm:text-sm">
              <Menu className="w-3.5 h-3.5 mr-1.5" />
              All
            </Link>
            {categories.slice(1, 8).map((category) => (
              <Link
                key={category}
                to={`/marketplace/${category.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                className="nav-category-item whitespace-nowrap text-xs sm:text-sm"
              >
                {category}
              </Link>
            ))}
            <Link to="/materials/regional" className="nav-category-item text-orange-300 hover:text-white whitespace-nowrap text-xs sm:text-sm">
              Regional Prices
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}