import { create } from 'zustand';
import type { QuoteRequest, BuyerFavorite } from '../types/materials.types';
import { quoteRequestsService } from '../services/quoteRequests.service';
import { supabase } from '../lib/supabase';

interface MarketplaceState {
  quoteRequests: QuoteRequest[];
  favorites: BuyerFavorite[];
  listings: any[]; // Supplier listings
  loading: boolean;
  error: string | null;
  
  // Actions
  createQuoteRequest: (data: {
    buyer_id: string;
    supplier_id: string;
    listing_id: string;
    quantity: number;
    delivery_location: string;
    notes?: string;
  }) => Promise<QuoteRequest>;
  fetchBuyerRequests: (buyerId: string) => Promise<void>;
  fetchSupplierRequests: (supplierId: string) => Promise<void>;
  updateRequestStatus: (id: string, status: QuoteRequest['status']) => Promise<void>;
  addFavorite: (buyerId: string, supplierId: string) => Promise<void>;
  removeFavorite: (buyerId: string, supplierId: string) => Promise<void>;
  fetchFavorites: (buyerId: string) => Promise<void>;
  fetchListingsBySector: (sector: string) => Promise<void>;
  fetchAllListings: () => Promise<void>;
  reset: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  quoteRequests: [],
  favorites: [],
  listings: [],
  loading: false,
  error: null,

  createQuoteRequest: async (data) => {
    set({ loading: true, error: null });
    try {
      const request = await quoteRequestsService.createQuoteRequest(data);
      set((state) => ({
        quoteRequests: [request, ...state.quoteRequests],
        loading: false
      }));
      return request;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchBuyerRequests: async (buyerId) => {
    set({ loading: true, error: null });
    try {
      const requests = await quoteRequestsService.getBuyerRequests(buyerId);
      set({ quoteRequests: requests, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchSupplierRequests: async (supplierId) => {
    set({ loading: true, error: null });
    try {
      const requests = await quoteRequestsService.getSupplierRequests(supplierId);
      set({ quoteRequests: requests, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRequestStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const request = await quoteRequestsService.updateRequestStatus(id, status);
      set((state) => ({
        quoteRequests: state.quoteRequests.map(r => r.id === id ? request : r),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addFavorite: async (buyerId, supplierId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('buyer_favorites')
        .insert({ buyer_id: buyerId, supplier_id: supplierId } as any)
        .select(`
          *,
          profiles!buyer_favorites_supplier_id_fkey(id, full_name, business_name, is_verified_supplier, average_rating)
        `)
        .single();

      if (error) throw error;

      set((state) => ({
        favorites: [data, ...state.favorites],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeFavorite: async (buyerId, supplierId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('buyer_favorites')
        .delete()
        .eq('buyer_id', buyerId)
        .eq('supplier_id', supplierId);

      if (error) throw error;

      set((state) => ({
        favorites: state.favorites.filter(f => f.supplier_id !== supplierId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchFavorites: async (buyerId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('buyer_favorites')
        .select(`
          *,
          profiles!buyer_favorites_supplier_id_fkey(id, full_name, business_name, is_verified_supplier, average_rating)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ favorites: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchListingsBySector: async (sector) => {
    set({ loading: true, error: null });
    try {
      // Fetch all active listings with material data
      const { data, error } = await supabase
        .from('supplier_listings')
        .select(`
          *,
          material:materials(id, name, category, unit, icon, sector)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter by sector in JavaScript since Supabase nested filtering doesn't work reliably
      const filteredData = (data || []).filter(listing => 
        listing.material?.sector === sector
      );

      // Fetch supplier data separately for each listing
      const listingsWithSupplier = await Promise.all(
        filteredData.map(async (listing) => {
          if (listing.supplier_id) {
            try {
              const { data: supplier, error: supplierError } = await supabase
                .from('profiles')
                .select('id, full_name, business_name, location, is_verified_supplier, average_rating, total_reviews')
                .eq('id', listing.supplier_id)
                .maybeSingle(); // Use maybeSingle to avoid errors
              
              if (supplierError) {
                console.error('Error fetching supplier:', supplierError);
                return listing;
              } else {
                return { ...listing, supplier };
              }
            } catch (error) {
              console.error('Failed to fetch supplier:', error);
              return listing;
            }
          }
          return listing;
        })
      );

      set({ listings: listingsWithSupplier, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAllListings: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('supplier_listings')
        .select(`
          *,
          material:materials(id, name, category, unit, icon, sector)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Fetch supplier data separately for each listing with error handling
      const listingsWithSupplier = await Promise.all(
        (data || []).map(async (listing) => {
          if (listing.supplier_id) {
            try {
              const { data: supplier, error: supplierError } = await supabase
                .from('profiles')
                .select('id, full_name, business_name, location, is_verified_supplier, average_rating, total_reviews')
                .eq('id', listing.supplier_id)
                .maybeSingle(); // Use maybeSingle to avoid errors
              
              if (supplierError) {
                console.error('Error fetching supplier:', supplierError);
                return listing; // Return listing without supplier data
              } else {
                return { ...listing, supplier };
              }
            } catch (error) {
              console.error('Failed to fetch supplier:', error);
              return listing; // Return listing without supplier data
            }
          }
          return listing;
        })
      );

      set({ listings: listingsWithSupplier, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  reset: () => {
    set({
      quoteRequests: [],
      favorites: [],
      listings: [],
      loading: false,
      error: null
    });
  }
}));
