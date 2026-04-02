import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ToastContainer, MobileNav } from '@/components/ui';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import InstallAppButton from '@/components/InstallAppButton';

// Public pages
import { Landing } from '@/pages/Landing';
import { NewLanding } from '@/pages/NewLanding';
import Home from '@/pages/HomeSimplified';
import MarketplaceHome from '@/pages/MarketplaceHome';
import MarketplacePlatform from '@/pages/MarketplacePlatform';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { HelpCenter } from '@/pages/HelpCenter';
import { TermsOfService } from '@/pages/TermsOfService';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';

// Shared pages
import { Messages } from '@/pages/Messages';
import { Notifications } from '@/pages/Notifications';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminSupport from '@/pages/admin/Support';
import AdminListings from '@/pages/admin/Listings';
import MarketplaceUsers from '@/pages/admin/MarketplaceUsers';
import { AdminFloatingButton } from '@/components/AdminFloatingButton';
import { Chatbot } from '@/components/Chatbot';

// Material Marketplace pages
import PriceSubmit from '@/pages/materials/PriceSubmit';
import PriceIndex from '@/pages/materials/PriceIndex';
import PriceTrends from '@/pages/materials/PriceTrends';
import MaterialDetail from '@/pages/materials/MaterialDetail';
import MySubmissions from '@/pages/materials/MySubmissions';
import BuyerSearch from '@/pages/buyers/BuyerSearch';
import ListingDetail from '@/pages/buyers/ListingDetail';
import QuoteHistory from '@/pages/buyers/QuoteHistory';
import MyListings from '@/pages/suppliers/MyListings';
import CreateListing from '@/pages/suppliers/CreateListing';
import PriceModeration from '@/pages/admin/PriceModeration';
import SupplierVerification from '@/pages/admin/SupplierVerification';
import MaterialsModeration from '@/pages/admin/MaterialsModeration';
import IntelligenceMonitor from '@/pages/admin/IntelligenceMonitor';
import QuoteRequests from '@/pages/admin/QuoteRequests';

// Multi-Sector Marketplace pages
import AllCategories from '@/pages/marketplace/AllCategories';
import SectorBrowse from '@/pages/marketplace/SectorBrowse';
import { MarketplaceProfile } from '@/pages/marketplace/MarketplaceProfile';

// Intelligence pages
import SignalsDashboard from '@/pages/intelligence/SignalsDashboard';
import InsightsFeed from '@/pages/intelligence/InsightsFeed';

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
    <BrowserRouter>
      <DarkModeWrapper>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<NewLanding />} />
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
          <Route path="/admin/listings" element={<ProtectedRoute role="admin"><AdminListings /></ProtectedRoute>} />
          <Route path="/admin/price-moderation" element={<ProtectedRoute role="admin"><PriceModeration /></ProtectedRoute>} />
          <Route path="/admin/supplier-verification" element={<ProtectedRoute role="admin"><SupplierVerification /></ProtectedRoute>} />
          <Route path="/admin/materials" element={<ProtectedRoute role="admin"><MaterialsModeration /></ProtectedRoute>} />
          <Route path="/admin/intelligence" element={<ProtectedRoute role="admin"><IntelligenceMonitor /></ProtectedRoute>} />
          <Route path="/admin/quotes" element={<ProtectedRoute role="admin"><QuoteRequests /></ProtectedRoute>} />
          
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
          
          {/* Supplier routes */}
          <Route path="/suppliers/listings" element={<ProtectedRoute role="supplier"><MyListings /></ProtectedRoute>} />
          <Route path="/suppliers/create" element={<ProtectedRoute role="supplier"><CreateListing /></ProtectedRoute>} />
          
          {/* Multi-Sector Marketplace routes */}
          <Route path="/marketplace/categories" element={<ProtectedRoute><AllCategories /></ProtectedRoute>} />
          <Route path="/marketplace/:sector" element={<ProtectedRoute><SectorBrowse /></ProtectedRoute>} />
          <Route path="/marketplace/profile" element={<ProtectedRoute><MarketplaceProfile /></ProtectedRoute>} />
          
          {/* Intelligence routes */}
          <Route path="/intelligence/signals" element={<ProtectedRoute><SignalsDashboard /></ProtectedRoute>} />
          <Route path="/intelligence/insights" element={<ProtectedRoute><InsightsFeed /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
