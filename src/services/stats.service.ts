import { supabase } from '../lib/supabase';

export interface PlatformStats {
  totalSuppliers: number;
  totalProducts: number;
  totalCategories: number;
  totalReviews: number;
  totalListings: number;
}

export const statsService = {
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      // Get total suppliers (users with supplier role)
      const { count: suppliersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'supplier');

      // Get total products/materials
      const { count: materialsCount } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total categories
      const { data: categoriesData } = await supabase
        .from('materials')
        .select('category')
        .eq('status', 'active');
      
      const uniqueCategories = new Set(categoriesData?.map(m => m.category) || []);

      // Get total listings
      const { count: listingsCount } = await supabase
        .from('supplier_listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total reviews (using quote_request_count as proxy for now)
      const { data: reviewsData } = await supabase
        .from('supplier_listings')
        .select('quote_request_count')
        .eq('status', 'active');

      const totalReviews = reviewsData?.reduce((sum, item) => sum + (item.quote_request_count || 0), 0) || 0;

      return {
        totalSuppliers: suppliersCount || 0,
        totalProducts: materialsCount || 0,
        totalCategories: uniqueCategories.size,
        totalReviews: Math.max(totalReviews, 0),
        totalListings: listingsCount || 0
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Return fallback stats if database fails
      return {
        totalSuppliers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalReviews: 0,
        totalListings: 0
      };
    }
  }
};