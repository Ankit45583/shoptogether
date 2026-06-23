import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { BsDoorOpen, BsBell, BsShop } from "react-icons/bs";
import Logo from "../Logo/Logo";
import Avatar from "../../ui/Avatar/Avatar";
import useAuthStore from "../../../store/auth.store";
import useNotificationStore from "../../../store/notification.store";
import { getUnreadCount } from "../../../api/notification.api";
import { getSocket } from "../../../lib/socket";
import toast from "react-hot-toast";
import "./Sidebar.css";

function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  /* ✨ Real-time notification count */
  const { unreadCount, setUnreadCount, addNotification } = useNotificationStore();

  /* ==========================================
     Load unread count on mount
  ========================================== */
  useEffect(() => {
    const loadCount = async () => {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res?.data?.count || 0);
      } catch (err) {
        console.error("Failed to load unread count:", err);
      }
    };

    if (user) loadCount();
  }, [user, setUnreadCount]);

  /* ==========================================
     Listen for new notifications via socket
  ========================================== */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNew = ({ notification }) => {
      if (!notification) return;
      addNotification(notification);
      toast.success(`🔔 ${notification.title || "New notification"}`);
    };

    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, [addNotification]);

  /* ==========================================
     Logout
  ========================================== */
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  /* ==========================================
     Nav items (with real unread count)
  ========================================== */
  const navItems = [
    { to: "/dashboard", icon: <AiOutlineHome size={20} />, label: "Dashboard" },
    { to: "/rooms/join", icon: <BsDoorOpen size={20} />, label: "Rooms" },
    { to: "/products", icon: <BsShop size={20} />, label: "Products" },
    {
      to: "/notifications",
      icon: <BsBell size={20} />,
      label: "Notifications",
      badge: unreadCount, // ✨ Real-time count
    },
    { to: "/settings", icon: <AiOutlineSetting size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Logo linkTo="/dashboard" />
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                ["sidebar-link", isActive ? "active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>

              {item.badge > 0 && (
                <span className="sidebar-badge">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <Avatar name={user?.name} size="sm" />

            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {user?.name || "User"}
              </span>
              <span className="sidebar-user-username">
                @{user?.username || "user"}
              </span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <AiOutlineLogout size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;