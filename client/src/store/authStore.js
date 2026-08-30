import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/apiClient';

const useAuthStore = create(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => set({ userInfo: user }),
      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } catch (error) {
          console.error('Logout failed:', error);
        }
        set({ userInfo: null });
      },
    }),
    {
      name: 'mfdesigns-auth-storage',
    }
  )
);

export default useAuthStore;
