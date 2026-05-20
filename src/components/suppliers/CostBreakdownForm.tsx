import { useState, useEffect } from 'react';
import { costBreakdownService, CATEGORY_LABELS, CATEGORY_COLORS, type CostEntry, type CostStageTemplate, type StageCategory } from '@/services/costBreakdown.service';
import { formatCurrency } from '@/lib/currency';
import { Plus, X, TrendingUp, TrendingDown } from '@/lib/icons';

interface CostBreakdownFormProps {
  listingId: string;
  supplierId: string;
  sellingPrice: number;
  sector: string;
  onSaved?: () => void;
}

const EMPTY_ENTRY = (category: StageCategory = 'input'): Omit<CostEntry, 'listing_id' | 'supplier_id'> => ({
  stage_name: '',
  stage_category: category,
  cost_rwf: 0,
  notes: '',
});

export function CostBreakdownForm({ listingId, supplierId, sellingPrice, sector, onSaved }: CostBreakdownFormProps) {
  const [templates, setTemplates] = useState<CostStageTemplate[]>([]);
  const [entries, setEntries] = useState<Omit<CostEntry, 'listing_id' | 'supplier_id'>[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [listingId, sector]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tmpl, existing] = await Promise.all([
        costBreakdownService.getTemplates(sector),
        costBreakdownService.getListingCosts(listingId),
      ]);
      setTemplates(tmpl);

      if (existing.length > 0) {
        setEntries(existing.map(e => ({
          stage_template_id: e.stage_template_id,
          stage_name: e.stage_name,
          stage_category: e.stage_category,
          cost_rwf: e.cost_rwf,
          notes: e.notes || '',
          season: e.season || '',
        })));
      } else if (tmpl.length > 0) {
        // Pre-fill with templates
        setEntries(tmpl.map(t => ({
          stage_template_id: t.id,
          stage_name: t.stage_name,
          stage_category: t.stage_category,
          cost_rwf: 0,
          notes: '',
        })));
      }
    } catch (err) {
      console.error('Error loading cost data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (index: number, field: string, value: any) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
    setSaved(false);
  };

  const addEntry = () => {
    setEntries(prev => [...prev, EMPTY_ENTRY()]);
  };

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await costBreakdownService.saveCosts(listingId, supplierId, entries);
      setSaved(true);
      onSaved?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save cost breakdown');
    } finally {
      setSaving(false);
    }
  };

  // Live analysis
  const productionCost = entries
    .filter(e => e.stage_category !== 'margin' && e.cost_rwf > 0)
    .reduce((sum, e) => sum + e.cost_rwf, 0);
  const margin = sellingPrice - productionCost;
  const marginPct = sellingPrice > 0 ? Math.round((margin / sellingPrice) * 100) : 0;
  const filledEntries = entries.filter(e => e.cost_rwf > 0);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-neutral-100 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Privacy notice */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
        <span className="text-blue-500 text-lg">🔒</span>
        <div>
          <p className="text-sm font-medium text-blue-900">Private — only you can see this</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Cost data is never shown to buyers. It helps you track profitability and Cerka uses aggregated signals (no raw numbers) for market intelligence.
          </p>
        </div>
      </div>

      {/* Live margin summary */}
      {filledEntries.length > 0 && sellingPrice > 0 && (
        <div className={`rounded-xl p-4 border ${margin >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-600 mb-1">Live Margin Analysis</p>
              <div className="flex items-center gap-2">
                {margin >= 0
                  ? <TrendingUp className="w-4 h-4 text-green-600" />
                  : <TrendingDown className="w-4 h-4 text-red-600" />
                }
                <span className={`text-lg font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {marginPct}% margin
                </span>
                <span className="text-sm text-neutral-500">
                  ({formatCurrency(margin)} per unit)
                </span>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-neutral-500">Production cost</p>
              <p className="font-semibold text-neutral-800">{formatCurrency(productionCost)}</p>
              <p className="text-neutral-500 mt-1">Selling price</p>
              <p className="font-semibold text-orange-600">{formatCurrency(sellingPrice)}</p>
            </div>
          </div>

          {/* Category mini bars */}
          {sellingPrice > 0 && (
            <div className="mt-3 space-y-1.5">
              {(Object.keys(CATEGORY_LABELS) as StageCategory[])
                .filter(cat => cat !== 'margin')
                .map(cat => {
                  const catTotal = entries.filter(e => e.stage_category === cat).reduce((s, e) => s + e.cost_rwf, 0);
                  const pct = Math.round((catTotal / sellingPrice) * 100);
                  if (pct === 0) return null;
                  return (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-neutral-600 truncate">{CATEGORY_LABELS[cat]}</span>
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                        />
                      </div>
                      <span className="w-8 text-right text-neutral-600">{pct}%</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Cost entries */}
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-2 items-start bg-neutral-50 rounded-lg p-3 border border-neutral-100">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Stage name */}
              <input
                type="text"
                value={entry.stage_name}
                onChange={e => updateEntry(index, 'stage_name', e.target.value)}
                placeholder="Stage name"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              {/* Category */}
              <select
                value={entry.stage_category}
                onChange={e => updateEntry(index, 'stage_category', e.target.value)}
                className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {(Object.entries(CATEGORY_LABELS) as [StageCategory, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {/* Cost */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-500 whitespace-nowrap">RWF</span>
                <input
                  type="number"
                  value={entry.cost_rwf || ''}
                  onChange={e => updateEntry(index, 'cost_rwf', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add stage button */}
      <button
        type="button"
        onClick={addEntry}
        className="w-full py-2.5 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add cost stage
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || entries.length === 0}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50'
        }`}
      >
        {saving ? 'Saving...' : saved ? '✓ Cost breakdown saved' : 'Save Cost Breakdown'}
      </button>
    </div>
  );
}
