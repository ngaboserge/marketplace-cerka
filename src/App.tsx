import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuthStore } from '@/store';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ToastContainer, MobileNav } from '@/components/ui';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import InstallAppButton from '@/components/InstallAppButton';

// Always-loaded pages (critical path)
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import MarketplaceHome from '@/pages/MarketplaceHome';
import { AdminFloatingButton } from '@/components/AdminFloatingButton';
import { Chatbot } from '@/components/Chatbot';

// Lazy-loaded pages (code split for performance)
const NewLanding = lazy(() => import('@/pages/NewLanding').then(m => ({ default: m.NewLanding })));
const Home = lazy(() => import('@/pages/HomeSimplified'));
const MarketplacePlatform = lazy(() => import('@/pages/MarketplacePlatform'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const TermsOfService = lazy(() => import('@/pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const Messages = lazy(() => import('@/pages/Messages').then(m => ({ default: m.Messages })));
const Notifications = lazy(() => import('@/pages/Notifications').then(m => ({ default: m.Notifications })));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminSupport = lazy(() => import('@/pages/admin/Support'));
const MarketplaceUsers = lazy(() => import('@/pages/admin/MarketplaceUsers'));
const PriceModeration = lazy(() => import('@/pages/admin/PriceModeration'));
const SupplierVerification = lazy(() => import('@/pages/admin/SupplierVerification'));
const MaterialsModeration = lazy(() => import('@/pages/admin/MaterialsModeration'));
const IntelligenceMonitor = lazy(() => import('@/pages/admin/IntelligenceMonitor'));
const AdminQuoteRequests = lazy(() => import('@/pages/admin/QuoteRequests'));

// Material Marketplace pages
const PriceSubmit = lazy(() => import('@/pages/materials/PriceSubmit'));
const PriceIndex = lazy(() => import('@/pages/materials/PriceIndex'));
const PriceTrends = lazy(() => import('@/pages/materials/PriceTrends'));
const MaterialDetail = lazy(() => import('@/pages/materials/MaterialDetail'));
const MySubmissions = lazy(() => import('@/pages/materials/MySubmissions'));
const RegionalPriceIndex = lazy(() => import('@/pages/materials/RegionalPriceIndex'));

// Buyer pages
const BuyerSearch = lazy(() => import('@/pages/buyers/BuyerSearch'));
const ListingDetail = lazy(() => import('@/pages/buyers/ListingDetail'));
const QuoteHistory = lazy(() => import('@/pages/buyers/QuoteHistory'));
const Wishlist = lazy(() => import('@/pages/buyers/Wishlist').then(m => ({ default: m.Wishlist })));
const Cart = lazy(() => import('@/pages/buyers/Cart').then(m => ({ default: m.Cart })));

// Supplier pages
const MyListings = lazy(() => import('@/pages/suppliers/MyListings'));
const CreateListing = lazy(() => import('@/pages/suppliers/CreateListing'));
const EditListing = lazy(() => import('@/pages/suppliers/EditListing').then(m => ({ default: m.EditListing })));
const ListingAnalytics = lazy(() => import('@/pages/suppliers/ListingAnalytics').then(m => ({ default: m.ListingAnalytics })));
const SupplierQuoteRequests = lazy(() => import('@/pages/suppliers/QuoteRequests'));
const SupplierProfile = lazy(() => import('@/pages/suppliers/SupplierProfile'));
const CostAnalytics = lazy(() => import('@/pages/suppliers/CostAnalytics'));

// Marketplace pages
const AllCategories = lazy(() => import('@/pages/marketplace/AllCategories'));
const SectorBrowse = lazy(() => import('@/pages/marketplace/SectorBrowse'));
const MarketplaceProfile = lazy(() => import('@/pages/marketplace/MarketplaceProfile').then(m => ({ default: m.MarketplaceProfile })));
const ProductDetail = lazy(() => import('@/pages/marketplace/ProductDetail').then(m => ({ default: m.ProductDetail })));

// Intelligence pages
const SignalsDashboard = lazy(() => import('@/pages/intelligence/SignalsDashboard'));
const InsightsFeed = lazy(() => import('@/pages/intelligence/InsightsFeed'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'buyer' | 'supplier' | 'contributor' | 'admin' }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    // Redirect to home instead of role-specific dashboard
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
}

function HomeRedirect() {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirect admin to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Default: show marketplace home
  return <MarketplaceHome />;
}

function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  useDarkMode(); // Use the hook that handles dark mode
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <DarkModeWrapper>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Materials Marketplace Platform */}
          <Route path="/marketplace" element={<MarketplacePlatform />} />
          
          {/* Home - After Login */}
          <Route path="/home" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
          
          {/* Shared authenticated routes */}
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/messages/:conversationId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><MarketplaceUsers /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute role="admin"><AdminSupport /></ProtectedRoute>} />
          <Route path="/admin/price-moderation" element={<ProtectedRoute role="admin"><PriceModeration /></ProtectedRoute>} />
          <Route path="/admin/supplier-verification" element={<ProtectedRoute role="admin"><SupplierVerification /></ProtectedRoute>} />
          <Route path="/admin/materials" element={<ProtectedRoute role="admin"><MaterialsModeration /></ProtectedRoute>} />
          <Route path="/admin/intelligence" element={<ProtectedRoute role="admin"><IntelligenceMonitor /></ProtectedRoute>} />
          <Route path="/admin/quotes" element={<ProtectedRoute role="admin"><AdminQuoteRequests /></ProtectedRoute>} />
          
          {/* Material Marketplace routes */}
          <Route path="/materials/dashboard" element={<Navigate to="/materials/trends" replace />} />
          <Route path="/materials/trends" element={<ProtectedRoute><PriceTrends /></ProtectedRoute>} />
          <Route path="/materials/price-index" element={<ProtectedRoute><PriceIndex /></ProtectedRoute>} />
          <Route path="/materials/:id" element={<ProtectedRoute><MaterialDetail /></ProtectedRoute>} />
          <Route path="/materials/submit" element={<ProtectedRoute><PriceSubmit /></ProtectedRoute>} />
          <Route path="/materials/my-submissions" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
          
          {/* Buyer routes */}
          <Route path="/buyers/marketplace" element={<Navigate to="/buyers/search" replace />} />
          <Route path="/buyers/search" element={<ProtectedRoute><BuyerSearch /></ProtectedRoute>} />
          <Route path="/buyers/listing/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
          <Route path="/buyers/quotes" element={<ProtectedRoute><QuoteHistory /></ProtectedRoute>} />
          <Route path="/buyers/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/buyers/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          
          {/* Supplier routes */}
          <Route path="/suppliers/listings" element={<ProtectedRoute role="supplier"><MyListings /></ProtectedRoute>} />
          <Route path="/suppliers/create" element={<ProtectedRoute role="supplier"><CreateListing /></ProtectedRoute>} />
          <Route path="/suppliers/edit/:id" element={<ProtectedRoute role="supplier"><EditListing /></ProtectedRoute>} />
          <Route path="/suppliers/analytics/:id" element={<ProtectedRoute role="supplier"><ListingAnalytics /></ProtectedRoute>} />
          <Route path="/suppliers/costs/:id" element={<ProtectedRoute role="supplier"><CostAnalytics /></ProtectedRoute>} />
          <Route path="/suppliers/quotes" element={<ProtectedRoute role="supplier"><SupplierQuoteRequests /></ProtectedRoute>} />
          
          {/* Multi-Sector Marketplace routes */}
          <Route path="/marketplace/categories" element={<ProtectedRoute><AllCategories /></ProtectedRoute>} />
          <Route path="/marketplace/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/marketplace/:sector" element={<ProtectedRoute><SectorBrowse /></ProtectedRoute>} />
          <Route path="/marketplace/profile" element={<ProtectedRoute><MarketplaceProfile /></ProtectedRoute>} />
          
          {/* Intelligence routes */}
          <Route path="/intelligence/signals" element={<ProtectedRoute><SignalsDashboard /></ProtectedRoute>} />
          <Route path="/intelligence/insights" element={<ProtectedRoute><InsightsFeed /></ProtectedRoute>} />

          {/* Supplier public profile */}
          <Route path="/suppliers/profile/:id" element={<ProtectedRoute><SupplierProfile /></ProtectedRoute>} />

          {/* Regional price comparison */}
          <Route path="/materials/regional" element={<ProtectedRoute><RegionalPriceIndex /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        <AdminFloatingButton />
        <FloatingActionButton />
        <Chatbot />
        <InstallAppButton />
        <MobileNav />
        <ToastContainer />
      </DarkModeWrapper>
    </BrowserRouter>
  );
}
