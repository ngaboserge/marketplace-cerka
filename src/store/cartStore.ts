import { create } from 'zustand';
import { cartService, type CartItem } from '../services/cart.service';
import { useAuthStore } from './authStore';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (item: { listing_id: string; title: string; price: number; image: string; supplier_name: string; quantity: number }) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number, notes?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    set({ loading: true, error: null });
    try {
      const items = await cartService.getCartItems(user.id);
      set({ items, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('Error fetching cart:', error);
    }
  },

  addToCart: async (item) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) throw new Error('User not authenticated');

    set({ loading: true, error: null });
    try {
      const newItem = await cartService.addToCart(user.id, item.listing_id, item.quantity);
      
      // Check if item already exists in state
      const existingItemIndex = get().items.findIndex(cartItem => cartItem.listing_id === item.listing_id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        set((state) => ({
          items: state.items.map((cartItem, index) => 
            index === existingItemIndex ? newItem : cartItem
          ),
          loading: false
        }));
      } else {
        // Add new item
        set((state) => ({
          items: [newItem, ...state.items],
          loading: false
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCartItem: async (itemId: string, quantity: number, notes?: string) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await cartService.updateCartItem(itemId, quantity, notes);
      set((state) => ({
        items: state.items.map(item => 
          item.id === itemId ? updatedItem : item
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    set({ loading: true, error: null });
    try {
      await cartService.removeFromCart(itemId);
      set((state) => ({
        items: state.items.filter(item => item.id !== itemId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearCart: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) throw new Error('User not authenticated');

    set({ loading: true, error: null });
    try {
      await cartService.clearCart(user.id);
      set({ items: [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  reset: () => {
    set({
      items: [],
      loading: false,
      error: null
    });
  }
}));