import { supabase } from '../lib/supabase';
import type { SupplierListing } from '../types/materials.types';

export interface CartItem {
  id: string;
  user_id: string;
  listing_id: string;
  quantity: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  listing?: SupplierListing;
}

export const cartService = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
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

  async addToCart(userId: string, listingId: string, quantity: number, notes?: string): Promise<CartItem> {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();

    if (existingItem) {
      // Update existing item
      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          notes: notes || existingItem.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          listing_id: listingId,
          quantity,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async updateCartItem(itemId: string, quantity: number, notes?: string): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getCartCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  },

  async getCartTotal(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        listing:supplier_listings(price)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    
    return (data || []).reduce((total, item) => {
      const price = item.listing?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }
};