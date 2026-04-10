import { create } from 'zustand';
import { statsService, type PlatformStats } from '../services/stats.service';

interface StatsStore {
  stats: PlatformStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: {
    totalSuppliers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalReviews: 0,
    totalListings: 0
  },
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await statsService.getPlatformStats();
      set({ stats, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));