import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineBell } from "react-icons/ai";
import { BsDoorOpen, BsHandThumbsUp, BsRobot, BsShareFill } from "react-icons/bs";
import { getNotifications, markAsRead } from "../../../api/notification.api";
import useNotificationStore from "../../../store/notification.store";
import "./NotificationBell.css";

const typeIcon = {
  room_invite: <BsDoorOpen size={14} />,
  vote_update: <BsHandThumbsUp size={14} />,
  ai_suggestion: <BsRobot size={14} />,
  product_shared: <BsShareFill size={14} />,
};

const typeColor = {
  room_invite: "var(--accent-purple)",
  vote_update: "#3b82f6",
  ai_suggestion: "#22c55e",
  product_shared: "#f59e0b",
};

const timeAgo = (date) => {
  const sec = Math.floor((new Date() - new Date(date)) / 1000);
  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { unreadCount, markRead } = useNotificationStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Load notifications when open */
  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ limit: 7 });
      setNotifications(res?.data?.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      markRead(notif._id);
      try {
        await markAsRead(notif._id);
      } catch {}
    }

    if (notif.data?.roomId) {
      navigate(`/rooms/${notif.data.roomId}`);
    } else {
      navigate("/notifications");
    }
    setOpen(false);
  };

  return (
    <div className="notif-bell-wrap" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <AiOutlineBell size={20} />
        {unreadCount > 0 && (
          <span className="notif-bell-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-bell-dropdown"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notif-bell-header">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <span className="notif-bell-count">{unreadCount} new</span>
              )}
            </div>

            <div className="notif-bell-list">
              {loading ? (
                <p className="notif-bell-empty">Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="notif-bell-empty">
                  🔔 No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-bell-item ${!n.isRead ? "unread" : ""}`}
                    onClick={() => handleClick(n)}
                  >
                    <div
                      className="notif-bell-icon"
                      style={{
                        color: typeColor[n.type] || "var(--accent-purple)",
                        background: `${typeColor[n.type] || "#8b5cf6"}20`,
                      }}
                    >
                      {typeIcon[n.type] || <AiOutlineBell size={14} />}
                    </div>
                    <div className="notif-bell-content">
                      {n.title && <p className="notif-bell-title">{n.title}</p>}
                      <p className="notif-bell-msg">{n.message}</p>
                      <span className="notif-bell-time">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    {!n.isRead && <span className="notif-bell-dot" />}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notif-bell-footer">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setOpen(false);
                  }}
                >
                  View all notifications →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;