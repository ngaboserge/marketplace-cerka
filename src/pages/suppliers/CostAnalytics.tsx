import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/currency';
import { costBreakdownService, CATEGORY_LABELS, CATEGORY_COLORS, type CostAnalysis, type StageCategory } from '@/services/costBreakdown.service';
import { CostBreakdownForm } from '@/components/suppliers/CostBreakdownForm';
import { ArrowLeft, TrendingUp, TrendingDown, Package, BarChart } from '@/lib/icons';

export default function CostAnalytics() {
  const { id: listingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [listing, setListing] = useState<any>(null);
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'analysis'>('breakdown');

  useEffect(() => {
    if (listingId && user?.id) loadData();
  }, [listingId, user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: listingData } = await supabase
        .from('supplier_listings')
        .select('*, material:materials(name, unit, sector, category)')
        .eq('id', listingId!)
        .eq('supplier_id', user!.id)
        .maybeSingle();

      if (!listingData) { navigate('/suppliers/listings'); return; }
      setListing(listingData);

      const entries = await costBreakdownService.getListingCosts(listingId!);
      if (entries.length > 0) {
        setAnalysis(costBreakdownService.analyzecosts(entries, listingData.price));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = async () => {
    const entries = await costBreakdownService.getListingCosts(listingId!);
    if (entries.length > 0 && listing) {
      setAnalysis(costBreakdownService.analyzecosts(entries, listing.price));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-64" />
            <div className="h-48 bg-neutral-200 rounded-xl" />
            <div className="h-64 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) return null;

  const sector = listing.material?.sector || 'food';

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 py-8">

          <button onClick={() => navigate('/suppliers/listings')} className="btn-secondary mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to My Listings
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium capitalize">
                    {sector}
                  </span>
                  <span className="text-xs text-neutral-500">{listing.material?.category}</span>
                </div>
                <h1 className="text-xl font-bold text-neutral-900">{listing.title}</h1>
                <p className="text-sm text-neutral-500 mt-0.5">{listing.location} · {listing.material?.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">Selling price</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(listing.price)}</p>
                <p className="text-xs text-neutral-500">per {listing.material?.unit}</p>
              </div>
            </div>
          </div>

          {/* Analysis summary cards (if data exists) */}
          {analysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Production Cost</p>
                <p className="text-lg font-bold text-neutral-900">{formatCurrency(analysis.total_cost)}</p>
              </div>
              <div className={`rounded-xl border p-4 text-center ${analysis.is_profitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-neutral-500 mb-1">Margin</p>
                <div className="flex items-center justify-center gap-1">
                  {analysis.is_profitable
                    ? <TrendingUp className="w-4 h-4 text-green-600" />
                    : <TrendingDown className="w-4 h-4 text-red-600" />
                  }
                  <p className={`text-lg font-bold ${analysis.is_profitable ? 'text-green-700' : 'text-red-700'}`}>
                    {analysis.margin_pct}%
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Profit/unit</p>
                <p className={`text-lg font-bold ${analysis.margin_rwf >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(analysis.margin_rwf)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Cost stages</p>
                <p className="text-lg font-bold text-neutral-900">{analysis.entries.length}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-6">
            <nav className="flex gap-6">
              {[
                { id: 'breakdown', label: 'Cost Breakdown' },
                { id: 'analysis', label: 'Analysis', disabled: !analysis },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                  disabled={tab.disabled}
                  className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : tab.disabled
                        ? 'border-transparent text-neutral-300 cursor-not-allowed'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'analysis' && !analysis && (
                    <span className="ml-1 text-xs text-neutral-400">(add costs first)</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Cost Breakdown Tab */}
          {activeTab === 'breakdown' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Production Cost Breakdown</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Track every cost from raw input to final sale. Pre-filled with common stages for {sector}.
                  </p>
                </div>
              </div>
              <CostBreakdownForm
                listingId={listingId!}
                supplierId={user!.id}
                sellingPrice={listing.price}
                sector={sector}
                onSaved={handleSaved}
              />
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && analysis && (
            <div className="space-y-4">
              {/* Cost waterfall */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-orange-500" />
                  Cost Waterfall
                </h2>
                <div className="space-y-3">
                  {(Object.keys(CATEGORY_LABELS) as StageCategory[]).map(cat => {
                    const amount = analysis.by_category[cat];
                    const pct = analysis.by_category_pct[cat];
                    if (amount === 0) return null;
                    const isMargin = cat === 'margin';
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-neutral-700">{CATEGORY_LABELS[cat]}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500">{pct}%</span>
                            <span className={`font-semibold ${isMargin ? (amount >= 0 ? 'text-green-600' : 'text-red-600') : 'text-neutral-900'}`}>
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{
                              width: `${Math.min(Math.abs(pct), 100)}%`,
                              backgroundColor: isMargin && amount < 0 ? '#ef4444' : CATEGORY_COLORS[cat],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total row */}
                <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Selling Price</span>
                  <span className="text-xl font-bold text-orange-600">{formatCurrency(analysis.selling_price)}</span>
                </div>
              </div>

              {/* Profitability insight */}
              <div className={`rounded-xl border p-5 ${analysis.is_profitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${analysis.is_profitable ? 'bg-green-100' : 'bg-red-100'}`}>
                    {analysis.is_profitable
                      ? <TrendingUp className="w-5 h-5 text-green-600" />
                      : <TrendingDown className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className={`font-semibold ${analysis.is_profitable ? 'text-green-900' : 'text-red-900'}`}>
                      {analysis.is_profitable
                        ? analysis.margin_pct >= 20
                          ? 'Strong profitability — your margin is healthy'
                          : analysis.margin_pct >= 10
                            ? 'Good profitability — consider optimizing input costs'
                            : 'Low margin — review your cost structure'
                        : 'Selling below cost — you are losing money on this product'
                      }
                    </p>
                    <p className={`text-sm mt-1 ${analysis.is_profitable ? 'text-green-700' : 'text-red-700'}`}>
                      {analysis.is_profitable
                        ? `You earn ${formatCurrency(analysis.margin_rwf)} per ${listing.material?.unit} after all costs.`
                        : `You lose ${formatCurrency(Math.abs(analysis.margin_rwf))} per ${listing.material?.unit}. Consider raising your price or reducing costs.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed entries table */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Detailed Cost Entries</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        <th className="text-left py-2 text-neutral-500 font-medium">Stage</th>
                        <th className="text-left py-2 text-neutral-500 font-medium">Category</th>
                        <th className="text-right py-2 text-neutral-500 font-medium">Cost (RWF)</th>
                        <th className="text-right py-2 text-neutral-500 font-medium">% of price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.entries.map((entry, i) => (
                        <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50">
                          <td className="py-2.5 text-neutral-900">{entry.stage_name}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: CATEGORY_COLORS[entry.stage_category] + '20', color: CATEGORY_COLORS[entry.stage_category] }}>
                              {CATEGORY_LABELS[entry.stage_category]}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-medium text-neutral-900">{formatCurrency(entry.cost_rwf)}</td>
                          <td className="py-2.5 text-right text-neutral-500">
                            {analysis.selling_price > 0 ? Math.round((entry.cost_rwf / analysis.selling_price) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-neutral-200">
                        <td colSpan={2} className="py-3 font-semibold text-neutral-900">Total Production Cost</td>
                        <td className="py-3 text-right font-bold text-neutral-900">{formatCurrency(analysis.total_cost)}</td>
                        <td className="py-3 text-right font-semibold text-neutral-500">
                          {analysis.selling_price > 0 ? Math.round((analysis.total_cost / analysis.selling_price) * 100) : 0}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
