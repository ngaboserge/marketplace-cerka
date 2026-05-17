import { supabase } from '../lib/supabase';
import type { QuoteRequest } from '../types/materials.types';
import { notificationsService } from './notifications.service';

// Helper: enrich quote requests with listing and profile data
async function enrichRequests(requests: any[]): Promise<any[]> {
  if (!requests.length) return [];

  return Promise.all(
    requests.map(async (req) => {
      // Fetch listing + material
      let listing = null;
      if (req.listing_id) {
        const { data } = await supabase
          .from('supplier_listings')
          .select('*, material:materials(id, name, unit, category, sector)')
          .eq('id', req.listing_id)
          .maybeSingle();
        listing = data;
      }

      // Fetch supplier profile
      let supplier = null;
      if (req.supplier_id) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, business_name, location, phone')
          .eq('id', req.supplier_id)
          .maybeSingle();
        supplier = data;
      }

      // Fetch buyer profile
      let buyer = null;
      if (req.buyer_id) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, business_name')
          .eq('id', req.buyer_id)
          .maybeSingle();
        buyer = data;
      }

      // Normalize: expose 'notes' as alias for 'message' for UI compatibility
      return { ...req, listing, supplier, buyer, notes: req.message };
    })
  );
}

export const quoteRequestsService = {
  async createQuoteRequest(data: {
    buyer_id: string;
    supplier_id: string;
    listing_id: string;
    quantity: number;
    delivery_location: string;
    notes?: string;
  }): Promise<QuoteRequest> {
    // First fetch the listing to get material_id (required by the table)
    const { data: listing, error: listingError } = await supabase
      .from('supplier_listings')
      .select('material_id')
      .eq('id', data.listing_id)
      .single();

    if (listingError || !listing) throw new Error('Listing not found');

    // Insert the quote request with all required fields
    const { data: quoteRequest, error } = await supabase
      .from('quote_requests')
      .insert({
        buyer_id: data.buyer_id,
        supplier_id: data.supplier_id,
        listing_id: data.listing_id,
        material_id: listing.material_id,
        quantity: data.quantity,
        delivery_location: data.delivery_location,
        message: data.notes || null,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) throw error;

    // Send notification to supplier (best effort)
    try {
      await notificationsService.createNotification({
        user_id: data.supplier_id,
        type: 'quote_request',
        title: 'New Quote Request',
        message: `You have received a new quote request`,
        data: { quote_request_id: quoteRequest.id }
      });
    } catch (notifError) {
      console.warn('Notification failed (non-critical):', notifError);
    }

    // Return enriched request
    const [enriched] = await enrichRequests([quoteRequest]);
    return enriched;
  },

  async getBuyerRequests(buyerId: string): Promise<QuoteRequest[]> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return enrichRequests(data || []);
  },

  async getSupplierRequests(supplierId: string): Promise<QuoteRequest[]> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return enrichRequests(data || []);
  },

  async updateRequestStatus(id: string, status: QuoteRequest['status']): Promise<QuoteRequest> {
    const { data, error } = await supabase
      .from('quote_requests')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    const [enriched] = await enrichRequests([data]);
    return enriched;
  }
};
