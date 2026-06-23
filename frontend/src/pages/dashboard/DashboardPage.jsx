import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import {
  BsDoorOpen,
  BsBagHeart,
  BsGraphUp,
  BsHandThumbsUp,
  BsRobot,
  BsShareFill,
} from "react-icons/bs";
import Avatar from "../../components/ui/Avatar/Avatar";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import NotificationBell from "../../components/common/NotificationBell/NotificationBell";

import useAuthStore from "../../store/auth.store";
import useRoomStore from "../../store/room.store";

import { getMyRooms } from "../../api/room.api";
import { getSavedProducts } from "../../api/user.api";
import { getTrendingProducts } from "../../api/product.api";
import { getNotifications } from "../../api/notification.api";

import "./DashboardPage.css";

const activityIcon = {
  room_invite: "🚪",
  vote_update: "👍",
  ai_suggestion: "🤖",
  product_shared: "📢",
  new_message: "💬",
  room_closed: "🔒",
};

/* Time ago helper */
const timeAgo = (date) => {
  const sec = Math.floor((new Date() - new Date(date)) / 1000);
  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 172800) return "Yesterday";
  return `${Math.floor(sec / 86400)} days ago`;
};

function DashboardPage() {
  const { user } = useAuthStore();
  const { myRooms, setMyRooms } = useRoomStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  /* ==========================================
     LOAD ALL DASHBOARD DATA
  ========================================== */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [roomsRes, savedRes, trendingRes, notifRes] = await Promise.all([
          getMyRooms().catch(() => ({ data: { rooms: [] } })),
          getSavedProducts().catch(() => ({ data: { savedProducts: [] } })),
          getTrendingProducts().catch(() => ({ data: { products: [] } })),
          getNotifications({ limit: 10 }).catch(() => ({ data: { notifications: [] } })),
        ]);

        setMyRooms(roomsRes?.data?.rooms || []);
        setSavedProducts(savedRes?.data?.savedProducts || []);
        setTrendingProducts(trendingRes?.data?.products || []);
        setRecentActivity(notifRes?.data?.notifications || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================================
     COMPUTED STATS
  ========================================== */
  const stats = [
    {
      label: "Rooms Joined",
      value: myRooms.length,
      icon: <BsDoorOpen size={20} />,
      color: "#8b5cf6",
    },
    {
      label: "Products Saved",
      value: savedProducts.length,
      icon: <BsBagHeart size={20} />,
      color: "#ec4899",
    },
    {
      label: "Active Rooms",
      value: myRooms.filter((r) => r.status === "active").length,
      icon: <BsGraphUp size={20} />,
      color: "#22c55e",
    },
    {
      label: "Notifications",
      value: recentActivity.filter((n) => !n.isRead).length,
      icon: <BsHandThumbsUp size={20} />,
      color: "#3b82f6",
    },
  ];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard-page">
      {/* ============ TOPBAR ============ */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <h2 className="topbar-greeting">
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
        </div>
        <div className="topbar-right">
          <SearchBar />
          <NotificationBell />
          <Link to="/profile">
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        {/* ============ STATS ============ */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="stat-icon"
                style={{ color: s.color, background: `${s.color}18` }}
              >
                {s.icon}
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-grid">
          {/* ============ ACTIVE ROOMS ============ */}
          <div className="dashboard-section">
            <div className="section-row">
              <h3 className="section-heading">Active Rooms</h3>
              <Link to="/rooms/create">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<AiOutlinePlus size={14} />}
                >
                  Create Room
                </Button>
              </Link>
            </div>

            <div className="rooms-grid">
              {loading ? (
                <p className="dashboard-empty">Loading rooms...</p>
              ) : myRooms.length === 0 ? (
                <p className="dashboard-empty">
                  No rooms yet. Create your first room!
                </p>
              ) : (
                myRooms.slice(0, 6).map((room) => (
                  <motion.div
                    key={room._id}
                    className="room-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(`/rooms/${room._id}`)}
                  >
                    <div className="room-card-top">
                      <Badge variant="purple">{room.category || "General"}</Badge>
                      <Badge
                        variant={room.type === "private" ? "warning" : "default"}
                      >
                        {room.type === "private" ? "🔒 Private" : "🌐 Public"}
                      </Badge>
                    </div>
                    <h4 className="room-card-name">{room.name}</h4>
                    <p className="room-card-host">
                      Hosted by {room.host?.name || "Unknown"}
                    </p>
                    <div className="room-card-footer">
                      <span className="room-card-members">
                        👥 {room.members?.length || 0}/{room.maxMembers}
                      </span>
                      <span className="room-card-code">{room.code}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/rooms/${room._id}`);
                        }}
                      >
                        Join
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ============ RECENT ACTIVITY (Real) ============ */}
          <div className="dashboard-section">
            <div className="section-row">
              <h3 className="section-heading">Recent Activity</h3>
              <Link to="/notifications" className="section-see-all">
                See all →
              </Link>
            </div>
            <div className="activity-list">
              {loading ? (
                <p className="dashboard-empty">Loading...</p>
              ) : recentActivity.length === 0 ? (
                <p className="dashboard-empty">
                  🔔 No activity yet
                </p>
              ) : (
                recentActivity.slice(0, 6).map((n) => (
                  <div
                    key={n._id}
                    className={`activity-item ${!n.isRead ? "unread" : ""}`}
                    onClick={() => {
                      if (n.data?.roomId) navigate(`/rooms/${n.data.roomId}`);
                      else navigate("/notifications");
                    }}
                  >
                    <span className="activity-icon">
                      {activityIcon[n.type] || "🔔"}
                    </span>
                    <span className="activity-text">{n.message}</span>
                    <span className="activity-time">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ============ TRENDING (Real Backend) ============ */}
        <div className="dashboard-section">
          <div className="section-row">
            <h3 className="section-heading">Trending Now</h3>
            <Link to="/products" className="section-see-all">
              See all →
            </Link>
          </div>
          {loading ? (
            <p className="dashboard-empty">Loading...</p>
          ) : trendingProducts.length === 0 ? (
            <p className="dashboard-empty">No trending products yet</p>
          ) : (
            <div className="trending-scroll">
              {trendingProducts.map((p) => (
                <div
                  key={p._id}
                  className="trending-card"
                  onClick={() => navigate("/products")}
                >
                  <div className="trending-card-img">
                    {p.thumbnail && (
                      <img src={p.thumbnail} alt={p.name} loading="lazy" />
                    )}
                  </div>
                  <p className="trending-card-name">{p.name}</p>
                  <p className="trending-card-price">
                    ₹{p.price?.toLocaleString("en-IN")}
                  </p>
                  <Badge variant="default">{p.category}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;