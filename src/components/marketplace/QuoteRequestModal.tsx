import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useMarketplaceStore } from '@/store';
import { formatCurrency } from '@/lib/currency';
import { X, MapPin, Package, MessageCircle, CheckCircle } from '@/lib/icons';

const RWANDA_DISTRICTS = [
  'Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Musanze', 'Burera', 'Gakenke', 'Gicumbi', 'Rulindo',
  'Huye', 'Gisagara', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi',
];

interface QuoteRequestModalProps {
  listing: {
    id: string;
    title: string;
    price: number;
    supplier_id: string;
    supplier_name: string;
    min_quantity: number;
    unit: string;
    location: string;
    image?: string;
  };
  onClose: () => void;
}

export function QuoteRequestModal({ listing, onClose }: QuoteRequestModalProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createQuoteRequest } = useMarketplaceStore();

  const [quantity, setQuantity] = useState(listing.min_quantity || 1);
  const [deliveryLocation, setDeliveryLocation] = useState('Kigali');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const estimatedTotal = quantity * listing.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (quantity < (listing.min_quantity || 1)) {
      setError(`Minimum order is ${listing.min_quantity} ${listing.unit}`);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createQuoteRequest({
        buyer_id: user.id,
        supplier_id: listing.supplier_id,
        listing_id: listing.id,
        quantity,
        delivery_location: deliveryLocation,
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Request a Quote</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Quote Request Sent!</h3>
            <p className="text-neutral-600 mb-1">
              Your request has been sent to <span className="font-medium">{listing.supplier_name}</span>.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              They'll respond within 24 hours. You can also message them directly.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    userId: listing.supplier_id,
                    supplierName: listing.supplier_name,
                    context: 'quote',
                    productName: listing.title,
                    productId: listing.id,
                  });
                  navigate('/messages?' + params.toString());
                }}
                className="btn-primary flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Supplier
              </button>
              <button
                onClick={() => navigate('/buyers/quotes')}
                className="btn-secondary"
              >
                View My Quotes
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Product summary */}
            <div className="p-5 bg-neutral-50 border-b border-neutral-100">
              <div className="flex gap-3">
                {listing.image && (
                  <img src={listing.image} alt={listing.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{listing.title}</p>
                  <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </p>
                  <p className="text-orange-600 font-bold mt-1">
                    {formatCurrency(listing.price)} / {listing.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Quantity <span className="text-neutral-400 font-normal">(min. {listing.min_quantity} {listing.unit})</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(listing.min_quantity || 1, q - 1))}
                      className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min={listing.min_quantity || 1}
                      className="w-20 text-center py-2 border-x border-neutral-300 focus:outline-none text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-neutral-600">{listing.unit}</span>
                </div>
              </div>

              {/* Delivery location */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Delivery Location
                </label>
                <select
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  {RWANDA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Additional Notes <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Specify grade, packaging, delivery timeline, or any special requirements..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>

              {/* Estimated total */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span>{quantity} {listing.unit} × {formatCurrency(listing.price)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Estimated Total</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(estimatedTotal)}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Final price will be confirmed by the supplier. Delivery costs may apply.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending Request...
                  </span>
                ) : 'Send Quote Request'}
              </button>

              <p className="text-xs text-center text-neutral-500">
                The supplier will be notified and respond within 24 hours
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
