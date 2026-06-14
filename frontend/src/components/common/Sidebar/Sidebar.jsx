import { useState } from "react";
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
import { MOCK_NOTIFICATIONS } from "../../../config/constants";
import toast from "react-hot-toast";
import "./Sidebar.css";

const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

const navItems = [
  { to: "/dashboard", icon: <AiOutlineHome size={20} />, label: "Dashboard" },
  { to: "/rooms/join", icon: <BsDoorOpen size={20} />, label: "Rooms" },
  { to: "/products", icon: <BsShop size={20} />, label: "Products" },
  {
    to: "/notifications",
    icon: <BsBell size={20} />,
    label: "Notifications",
    badge: unread,
  },
  { to: "/settings", icon: <AiOutlineSetting size={20} />, label: "Settings" },
];

function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
      </button>

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
                <span className="sidebar-badge">{item.badge}</span>
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