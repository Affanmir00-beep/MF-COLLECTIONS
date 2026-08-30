import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size) => set((state) => {
        const pId = product._id || product.id;
        const variant = product.variants?.find(v => v.size === size);
        const maxStock = variant !== undefined ? variant.stock : 999;
        
        const existingItem = state.items.find(i => (i.product._id === pId || i.product.id === pId) && i.size === size);
        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + 1, maxStock);
          return {
            items: state.items.map(i => 
              (i.product._id === pId || i.product.id === pId) && i.size === size 
                ? { ...i, quantity: newQty } 
                : i
            )
          };
        }
        if (maxStock <= 0) return { items: state.items };
        return { items: [...state.items, { product, size, quantity: 1, price: product.price }] };
      }),
      removeItem: (productId, size) => set((state) => ({
        items: state.items.filter(i => !((i.product._id === productId || i.product.id === productId) && i.size === size))
      })),
      updateQuantity: (productId, size, quantity) => set((state) => ({
        items: state.items.map(i => {
          if ((i.product._id === productId || i.product.id === productId) && i.size === size) {
            const variant = i.product.variants?.find(v => v.size === size);
            const maxStock = variant !== undefined ? variant.stock : 999;
            const validQty = Math.min(Math.max(1, quantity), maxStock);
            return { ...i, quantity: validQty };
          }
          return i;
        })
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'mfdesigns-cart-storage',
    }
  )
);

export default useCartStore;
