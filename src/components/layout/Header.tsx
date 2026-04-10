import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useWishlistStore, useCartStore, useNotificationsStore } from '@/store';
import { messagesService } from '@/services/messages.service';
import { 
  Search, 
  ShoppingCart, 
  User, 
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
  const { notifications, unreadCount, fetchNotifications } = useNotificationsStore();
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
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/home" className="flex items-center">
              <img 
                src="https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg" 
                alt="Cerka" 
                className="h-8 w-auto mr-2"
              />
              <div className="text-2xl font-bold text-orange-600">
                Cerka
              </div>
            </Link>

            {/* Location */}
            <div className="hidden md:flex items-center text-sm text-neutral-600 cursor-pointer hover:text-neutral-900">
              <MapPin className="w-4 h-4 mr-1" />
              <div>
                <div className="text-xs">Deliver to</div>
                <div className="font-semibold">Kigali, Rwanda</div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar">
              <div className="flex">
                <select className="px-3 py-2.5 text-sm border border-r-0 border-neutral-300 rounded-l-md bg-neutral-100 text-neutral-700 focus:outline-none">
                  <option>All</option>
                  <option>Construction</option>
                  <option>Agriculture</option>
                  <option>Electronics</option>
                  <option>Vehicles</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, suppliers, categories..."
                  className="search-input border-l-0 border-r-0 rounded-none"
                />
                <button type="submit" className="search-button">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language */}
              <div className="hidden md:flex items-center text-sm cursor-pointer hover:text-orange-600">
                <span className="mr-1">🇷🇼</span>
                EN
                <ChevronDown className="w-3 h-3 ml-1" />
              </div>

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
                        {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                      </span>
                    )}
                  </button>

                  {/* Messages */}
                  <Link 
                    to="/messages" 
                    className="relative p-2 text-neutral-600 hover:text-orange-600"
                    onClick={() => {
                      // Reset unread count when user clicks on messages
                      setTimeout(() => setUnreadMessageCount(0), 100);
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications */}
                  <Link to="/notifications" className="relative p-2 text-neutral-600 hover:text-orange-600">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
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
                        {cartItems.length > 99 ? '99+' : cartItems.length}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center text-sm text-neutral-700 hover:text-orange-600"
                    >
                      <User className="w-5 h-5 mr-2" />
                      <div className="text-left hidden md:block">
                        <div className="text-xs">Hello, {user.email?.split('@')[0]}</div>
                        <div className="font-semibold">Account & Lists</div>
                      </div>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-neutral-200">
                          <div className="font-semibold text-neutral-900">{user.email}</div>
                          <div className="text-sm text-neutral-600">{user.email}</div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/home"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/messages"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Messages
                          </Link>
                          <Link
                            to="/buyers/quotes"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Your Orders
                          </Link>
                          <Link
                            to="/suppliers/listings"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Sell on Cerka
                          </Link>
                          <Link
                            to="/materials/trends"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Price Intelligence
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-sm text-neutral-700 hover:text-orange-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="nav-categories">
        <div className="container-marketplace">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <Link to="/marketplace/categories" className="nav-category-item flex items-center whitespace-nowrap">
              <Menu className="w-4 h-4 mr-2" />
              All Categories
            </Link>
            {categories.slice(1, 8).map((category) => (
              <Link
                key={category}
                to={`/marketplace/${category.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                className="nav-category-item whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
            <Link to="/marketplace/categories" className="nav-category-item text-orange-300 hover:text-white whitespace-nowrap">
              More Categories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}