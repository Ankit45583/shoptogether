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
    <>
      {!isAppPage && <Navbar />}

      <main
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Outlet />
      </main>

      {!isAppPage && <Footer />}
    </>
  );
}

export default RootLayout;