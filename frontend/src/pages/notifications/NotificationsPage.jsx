import { useState } from "react";
import { motion } from "framer-motion";
import { BsDoorOpen, BsHandThumbsUp, BsRobot, BsShareFill, BsXCircle } from "react-icons/bs";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import { MOCK_NOTIFICATIONS } from "../../config/constants";
import toast from "react-hot-toast";
import "./NotificationsPage.css";

const typeConfig = {
  room_invite: { icon: <BsDoorOpen size={16} />, color: "var(--accent-purple)", bg: "var(--accent-purple-light)" },
  vote_update: { icon: <BsHandThumbsUp size={16} />, color: "var(--info)", bg: "rgba(59,130,246,0.1)" },
  ai_suggestion: { icon: <BsRobot size={16} />, color: "var(--success)", bg: "rgba(34,197,94,0.1)" },
  product_shared: { icon: <BsShareFill size={16} />, color: "var(--warning)", bg: "rgba(245,158,11,0.1)" },
  room_closed: { icon: <BsXCircle size={16} />, color: "var(--error)", bg: "rgba(239,68,68,0.1)" },
};

function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All marked as read");
  };

  const markRead = (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const today = notifs.filter((n) => n.time.includes("min") || n.time.includes("hour"));
  const yesterday = notifs.filter((n) => n.time === "Yesterday");
  const earlier = notifs.filter((n) => !n.time.includes("min") && !n.time.includes("hour") && n.time !== "Yesterday");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const renderGroup = (title, items) => {
    if (!items.length) return null;
    return (
      <div className="notif-group">
        <h3 className="notif-group-title">{title}</h3>
        <div className="notif-list">
          {items.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.room_closed;
            return (
              <motion.div
                key={n.id}
                className={`notif-item ${!n.read ? "unread" : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
              >
                <div className="notif-icon-circle" style={{ color: cfg.color, background: cfg.bg }}>
                  {cfg.icon}
                </div>
                <div className="notif-content">
                  <p className="notif-text">{n.text}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
                {!n.read && <span className="notif-dot" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="purple">{unreadCount} unread</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      <div className="notifications-content">
        {renderGroup("Today", today)}
        {renderGroup("Yesterday", yesterday)}
        {renderGroup("Earlier", earlier)}

        {notifs.length === 0 && (
          <div className="notif-empty">
            <span>🔔</span>
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
