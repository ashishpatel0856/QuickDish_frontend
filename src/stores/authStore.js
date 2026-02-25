import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (userData, tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('userRole', userData.role); // Store role
        
        set({ 
          user: userData, 
          isAuthenticated: true,
          error: null 
        });
      },

      // Logout
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        set({ user: null, isAuthenticated: false });
      },

      
      getUserRole: () => get().user?.role || localStorage.getItem('userRole'),
      isOwner: () => {
        const role = get().getUserRole();
        return role === 'ROLE_RESTAURANT_OWNER';
      },
      isAdmin: () => {
        const role = get().getUserRole();
        return role === 'ROLE_ADMIN';
      },
      isCustomer: () => {
        const role = get().getUserRole();
        return role === 'ROLE_CUSTOMER';
      },

      setUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);