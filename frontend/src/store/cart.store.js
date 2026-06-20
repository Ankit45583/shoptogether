import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: null,           // Full cart object from backend
  cartItems: [],        // Items array
  totalItems: 0,
  totalPrice: 0,
  loading: false,

  /* Set full cart from backend */
  setCart: (cart) =>
    set({
      cart,
      cartItems: cart?.items || [],
      totalItems: cart?.totalItems || 0,
      totalPrice: cart?.totalPrice || 0,
    }),

  /* Clear cart locally */
  clearCart: () =>
    set({
      cart: null,
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
    }),

  /* Set loading */
  setLoading: (loading) => set({ loading }),
}));

export default useCartStore;