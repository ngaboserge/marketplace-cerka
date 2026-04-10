// Updated database types for marketplace
// Replace the content of src/lib/database.types.ts with this

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'buyer' | 'supplier' | 'contributor' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deactivated';
export type ListingStatus = 'active' | 'inactive' | 'deleted';
export type QuoteStatus = 'pending' | 'responded' | 'accepted' | 'declined' | 'cancelled';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type PriceSubmissionStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type MaterialStatus = 'active' | 'pending' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          name: string | null;
          business_name: string | null;
          avatar_url: string | null;
          platform_preference: string | null;
          platform_selected_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          name?: string | null;
          business_name?: string | null;
          avatar_url?: string | null;
          platform_preference?: string | null;
          platform_selected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          name?: string | null;
          business_name?: string | null;
          avatar_url?: string | null;
          platform_preference?: string | null;
          platform_selected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          company_type: string | null;
          company_description: string | null;
          company_website: string | null;
          company_size: string | null;
          industry: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          company_type?: string | null;
          company_description?: string | null;
          company_website?: string | null;
          company_size?: string | null;
          industry?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string | null;
          company_type?: string | null;
          company_description?: string | null;
          company_website?: string | null;
          company_size?: string | null;
          industry?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          name: string;
          unit: string;
          category: string;
          subcategory: string | null;
          description: string | null;
          specifications: Json | null;
          keywords: string[] | null;
          sector: string | null;
          icon: string | null;
          created_by: string | null;
          is_custom: boolean | null;
          status: MaterialStatus | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          unit: string;
          category: string;
          subcategory?: string | null;
          description?: string | null;
          specifications?: Json | null;
          keywords?: string[] | null;
          sector?: string | null;
          icon?: string | null;
          created_by?: string | null;
          is_custom?: boolean | null;
          status?: MaterialStatus | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          unit?: string;
          category?: string;
          subcategory?: string | null;
          description?: string | null;
          specifications?: Json | null;
          keywords?: string[] | null;
          sector?: string | null;
          icon?: string | null;
          created_by?: string | null;
          is_custom?: boolean | null;
          status?: MaterialStatus | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          supplier_id: string;
          material_id: string;
          price: number;
          min_quantity: number | null;
          location: string;
          city: string | null;
          area: string | null;
          delivery_info: string | null;
          description: string | null;
          photos: string[] | null;
          contact_phone: string | null;
          contact_whatsapp: string | null;
          status: ListingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          material_id: string;
          price: number;
          min_quantity?: number | null;
          location: string;
          city?: string | null;
          area?: string | null;
          delivery_info?: string | null;
          description?: string | null;
          photos?: string[] | null;
          contact_phone?: string | null;
          contact_whatsapp?: string | null;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          material_id?: string;
          price?: number;
          min_quantity?: number | null;
          location?: string;
          city?: string | null;
          area?: string | null;
          delivery_info?: string | null;
          description?: string | null;
          photos?: string[] | null;
          contact_phone?: string | null;
          contact_whatsapp?: string | null;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      listing_analytics: {
        Row: {
          id: string;
          listing_id: string;
          view_count: number;
          quote_request_count: number;
          contact_count: number;
          last_viewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          view_count?: number;
          quote_request_count?: number;
          contact_count?: number;
          last_viewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          view_count?: number;
          quote_request_count?: number;
          contact_count?: number;
          last_viewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          listing_id: string;
          quantity: number;
          delivery_location: string;
          notes: string | null;
          status: QuoteStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          supplier_id: string;
          listing_id: string;
          quantity: number;
          delivery_location: string;
          notes?: string | null;
          status?: QuoteStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          supplier_id?: string;
          listing_id?: string;
          quantity?: number;
          delivery_location?: string;
          notes?: string | null;
          status?: QuoteStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_ratings: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          rating: number;
          review: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          supplier_id: string;
          rating: number;
          review?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          supplier_id?: string;
          rating?: number;
          review?: string | null;
          created_at?: string;
        };
      };
      buyer_favorites: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          supplier_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          supplier_id?: string;
          created_at?: string;
        };
      };
      verification_requests: {
        Row: {
          id: string;
          user_id: string;
          status: VerificationStatus;
          documents: string[] | null;
          business_name: string | null;
          business_description: string | null;
          created_at: string;
          processed_at: string | null;
          processed_by: string | null;
          admin_notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: VerificationStatus;
          documents?: string[] | null;
          business_name?: string | null;
          business_description?: string | null;
          created_at?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          admin_notes?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: VerificationStatus;
          documents?: string[] | null;
          business_name?: string | null;
          business_description?: string | null;
          created_at?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          admin_notes?: string | null;
          updated_at?: string;
        };
      };
      price_submissions: {
        Row: {
          id: string;
          user_id: string | null;
          material_id: string | null;
          price: number | null;
          quantity: number | null;
          location: string | null;
          gps_latitude: number | null;
          gps_longitude: number | null;
          photo_url: string | null;
          thumbnail_url: string | null;
          notes: string | null;
          status: PriceSubmissionStatus | null;
          submitted_at: string | null;
          moderated_at: string | null;
          moderated_by: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          material_id?: string | null;
          price?: number | null;
          quantity?: number | null;
          location?: string | null;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          photo_url?: string | null;
          thumbnail_url?: string | null;
          notes?: string | null;
          status?: PriceSubmissionStatus | null;
          submitted_at?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          material_id?: string | null;
          price?: number | null;
          quantity?: number | null;
          location?: string | null;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          photo_url?: string | null;
          thumbnail_url?: string | null;
          notes?: string | null;
          status?: PriceSubmissionStatus | null;
          submitted_at?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participant_1_id: string | null;
          participant_2_id: string | null;
          last_message_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          participant_1_id?: string | null;
          participant_2_id?: string | null;
          last_message_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          participant_1_id?: string | null;
          participant_2_id?: string | null;
          last_message_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string | null;
          sender_id: string | null;
          content: string | null;
          read: boolean | null;
          read_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id?: string | null;
          sender_id?: string | null;
          content?: string | null;
          read?: boolean | null;
          read_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          conversation_id?: string | null;
          sender_id?: string | null;
          content?: string | null;
          read?: boolean | null;
          read_at?: string | null;
          created_at?: string | null;
        };
      };
      aggregated_prices: {
        Row: {
          id: string;
          material_id: string;
          location: string;
          median_price: number;
          min_price: number;
          max_price: number;
          submission_count: number;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          material_id: string;
          location: string;
          median_price: number;
          min_price: number;
          max_price: number;
          submission_count: number;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          material_id?: string;
          location?: string;
          median_price?: number;
          min_price?: number;
          max_price?: number;
          submission_count?: number;
          last_updated?: string;
          created_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          material_id: string;
          location: string;
          date: string;
          median_price: number;
          min_price: number;
          max_price: number;
          submission_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          material_id: string;
          location: string;
          date: string;
          median_price: number;
          min_price: number;
          max_price: number;
          submission_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          material_id?: string;
          location?: string;
          date?: string;
          median_price?: number;
          min_price?: number;
          max_price?: number;
          submission_count?: number;
          created_at?: string;
        };
      };
      reliability_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          total_submissions: number;
          approved_count: number;
          rejected_count: number;
          flagged_count: number;
          consistency_bonus: number;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score?: number;
          total_submissions?: number;
          approved_count?: number;
          rejected_count?: number;
          flagged_count?: number;
          consistency_bonus?: number;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          total_submissions?: number;
          approved_count?: number;
          rejected_count?: number;
          flagged_count?: number;
          consistency_bonus?: number;
          last_updated?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: UserRole;
      listing_status: ListingStatus;
      quote_status: QuoteStatus;
      verification_status: VerificationStatus;
      price_submission_status: PriceSubmissionStatus;
      material_status: MaterialStatus;
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SupplierProfile = Database['public']['Tables']['supplier_profiles']['Row'];
export type Material = Database['public']['Tables']['materials']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingAnalytics = Database['public']['Tables']['listing_analytics']['Row'];
export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'];
export type SupplierRating = Database['public']['Tables']['supplier_ratings']['Row'];
export type BuyerFavorite = Database['public']['Tables']['buyer_favorites']['Row'];
export type VerificationRequest = Database['public']['Tables']['verification_requests']['Row'];
export type PriceSubmission = Database['public']['Tables']['price_submissions']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type AggregatedPrice = Database['public']['Tables']['aggregated_prices']['Row'];
export type PriceHistory = Database['public']['Tables']['price_history']['Row'];
export type ReliabilityScore = Database['public']['Tables']['reliability_scores']['Row'];