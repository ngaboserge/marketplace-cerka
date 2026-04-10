import { supabase } from '../lib/supabase';
import type { SupplierListing } from '../types/materials.types';

export interface WishlistItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: SupplierListing;
}

export const wishlistService = {
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        listing:supplier_listings(
          *,
          material:materials(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addToWishlist(userId: string, listingId: string): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        listing_id: listingId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromWishlist(userId: string, listingId: string): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) throw error;
  },

  async isInWishlist(userId: string, listingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async getWishlistCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }
};