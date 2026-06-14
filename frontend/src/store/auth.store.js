import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
  isLoading: false,

  login: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token || "mock-token");
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
