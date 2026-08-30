import { create } from 'zustand';

const useUIStore = create((set) => ({
  isCartOpen: false,
  isNavOpen: false,
  isSearchOpen: false,
  currency: 'PKR',
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  closeCart: () => set({ isCartOpen: false }),
  openCart: () => set({ isCartOpen: true }),
  
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  closeNav: () => set({ isNavOpen: false }),
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
  
  setCurrency: (currency) => set({ currency }),
}));

export default useUIStore;
