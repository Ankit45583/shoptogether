import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const exists = state.cartItems.find((i) => i.id === item.id);
      if (exists) return state;
      return { cartItems: [...state.cartItems, item] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== itemId),
    })),

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
