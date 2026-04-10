import { supabase } from '../lib/supabase';
import type { SupplierListing, ListingAnalytics, SearchFilters, ListingForm } from '../types/materials.types';

export const suppliersService = {
  async createListing(formData: any, supplierId: string): Promise<SupplierListing> {
    // Handle photos - can be File objects or already-uploaded URLs
    let photoUrls: string[] = [];
    
    if (formData.photos && formData.photos.length > 0) {
      // Check if photos are File objects or URLs
      if (formData.photos[0] instanceof File) {
        // Upload File objects
        photoUrls = await this.uploadPhotos(formData.photos as File[], supplierId);
      } else {
        // Already uploaded URLs
        photoUrls = formData.photos as string[];
      }
    }

    // Use the data as provided by the frontend (which now includes title)
    const listingData = {
      supplier_id: supplierId,
      ...formData,
      photos: photoUrls.length > 0 ? photoUrls : null,
    };

    const { data, error } = await supabase
      .from('supplier_listings')
      .insert(listingData as any)
      .select('*, material:materials(*)')
      .single();

    if (error) throw error;
    return data as SupplierListing;
  },

  async updateListing(id: string, updates: Partial<ListingForm>): Promise<SupplierListing> {
    const { data, error } = await supabase
      .from('supplier_listings')
      .update(updates as any)
      .eq('id', id)
      .select('*, material:materials(*)')
      .single();

    if (error) throw error;
    return data as SupplierListing;
  },

  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('supplier_listings')
      .update({ status: 'inactive' } as any)
      .eq('id', id);

    if (error) throw error;
  },

  async reactivateListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('supplier_listings')
      .update({ status: 'active' } as any)
      .eq('id', id);

    if (error) throw error;
  },

  async getSupplierListings(supplierId: string): Promise<SupplierListing[]> {
    const { data, error } = await supabase
      .from('supplier_listings')
      .select(`
        *,
        material:materials(*)
      `)
      .eq('supplier_id', supplierId)
      .in('status', ['active', 'inactive'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch supplier data separately for each listing
    const listingsWithSupplier = await Promise.all(
      (data || []).map(async (listing) => {
        if (listing.supplier_id) {
          const { data: supplier } = await supabase
            .from('profiles')
            .select('id, full_name, business_name, location, is_verified_supplier, average_rating, total_reviews')
            .eq('id', listing.supplier_id)
            .single();
          
          return { ...listing, supplier };
        }
        return listing;
      })
    );

    return listingsWithSupplier;
  },

  async searchListings(filters: SearchFilters): Promise<SupplierListing[]> {
    let query = supabase
      .from('supplier_listings')
      .select(`
        *,
        material:materials(*)
      `)
      .eq('status', 'active');

    if (filters.material_id) {
      query = query.eq('material_id', filters.material_id);
    }
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as SupplierListing[];
  },

  async getListingAnalytics(listingId: string): Promise<ListingAnalytics | null> {
    const { data, error } = await supabase
      .from('listing_analytics')
      .select('*')
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as ListingAnalytics | null;
  },

  async recordView(listingId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_listing_view', {
      listing_id: listingId
    } as any);

    // If RPC doesn't exist, fallback to manual update
    if (error) {
      const analytics = await this.getListingAnalytics(listingId);
      if (analytics) {
        await supabase
          .from('listing_analytics')
          .update({
            view_count: analytics.view_count + 1,
            last_viewed_at: new Date().toISOString()
          } as any)
          .eq('listing_id', listingId);
      }
    }
  },

  async uploadPhotos(files: File[], supplierId: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      // Validate file format - accept multiple MIME types for same format
      const validFormats = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/jpe', // Alternative JPEG MIME type
        'image/pjpeg' // Progressive JPEG
      ];
      
      if (!validFormats.includes(file.type.toLowerCase())) {
        throw new Error(`Invalid photo format: ${file.type}. Only JPEG, PNG, and WebP are allowed.`);
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Photo size must be less than 5MB');
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${supplierId}/${timestamp}_${randomStr}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    return urls;
  },

  async getListing(id: string): Promise<SupplierListing | null> {
    const { data, error } = await supabase
      .from('supplier_listings')
      .select(`
        *,
        material:materials(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch supplier data separately
    if (data && data.supplier_id) {
      const { data: supplier } = await supabase
        .from('profiles')
        .select('id, full_name, business_name, location, is_verified_supplier, average_rating, total_reviews')
        .eq('id', data.supplier_id)
        .single();
      
      return { ...data, supplier };
    }

    return data;
  }
};
