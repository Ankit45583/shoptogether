import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ==========================================
   AXIOS INSTANCE
========================================== */

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================
   REQUEST INTERCEPTOR
   - Attaches JWT token from auth store
========================================== */

api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    let token = null;

    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token;
      } catch (e) {
        token = null;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================
   RESPONSE INTERCEPTOR
   - Handles 401 (auto logout)
   - Handles common errors
========================================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    /* ============ 401 — Session Expired ============ */
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("auth-storage");
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    /* ============ 403 — Forbidden ============ */
    if (error.response?.status === 403) {
      toast.error(
        error.response?.data?.message || "You don't have permission for this action"
      );
    }

    /* ============ 500 — Server Error ============ */
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;