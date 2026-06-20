import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user after login/register
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Update user data
      setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
      },

      // Clear everything on logout
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Loading state
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;