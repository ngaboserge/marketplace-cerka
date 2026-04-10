import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, supabaseUntyped, isSupabaseConfigured } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type UserRole = 'buyer' | 'supplier' | 'contributor' | 'admin';

type PlatformType = 'marketplace';

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
  platform_preference?: PlatformType;
  platform_selected_at?: string;
  // Supplier specific
  company_name?: string;
  verified?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  darkMode: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    role: UserRole;
    name: string;
    companyName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleDarkMode: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      isLoading: true,
      darkMode: false,
      error: null,

      initialize: async () => {
        // If Supabase isn't configured, just set loading to false
        if (!isSupabaseConfigured) {
          console.warn('Supabase not configured - auth disabled');
          set({ isLoading: false });
          return;
        }

        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            set({ isLoading: false });
            return;
          }
          
          if (session?.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabaseUntyped
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle(); // Use maybeSingle instead of single to avoid 406 errors

            if (profileError) {
              console.error('Profile fetch error:', profileError);
              set({ 
                isLoading: false,
                error: 'Failed to load user profile. Please contact support.'
              });
              // Sign out to prevent infinite loops
              await supabase.auth.signOut();
              return;
            }

            // If profile doesn't exist, sign out and show error
            if (!profile) {
              console.error('Profile not found for user:', session.user.id);
              set({ 
                isLoading: false,
                error: 'User profile not found. Please contact support.'
              });
              // Sign out to prevent infinite loops
              await supabase.auth.signOut();
              return;
            }

            if (profile) {
              const profileData = profile as any;
              let userProfile: UserProfile = {
                id: profileData.id,
                email: profileData.email || session.user.email || '',
                role: profileData.role,
                name: profileData.business_name || profileData.name || 'User', // Try business_name first, fallback to name
                avatar_url: profileData.avatar_url, // Include avatar_url
                platform_preference: profileData.platform_preference || 'marketplace',
                platform_selected_at: profileData.platform_selected_at,
              };

              // Fetch role-specific profile for additional data
              if (profileData.role === 'supplier') {
                const { data: supplierProfile, error: supplierError } = await supabaseUntyped
                  .from('supplier_profiles')
                  .select('*')
                  .eq('user_id', profileData.id)
                  .maybeSingle();

                if (supplierError) {
                  console.error('Supplier profile fetch error:', supplierError);
                }

                if (supplierProfile) {
                  const sp = supplierProfile as any;
                  // Override name with company name from supplier profile if available
                  if (sp.company_name) {
                    userProfile.name = sp.company_name;
                  }
                  userProfile = {
                    ...userProfile,
                    company_name: sp.company_name,
                    verified: sp.verified,
                  };
                }
              } else if (profileData.role === 'admin') {
                // Admin users use business_name from profiles or name, or default
                userProfile = {
                  ...userProfile,
                  name: profileData.business_name || profileData.name || 'Admin User',
                };
              }

              set({
                user: userProfile,
                supabaseUser: session.user,
                isAuthenticated: true,
                isLoading: false,
              });
              
              return;
            }
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, supabaseUser: null, isAuthenticated: false });
          } else if (event === 'SIGNED_IN' && session?.user) {
            // Re-fetch profile on sign in
            get().initialize();
          }
        });
      },

      login: async (email, password) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: 'Supabase not configured. Check your .env file.' };
        }
        
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
          }

          if (data.user) {
            await get().initialize();
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      register: async ({ email, password, role, name, companyName }) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: 'Supabase not configured. Check your .env file.' };
        }
        
        set({ isLoading: true, error: null });

        try {
          // 1. Create auth user without metadata (simpler approach)
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) {
            set({ isLoading: false, error: authError.message });
            return { success: false, error: authError.message };
          }

          if (!authData.user) {
            set({ isLoading: false, error: 'Registration failed' });
            return { success: false, error: 'Registration failed' };
          }

          // 2. Create profile manually
          const { error: profileError } = await supabaseUntyped
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: email,
              role: role,
              name: name,
              business_name: role === 'employer' ? (companyName || name) : name,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            set({ isLoading: false, error: `Profile creation failed: ${profileError.message}` });
            return { success: false, error: `Profile creation failed: ${profileError.message}` };
          }

          // 3. Create role-specific profile if needed
          if (role === 'supplier') {
            const { error: supplierError } = await supabaseUntyped
              .from('supplier_profiles')
              .insert({
                user_id: authData.user.id,
                company_name: companyName || name,
                company_type: 'other',
              });

            if (supplierError) {
              console.error('Supplier profile creation error:', supplierError);
              // Don't fail registration if supplier profile creation fails
            }
          }

          // 4. Initialize user state
          await get().initialize();
          
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, supabaseUser: null, isAuthenticated: false });
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user || !isSupabaseConfigured) return;

        try {
          // Update in database
          const { error } = await supabaseUntyped
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) {
            console.error('Failed to update profile:', error);
            throw error;
          }

          // Update local state immediately
          set({ user: { ...user, ...updates } });

          // If avatar_url was updated, force a full refresh to ensure consistency
          if ('avatar_url' in updates) {
            await get().initialize();
          }
        } catch (error) {
          console.error('Profile update error:', error);
          throw error;
        }
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
      }),
    }
  )
);
