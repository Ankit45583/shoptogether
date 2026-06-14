import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/auth.store";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CreateRoomPage from "../pages/room/CreateRoomPage";
import JoinRoomPage from "../pages/room/JoinRoomPage";
import LiveRoomPage from "../pages/room/LiveRoomPage";
import ProductFeedPage from "../pages/products/ProductFeedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import SettingsPage from "../pages/settings/SettingsPage";

// Redirect to login if not authenticated
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Redirect to dashboard if already authenticated
function GuestRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rooms/create" element={<CreateRoomPage />} />
          <Route path="/rooms/join" element={<JoinRoomPage />} />
          <Route path="/products" element={<ProductFeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/rooms/:roomId" element={<LiveRoomPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
