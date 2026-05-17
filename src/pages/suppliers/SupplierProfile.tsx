import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store';
import { formatCurrency } from '@/lib/currency';
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Star, Shield,
  CheckCircle, Package, Clock, TrendingUp, Share2, Calendar
} from '@/lib/icons';

interface SupplierData {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  business_description: string;
  location: string;
  phone: string;
  is_verified_supplier: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

interface ListingData {
  id: string;
  title: string;
  description: string;
  price: number;
  min_quantity: number;
  location: string;
  availability_status: string;
  photos: string[];
  view_count: number;
  created_at: string;
  material: {
    name: string;
    unit: string;
    category: string;
    sector: string;
  };
}

export default function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'about'>('listings');
  const [sectorFilter, setSectorFilter] = useState('');

  useEffect(() => {
    if (id) loadSupplier(id);
  }, [id]);

  const loadSupplier = async (supplierId: string) => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, business_name, business_description, location, phone, is_verified_supplier, average_rating, total_reviews, created_at')
        .eq('id', supplierId)
        .maybeSingle();

      if (profileError || !profile) {
        navigate('/buyers/search');
        return;
      }
      setSupplier(profile as SupplierData);

      // Fetch their active listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('supplier_listings')
        .select(`
          id, title, description, price, min_quantity, location,
          availability_status, photos, view_count, created_at,
          material:materials(name, unit, category, sector)
        `)
        .eq('supplier_id', supplierId)
        .neq('availability_status', 'inactive')
        .order('created_at', { ascending: false });

      if (!listingsError && listingsData) {
        setListings(listingsData as ListingData[]);
      }
    } catch (err) {
      console.error('Error loading supplier:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) { navigate('/login'); return; }
    if (user.id === id) return;
    const params = new URLSearchParams({
      userId: id!,
      supplierName: supplier?.business_name || supplier?.full_name || 'Supplier',
      context: 'supplier'
    });
    navigate('/messages?' + params.toString());
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const yearsActive = supplier
    ? Math.max(1, Math.floor((Date.now() - new Date(supplier.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)))
    : 0;

  const sectors = [...new Set(listings.map(l => l.material?.sector).filter(Boolean))];
  const filteredListings = sectorFilter
    ? listings.filter(l => l.material?.sector === sectorFilter)
    : listings;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`}
      />
    ));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-48 bg-neutral-200 rounded-xl" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-neutral-200 rounded-lg" />)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-neutral-200 rounded-lg" />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!supplier) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Profile Header Card */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-600" />

            <div className="px-6 pb-6">
              {/* Avatar + name row */}
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="flex items-end gap-4">
                  {/* Avatar circle */}
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-orange-600 bg-orange-50">
                    {(supplier.business_name || supplier.full_name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="mb-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {supplier.business_name || supplier.full_name}
                      </h1>
                      {supplier.is_verified_supplier && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    {supplier.business_name && supplier.full_name && (
                      <p className="text-neutral-500 text-sm">{supplier.full_name}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mb-1">
                  <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  {user && user.id !== id && (
                    <button onClick={handleContact} className="btn-primary flex items-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      Contact Supplier
                    </button>
                  )}
                </div>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                {supplier.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {supplier.location}, Rwanda
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-orange-500" />
                    {supplier.phone}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Member for {yearsActive} {yearsActive === 1 ? 'year' : 'years'}
                </div>
                {supplier.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex">{renderStars(supplier.average_rating)}</div>
                    <span className="font-medium text-neutral-900">{supplier.average_rating.toFixed(1)}</span>
                    <span className="text-neutral-500">({supplier.total_reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{listings.length}</div>
              <div className="text-sm text-neutral-600">Active Listings</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{sectors.length}</div>
              <div className="text-sm text-neutral-600">Sectors Covered</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {supplier.average_rating > 0 ? supplier.average_rating.toFixed(1) : '—'}
              </div>
              <div className="text-sm text-neutral-600">Avg Rating</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-6">
            <nav className="flex gap-8">
              {[
                { id: 'listings', label: `Products (${listings.length})` },
                { id: 'about', label: 'About' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              {/* Sector filter */}
              {sectors.length > 1 && (
                <div className="flex gap-2 mb-5 flex-wrap">
                  <button
                    onClick={() => setSectorFilter('')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      !sectorFilter ? 'bg-orange-500 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-orange-300'
                    }`}
                  >
                    All
                  </button>
                  {sectors.map(sector => (
                    <button
                      key={sector}
                      onClick={() => setSectorFilter(sector)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                        sectorFilter === sector ? 'bg-orange-500 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-orange-300'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              )}

              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No listings found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredListings.map(listing => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
                      onClick={() => navigate(`/marketplace/product/${listing.id}`)}
                    >
                      {/* Image */}
                      <div className="relative h-44 bg-neutral-100">
                        {listing.photos?.[0] ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-neutral-300" />
                          </div>
                        )}
                        {listing.availability_status === 'available' && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            In Stock
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 text-neutral-600 text-xs px-2 py-0.5 rounded-full capitalize">
                          {listing.material?.sector || listing.material?.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                          {listing.material?.category}
                        </p>
                        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-1">{listing.title}</h3>
                        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{listing.description}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-orange-600">
                              {formatCurrency(listing.price)}
                            </span>
                            <span className="text-sm text-neutral-500 ml-1">/ {listing.material?.unit}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="w-3 h-3" />
                            {listing.location}
                          </div>
                        </div>

                        {listing.min_quantity > 1 && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Min. order: {listing.min_quantity} {listing.material?.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">About the Business</h2>
                {supplier.business_description ? (
                  <p className="text-neutral-700 leading-relaxed">{supplier.business_description}</p>
                ) : (
                  <p className="text-neutral-500 italic">No description provided.</p>
                )}
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {supplier.location && (
                    <div className="flex items-center gap-3 text-neutral-700">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Location</p>
                        <p className="font-medium">{supplier.location}, Rwanda</p>
                      </div>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-3 text-neutral-700">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Phone</p>
                        <p className="font-medium">{supplier.phone}</p>
                      </div>
                    </div>
                  )}
                  {user && user.id !== id && (
                    <button
                      onClick={handleContact}
                      className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send Message
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Sectors Supplied</h2>
                <div className="flex flex-wrap gap-2">
                  {sectors.length > 0 ? sectors.map(sector => (
                    <span
                      key={sector}
                      className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium capitalize"
                    >
                      {sector}
                    </span>
                  )) : (
                    <p className="text-neutral-500 text-sm">No sectors listed yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Supplier Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-neutral-600">Verification</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {supplier.is_verified_supplier ? 'Verified Supplier' : 'Unverified'}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-neutral-600">Member Since</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {new Date(supplier.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-neutral-600">Total Listings</span>
                    </div>
                    <p className="font-semibold text-neutral-900">{listings.length}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-neutral-600">Total Views</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {listings.reduce((sum, l) => sum + (l.view_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
