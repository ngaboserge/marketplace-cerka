import { create } from 'zustand';
import { wishlistService, type WishlistItem } from '../services/wishlist.service';
import { useAuthStore } from './authStore';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: { listing_id: string; title: string; price: number; image: string; supplier_name: string }) => Promise<void>;
  removeFromWishlist: (listingId: string) => Promise<void>;
  isInWishlist: (listingId: string) => boolean;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    set({ loading: true, error: null });
    try {
      const items = await wishlistService.getWishlistItems(user.id);
      set({ items, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('Error fetching wishlist:', error);
    }
  },

  addToWishlist: async (item) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) throw new Error('User not authenticated');

    set({ loading: true, error: null });
    try {
      const newItem = await wishlistService.addToWishlist(user.id, item.listing_id);
      set((state) => ({
        items: [newItem, ...state.items],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeFromWishlist: async (listingId: string) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) throw new Error('User not authenticated');

    set({ loading: true, error: null });
    try {
      await wishlistService.removeFromWishlist(user.id, listingId);
      set((state) => ({
        items: state.items.filter(item => item.listing_id !== listingId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  isInWishlist: (listingId: string) => {
    if (!listingId) return false;
    const { items } = get();
    return items.some(item => item.listing_id === listingId);
  },

  reset: () => {
    set({
      items: [],
      loading: false,
      error: null
    });
  }
}));