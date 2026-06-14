import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/common/Sidebar/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  const location = useLocation();

  // ✅ Sirf Live Room page pe true ho
  // /rooms/create, /rooms/join exclude karo
  const isLiveRoomPage =
    location.pathname.startsWith("/rooms/") &&
    !location.pathname.includes("/create") &&
    !location.pathname.includes("/join");

  return (
    <div className={`dashboard-layout ${isLiveRoomPage ? "room-layout" : ""}`}>
      <Sidebar />

      <div className={`dashboard-main ${isLiveRoomPage ? "room-main" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;