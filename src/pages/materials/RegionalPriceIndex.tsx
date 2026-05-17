import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/currency';
import {
  ArrowLeft, MapPin, TrendingUp, TrendingDown, Minus,
  Search, Package, BarChart, ArrowRight
} from '@/lib/icons';

const RWANDA_REGIONS = [
  { id: 'Kigali', label: 'Kigali', province: 'Kigali City', color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'Musanze', label: 'Musanze', province: 'Northern', color: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  { id: 'Huye', label: 'Huye', province: 'Southern', color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { id: 'Kayonza', label: 'Kayonza', province: 'Eastern', color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { id: 'Rubavu', label: 'Rubavu', province: 'Western', color: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { id: 'Rwamagana', label: 'Rwamagana', province: 'Eastern', color: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  { id: 'Karongi', label: 'Karongi', province: 'Western', color: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
];

interface RegionalPrice {
  location: string;
  price: number;
  supplier_count: number;
}

interface MaterialPriceData {
  material_id: string;
  material_name: string;
  unit: string;
  category: string;
  sector: string;
  regions: RegionalPrice[];
  min_price: number;
  max_price: number;
  avg_price: number;
  price_spread_pct: number;
  cheapest_region: string;
  most_expensive_region: string;
}

export default function RegionalPriceIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState<MaterialPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPriceData | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);

  useEffect(() => {
    loadRegionalPrices();
  }, []);

  const loadRegionalPrices = async () => {
    setLoading(true);
    try {
      // Fetch all active listings with material and location
      const { data: listings, error } = await supabase
        .from('supplier_listings')
        .select(`
          id, price, location,
          material:materials(id, name, unit, category, sector)
        `)
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by material, then by location
      const materialMap = new Map<string, {
        material: any;
        byRegion: Map<string, number[]>;
      }>();

      (listings || []).forEach((listing: any) => {
        if (!listing.material || !listing.location) return;
        const matId = listing.material.id;
        const region = RWANDA_REGIONS.find(r =>
          listing.location.toLowerCase().includes(r.id.toLowerCase())
        );
        if (!region) return;

        if (!materialMap.has(matId)) {
          materialMap.set(matId, { material: listing.material, byRegion: new Map() });
        }
        const entry = materialMap.get(matId)!;
        if (!entry.byRegion.has(region.id)) {
          entry.byRegion.set(region.id, []);
        }
        entry.byRegion.get(region.id)!.push(listing.price);
      });

      // Build MaterialPriceData array — only materials with 2+ regions
      const result: MaterialPriceData[] = [];
      materialMap.forEach(({ material, byRegion }) => {
        if (byRegion.size < 2) return; // need at least 2 regions to compare

        const regions: RegionalPrice[] = [];
        byRegion.forEach((prices, location) => {
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          regions.push({ location, price: Math.round(avg), supplier_count: prices.length });
        });

        const prices = regions.map(r => r.price);
        const min_price = Math.min(...prices);
        const max_price = Math.max(...prices);
        const avg_price = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const price_spread_pct = Math.round(((max_price - min_price) / min_price) * 100);
        const cheapest = regions.reduce((a, b) => a.price < b.price ? a : b);
        const mostExpensive = regions.reduce((a, b) => a.price > b.price ? a : b);

        result.push({
          material_id: material.id,
          material_name: material.name,
          unit: material.unit,
          category: material.category,
          sector: material.sector || material.category,
          regions,
          min_price,
          max_price,
          avg_price,
          price_spread_pct,
          cheapest_region: cheapest.location,
          most_expensive_region: mostExpensive.location,
        });
      });

      result.sort((a, b) => b.price_spread_pct - a.price_spread_pct);
      setData(result);

      const uniqueSectors = [...new Set(result.map(r => r.sector).filter(Boolean))];
      setSectors(uniqueSectors);

      if (result.length > 0) setSelectedMaterial(result[0]);
    } catch (err) {
      console.error('Error loading regional prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(item => {
    const matchSearch = !searchQuery || item.material_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector = !sectorFilter || item.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  const getRegionStyle = (regionId: string) => {
    return RWANDA_REGIONS.find(r => r.id === regionId) || RWANDA_REGIONS[0];
  };

  const getPriceBar = (price: number, min: number, max: number) => {
    if (max === min) return 50;
    return Math.round(((price - min) / (max - min)) * 100);
  };

  const getPriceDiff = (price: number, avg: number) => {
    const diff = ((price - avg) / avg) * 100;
    return diff;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-64" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-neutral-200 rounded-xl" />)}
              </div>
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-neutral-200 rounded-xl" />)}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Header */}
          <button onClick={() => navigate('/materials/trends')} className="btn-secondary mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Price Index
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900">Regional Price Comparison</h1>
            </div>
            <p className="text-neutral-600">
              Compare prices across Rwanda's provinces — find where to buy cheapest and where to sell highest.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{data.length}</div>
              <div className="text-sm text-neutral-600">Products Compared</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{RWANDA_REGIONS.length}</div>
              <div className="text-sm text-neutral-600">Regions Tracked</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.length > 0 ? Math.round(data.reduce((s, d) => s + d.price_spread_pct, 0) / data.length) : 0}%
              </div>
              <div className="text-sm text-neutral-600">Avg Price Spread</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{sectors.length}</div>
              <div className="text-sm text-neutral-600">Sectors</div>
            </div>
          </div>

          {/* Region legend */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-3">Regions</p>
            <div className="flex flex-wrap gap-2">
              {RWANDA_REGIONS.map(r => (
                <div key={r.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${r.light} ${r.text} border ${r.border}`}>
                  <div className={`w-2 h-2 rounded-full ${r.color}`} />
                  {r.label} · {r.province}
                </div>
              ))}
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
            </div>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white capitalize"
            >
              <option value="">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-16 text-center">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No regional price data yet</p>
              <p className="text-sm text-neutral-400 mt-1">
                Regional comparison requires listings from at least 2 different locations for the same product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(item => (
                <div
                  key={item.material_id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all"
                >
                  {/* Header row */}
                  <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Package className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{item.material_name}</h3>
                        <p className="text-xs text-neutral-500 capitalize">{item.sector} · per {item.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Price spread badge */}
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.price_spread_pct > 30 ? 'bg-red-50 text-red-700' :
                        item.price_spread_pct > 15 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {item.price_spread_pct > 15 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {item.price_spread_pct}% spread
                      </div>
                      <button
                        onClick={() => navigate(`/materials/${item.material_id}`)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Regional price bars */}
                  <div className="px-5 py-4">
                    <div className="space-y-3">
                      {item.regions
                        .sort((a, b) => a.price - b.price)
                        .map(region => {
                          const regionStyle = getRegionStyle(region.location);
                          const barWidth = getPriceBar(region.price, item.min_price, item.max_price);
                          const diff = getPriceDiff(region.price, item.avg_price);
                          const isCheapest = region.location === item.cheapest_region;
                          const isMostExpensive = region.location === item.most_expensive_region;

                          return (
                            <div key={region.location} className="flex items-center gap-3">
                              {/* Region label */}
                              <div className="w-24 flex-shrink-0">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-2.5 h-2.5 rounded-full ${regionStyle.color}`} />
                                  <span className="text-sm font-medium text-neutral-700">{region.location}</span>
                                </div>
                                <span className="text-xs text-neutral-400 ml-4">{region.supplier_count} supplier{region.supplier_count !== 1 ? 's' : ''}</span>
                              </div>

                              {/* Bar */}
                              <div className="flex-1 relative">
                                <div className="w-full bg-neutral-100 rounded-full h-5 overflow-hidden">
                                  <div
                                    className={`h-5 rounded-full transition-all ${regionStyle.color} opacity-80`}
                                    style={{ width: `${Math.max(barWidth, 8)}%` }}
                                  />
                                </div>
                              </div>

                              {/* Price + diff */}
                              <div className="w-36 flex-shrink-0 flex items-center justify-end gap-2">
                                <span className="font-semibold text-neutral-900 text-sm">
                                  {formatCurrency(region.price)}
                                </span>
                                {isCheapest && item.regions.length > 1 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                    Cheapest
                                  </span>
                                )}
                                {isMostExpensive && item.regions.length > 1 && (
                                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                                    Highest
                                  </span>
                                )}
                                {!isCheapest && !isMostExpensive && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    diff > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                  }`}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary insight */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        Avg: <span className="font-medium text-neutral-700">{formatCurrency(item.avg_price)}</span>
                        {' · '}
                        Range: <span className="font-medium text-green-600">{formatCurrency(item.min_price)}</span>
                        {' – '}
                        <span className="font-medium text-red-600">{formatCurrency(item.max_price)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        Save {formatCurrency(item.max_price - item.min_price)} by buying in {item.cheapest_region}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
