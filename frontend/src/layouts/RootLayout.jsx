import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

function RootLayout() {
  const location = useLocation();

  const isAppPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/rooms/") ||
    location.pathname.startsWith("/products") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/profile");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAppPage && <Navbar />}

      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>

      {!isAppPage && <Footer />}
    </div>
  );
}

export default RootLayout;