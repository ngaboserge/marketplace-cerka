import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuthStore, useMarketplaceStore } from '@/store';
import { formatCurrency } from '@/lib/currency';
import { ArrowLeft, MessageCircle, CheckCircle, X, Package, MapPin, Clock, User } from '@/lib/icons';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  responded: { label: 'Responded', bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  accepted:  { label: 'Accepted',  bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
  declined:  { label: 'Declined',  bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-neutral-100',text: 'text-neutral-600',dot: 'bg-neutral-400' },
};

export default function SupplierQuoteRequests() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { quoteRequests, loading, fetchSupplierRequests, updateRequestStatus } = useMarketplaceStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) fetchSupplierRequests(user.id);
  }, [user?.id]);

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'declined' | 'responded') => {
    setUpdatingId(id);
    try {
      await updateRequestStatus(id, status);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMessage = (request: any) => {
    const params = new URLSearchParams({
      userId: request.buyer_id,
      supplierName: request.buyer?.full_name || 'Buyer',
      context: 'quote',
      productName: request.listing?.material?.name || request.listing?.title || '',
      productId: request.listing_id,
    });
    navigate('/messages?' + params.toString());
  };

  const filtered = statusFilter
    ? quoteRequests.filter(r => r.status === statusFilter)
    : quoteRequests;

  const counts = {
    all: quoteRequests.length,
    pending: quoteRequests.filter(r => r.status === 'pending').length,
    responded: quoteRequests.filter(r => r.status === 'responded').length,
    accepted: quoteRequests.filter(r => r.status === 'accepted').length,
    declined: quoteRequests.filter(r => r.status === 'declined').length,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 py-8">

          <button onClick={() => navigate('/suppliers/listings')} className="btn-secondary mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to My Listings
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Quote Requests</h1>
              <p className="text-neutral-600 text-sm mt-1">Manage incoming buyer quote requests</p>
            </div>
            {counts.pending > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-semibold">
                {counts.pending} pending
              </div>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: '', label: 'All', count: counts.all },
              { key: 'pending', label: 'Pending', count: counts.pending },
              { key: 'responded', label: 'Responded', count: counts.responded },
              { key: 'accepted', label: 'Accepted', count: counts.accepted },
              { key: 'declined', label: 'Declined', count: counts.declined },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-orange-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-16 text-center">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">
                {statusFilter ? `No ${statusFilter} requests` : 'No quote requests yet'}
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Quote requests from buyers will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(request => {
                const statusCfg = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const isPending = request.status === 'pending';
                const isUpdating = updatingId === request.id;
                const estimatedTotal = (request.listing?.price || 0) * request.quantity;

                return (
                  <div
                    key={request.id}
                    className={`bg-white rounded-xl border overflow-hidden transition-all ${
                      isPending ? 'border-yellow-200 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    {/* Top bar */}
                    <div className={`px-5 py-3 flex items-center justify-between ${isPending ? 'bg-yellow-50' : 'bg-neutral-50'} border-b border-neutral-100`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {new Date(request.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400">#{request.id.slice(0, 8)}</span>
                    </div>

                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Left: request details */}
                        <div className="flex-1 space-y-3">
                          {/* Product */}
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-0.5">Product</p>
                            <p className="font-semibold text-neutral-900">
                              {request.listing?.title || request.listing?.material?.name || 'Product'}
                            </p>
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                              <Package className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-neutral-500">Quantity</p>
                                <p className="text-sm font-medium text-neutral-900">
                                  {request.quantity} {request.listing?.material?.unit || 'units'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-neutral-500">Delivery To</p>
                                <p className="text-sm font-medium text-neutral-900">{request.delivery_location}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-neutral-500">Buyer</p>
                                <p className="text-sm font-medium text-neutral-900">
                                  {request.buyer?.full_name || request.buyer?.business_name || 'Anonymous Buyer'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-neutral-500">Est. Value</p>
                                <p className="text-sm font-bold text-orange-600">{formatCurrency(estimatedTotal)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {request.notes && (
                            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                              <p className="text-xs text-neutral-500 mb-1">Buyer's Notes</p>
                              <p className="text-sm text-neutral-700">{request.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Right: price + actions */}
                        <div className="flex flex-col items-end justify-between gap-3 min-w-[140px]">
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">Unit Price</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(request.listing?.price || 0)}
                            </p>
                            <p className="text-xs text-neutral-500">per {request.listing?.material?.unit}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-2 w-full">
                            <button
                              onClick={() => handleMessage(request)}
                              className="btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 w-full"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Message Buyer
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'accepted')}
                                  disabled={isUpdating}
                                  className="bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 w-full font-medium transition-colors disabled:opacity-60"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  {isUpdating ? '...' : 'Accept'}
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'declined')}
                                  disabled={isUpdating}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 w-full font-medium transition-colors disabled:opacity-60 border border-red-200"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  {isUpdating ? '...' : 'Decline'}
                                </button>
                              </>
                            )}

                            {request.status === 'accepted' && (
                              <div className="text-center text-xs text-green-600 font-medium py-1">
                                ✓ You accepted this order
                              </div>
                            )}
                            {request.status === 'declined' && (
                              <div className="text-center text-xs text-red-500 font-medium py-1">
                                ✗ You declined this request
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
