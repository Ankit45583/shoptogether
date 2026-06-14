import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
