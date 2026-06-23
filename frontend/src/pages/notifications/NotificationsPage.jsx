import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BsDoorOpen,
  BsHandThumbsUp,
  BsRobot,
  BsShareFill,
  BsXCircle,
  BsChatDots,
  BsTrash,
} from "react-icons/bs";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../api/notification.api";
import useNotificationStore from "../../store/notification.store";
import toast from "react-hot-toast";
import "./NotificationsPage.css";

const typeConfig = {
  room_invite: {
    icon: <BsDoorOpen size={16} />,
    color: "var(--accent-purple)",
    bg: "rgba(139,92,246,0.12)",
  },
  vote_update: {
    icon: <BsHandThumbsUp size={16} />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  ai_suggestion: {
    icon: <BsRobot size={16} />,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  product_shared: {
    icon: <BsShareFill size={16} />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  new_message: {
    icon: <BsChatDots size={16} />,
    color: "var(--accent-purple)",
    bg: "rgba(139,92,246,0.12)",
  },
  room_closed: {
    icon: <BsXCircle size={16} />,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

/* Time ago helper */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 172800) return "Yesterday";

  const days = Math.floor(seconds / 86400);
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
};

/* Group notifications by date */
const groupByDate = (notifs) => {
  const today = [];
  const yesterday = [];
  const earlier = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  notifs.forEach((n) => {
    const created = new Date(n.createdAt);
    if (created >= todayStart) today.push(n);
    else if (created >= yesterdayStart) yesterday.push(n);
    else earlier.push(n);
  });

  return { today, yesterday, earlier };
};

function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    setNotifications,
    markRead,
    markAllRead,
    removeNotification,
    setLoading,
  } = useNotificationStore();

  /* Initial load */
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ limit: 50 });
      setNotifications(res?.data?.notifications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notif, e) => {
    e?.stopPropagation();

    if (notif.isRead) return;

    // Optimistic update
    markRead(notif._id);

    try {
      await markAsRead(notif._id);
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    // Optimistic
    markAllRead();

    try {
      await markAllAsRead();
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed");
      loadNotifications();
    }
  };

  const handleDelete = async (notifId, e) => {
    e?.stopPropagation();

    removeNotification(notifId);

    try {
      await deleteNotification(notifId);
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to delete");
      loadNotifications();
    }
  };

  /* Click → navigate to relevant page */
  const handleClick = async (notif) => {
    if (!notif.isRead) {
      markRead(notif._id);
      try {
        await markAsRead(notif._id);
      } catch {}
    }

    // Navigate based on notification type
    if (notif.data?.roomId) {
      navigate(`/rooms/${notif.data.roomId}`);
    }
  };

  const { today, yesterday, earlier } = groupByDate(notifications);

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
                key={n._id}
                className={`notif-item ${!n.isRead ? "unread" : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleClick(n)}
              >
                <div
                  className="notif-icon-circle"
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  {cfg.icon}
                </div>

                <div className="notif-content">
                  {n.title && <p className="notif-title">{n.title}</p>}
                  <p className="notif-text">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>

                <div className="notif-actions">
                  {!n.isRead && <span className="notif-dot" />}
                  <button
                    className="notif-delete-btn"
                    onClick={(e) => handleDelete(n._id, e)}
                    title="Delete"
                  >
                    <BsTrash size={12} />
                  </button>
                </div>
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
            <Badge variant="purple" style={{ marginTop: 6 }}>
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="notifications-content">
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">
            <span style={{ fontSize: 48 }}>🔔</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>No notifications yet</p>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              You'll see updates here when something happens
            </span>
          </div>
        ) : (
          <>
            {renderGroup("Today", today)}
            {renderGroup("Yesterday", yesterday)}
            {renderGroup("Earlier", earlier)}
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;