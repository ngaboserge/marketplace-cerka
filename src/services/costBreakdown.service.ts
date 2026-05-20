import { supabase } from '../lib/supabase';

export type StageCategory = 'input' | 'labor' | 'processing' | 'transport' | 'overhead' | 'margin';

export interface CostStageTemplate {
  id: string;
  sector: string;
  stage_order: number;
  stage_name: string;
  stage_category: StageCategory;
  unit_hint: string;
  description: string;
  is_required: boolean;
}

export interface CostEntry {
  id?: string;
  listing_id: string;
  supplier_id: string;
  stage_template_id?: string;
  stage_name: string;
  stage_category: StageCategory;
  cost_rwf: number;
  notes?: string;
  season?: string;
}

export interface CostAnalysis {
  total_cost: number;
  selling_price: number;
  margin_rwf: number;
  margin_pct: number;
  is_profitable: boolean;
  by_category: Record<StageCategory, number>;
  by_category_pct: Record<StageCategory, number>;
  entries: CostEntry[];
}

export const CATEGORY_LABELS: Record<StageCategory, string> = {
  input:      'Raw Inputs',
  labor:      'Labor',
  processing: 'Processing',
  transport:  'Transport',
  overhead:   'Overhead',
  margin:     'Your Margin',
};

export const CATEGORY_COLORS: Record<StageCategory, string> = {
  input:      '#f97316',
  labor:      '#3b82f6',
  processing: '#8b5cf6',
  transport:  '#10b981',
  overhead:   '#f59e0b',
  margin:     '#22c55e',
};

export const costBreakdownService = {
  // Get templates for a sector
  async getTemplates(sector: string): Promise<CostStageTemplate[]> {
    const { data, error } = await supabase
      .from('cost_stage_templates')
      .select('*')
      .eq('sector', sector)
      .order('stage_order');
    if (error) throw error;
    return data || [];
  },

  // Get cost entries for a listing (private — only owner can call)
  async getListingCosts(listingId: string): Promise<CostEntry[]> {
    const { data, error } = await supabase
      .from('listing_cost_breakdown')
      .select('*')
      .eq('listing_id', listingId)
      .order('stage_category');
    if (error) throw error;
    return data || [];
  },

  // Save all cost entries for a listing (upsert)
  async saveCosts(listingId: string, supplierId: string, entries: Omit<CostEntry, 'listing_id' | 'supplier_id'>[]): Promise<void> {
    // Delete existing entries for this listing
    await supabase
      .from('listing_cost_breakdown')
      .delete()
      .eq('listing_id', listingId)
      .eq('supplier_id', supplierId);

    if (entries.length === 0) return;

    const rows = entries
      .filter(e => e.cost_rwf > 0)
      .map(e => ({
        listing_id: listingId,
        supplier_id: supplierId,
        stage_template_id: e.stage_template_id || null,
        stage_name: e.stage_name,
        stage_category: e.stage_category,
        cost_rwf: e.cost_rwf,
        notes: e.notes || null,
        season: e.season || null,
      }));

    if (rows.length === 0) return;

    const { error } = await supabase
      .from('listing_cost_breakdown')
      .insert(rows);
    if (error) throw error;
  },

  // Compute analysis from entries + selling price
  analyzecosts(entries: CostEntry[], sellingPrice: number): CostAnalysis {
    const byCategory: Record<StageCategory, number> = {
      input: 0, labor: 0, processing: 0, transport: 0, overhead: 0, margin: 0,
    };

    // Sum all non-margin costs
    let productionCost = 0;
    for (const e of entries) {
      if (e.stage_category !== 'margin') {
        byCategory[e.stage_category] += e.cost_rwf;
        productionCost += e.cost_rwf;
      }
    }

    // Margin = selling price - production cost
    const margin_rwf = sellingPrice - productionCost;
    byCategory.margin = Math.max(0, margin_rwf);
    const total_cost = productionCost;

    const byCategoryPct: Record<StageCategory, number> = {
      input: 0, labor: 0, processing: 0, transport: 0, overhead: 0, margin: 0,
    };
    if (sellingPrice > 0) {
      for (const cat of Object.keys(byCategory) as StageCategory[]) {
        byCategoryPct[cat] = Math.round((byCategory[cat] / sellingPrice) * 100);
      }
    }

    return {
      total_cost,
      selling_price: sellingPrice,
      margin_rwf,
      margin_pct: sellingPrice > 0 ? Math.round((margin_rwf / sellingPrice) * 100) : 0,
      is_profitable: margin_rwf > 0,
      by_category: byCategory,
      by_category_pct: byCategoryPct,
      entries,
    };
  },

  // Get all listings with cost data for a supplier (for dashboard)
  async getSupplierCostSummary(supplierId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('listing_cost_breakdown')
      .select(`
        listing_id,
        cost_rwf,
        stage_category,
        supplier_listings!inner(id, title, price, location, material:materials(name, unit, sector))
      `)
      .eq('supplier_id', supplierId);

    if (error) throw error;

    // Group by listing
    const listingMap = new Map<string, any>();
    for (const row of (data || [])) {
      const listing = (row as any).supplier_listings;
      if (!listingMap.has(row.listing_id)) {
        listingMap.set(row.listing_id, {
          listing_id: row.listing_id,
          title: listing?.title,
          price: listing?.price,
          location: listing?.location,
          material: listing?.material,
          total_cost: 0,
          entry_count: 0,
        });
      }
      const entry = listingMap.get(row.listing_id)!;
      if (row.stage_category !== 'margin') {
        entry.total_cost += row.cost_rwf;
      }
      entry.entry_count += 1;
    }

    return Array.from(listingMap.values()).map(e => ({
      ...e,
      margin_rwf: e.price - e.total_cost,
      margin_pct: e.price > 0 ? Math.round(((e.price - e.total_cost) / e.price) * 100) : 0,
    }));
  },
};
