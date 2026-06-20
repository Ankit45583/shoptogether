import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineSearch, AiOutlineBell, AiOutlinePlus } from "react-icons/ai";
import { BsDoorOpen, BsBagHeart, BsGraphUp, BsHandThumbsUp } from "react-icons/bs";
import Avatar from "../../components/ui/Avatar/Avatar";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import useAuthStore from "../../store/auth.store";
import useRoomStore from "../../store/room.store";
import { MOCK_PRODUCTS, MOCK_NOTIFICATIONS, CATEGORY_COLORS } from "../../config/constants";
import { formatPrice } from "../../lib/utils";
import { getMyRooms } from "../../api/room.api";
import "./DashboardPage.css";

const stats = [
  { label: "Rooms Joined", value: 12, icon: <BsDoorOpen size={20} />, color: "var(--accent-purple)" },
  { label: "Products Saved", value: 47, icon: <BsBagHeart size={20} />, color: "var(--accent-pink)" },
  { label: "Active Rooms", value: 3, icon: <BsGraphUp size={20} />, color: "var(--success)" },
  { label: "Total Votes Cast", value: 89, icon: <BsHandThumbsUp size={20} />, color: "var(--info)" },
];

const recentActivity = [
  { icon: "🚪", text: "Joined 'Tech Gadgets 2024'", time: "10 min ago" },
  { icon: "👍", text: "Voted on Nike Air Max 270", time: "25 min ago" },
  { icon: "💾", text: "Saved Mamaearth Vitamin C Serum", time: "1 hour ago" },
  { icon: "🏠", text: "Created 'Home Decor Ideas' room", time: "3 hours ago" },
  { icon: "🎉", text: "Group decided on boAt Rockerz 450", time: "Yesterday" },
];

function DashboardPage() {
  const { user } = useAuthStore();
  const { myRooms, setMyRooms } = useRoomStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);

  /* ==========================================
     LOAD ROOMS FROM BACKEND — ONCE ONLY
  ========================================== */

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await getMyRooms();
        setMyRooms(response.data.rooms || []);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // ✅ EMPTY ARRAY — important!

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="dashboard-page">
      {/* Top bar */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <h2 className="topbar-greeting">
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <AiOutlineSearch className="search-icon" size={16} />
            <input
              className="topbar-search-input"
              placeholder="Search products, rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/notifications" className="topbar-bell">
            <AiOutlineBell size={20} />
            {unread > 0 && <span className="topbar-bell-badge">{unread}</span>}
          </Link>
          <Link to="/profile">
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="stat-icon" style={{ color: s.color, background: `${s.color}18` }}>
                {s.icon}
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-grid">
          {/* Active Rooms */}
          <div className="dashboard-section">
            <div className="section-row">
              <h3 className="section-heading">Active Rooms</h3>
              <Link to="/rooms/create">
                <Button variant="primary" size="sm" leftIcon={<AiOutlinePlus size={14} />}>
                  Create Room
                </Button>
              </Link>
            </div>

            <div className="rooms-grid">
              {loadingRooms ? (
                <p style={{ color: "var(--text-muted)", padding: "20px" }}>
                  Loading rooms...
                </p>
              ) : myRooms.length === 0 ? (
                <p style={{ color: "var(--text-muted)", padding: "20px" }}>
                  No rooms yet. Create your first room!
                </p>
              ) : (
                myRooms.map((room) => (
                  <motion.div
                    key={room._id || room.id}
                    className="room-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="room-card-top">
                      <Badge
                        variant={
                          room.category === "Electronics"
                            ? "info"
                            : room.category === "Fashion"
                            ? "purple"
                            : "success"
                        }
                      >
                        {room.category}
                      </Badge>
                      <Badge variant={room.type === "private" ? "warning" : "default"}>
                        {room.type === "private" ? "🔒 Private" : "🌐 Public"}
                      </Badge>
                    </div>
                    <h4 className="room-card-name">{room.name}</h4>
                    <p className="room-card-host">
                      Hosted by {room.host?.name || room.host || "Unknown"}
                    </p>
                    <div className="room-card-footer">
                      <span className="room-card-members">
                        👥 {room.members?.length || room.members || 0}/{room.maxMembers}
                      </span>
                      <span className="room-card-code">{room.code}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/rooms/${room._id || room.id}`)}
                      >
                        Join
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <h3 className="section-heading">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-icon">{a.icon}</span>
                  <span className="activity-text">{a.text}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Products */}
        <div className="dashboard-section">
          <div className="section-row">
            <h3 className="section-heading">Trending Now</h3>
            <Link to="/products" className="section-see-all">
              See all →
            </Link>
          </div>
          <div className="trending-scroll">
            {MOCK_PRODUCTS.slice(0, 8).map((p) => (
              <div key={p.id} className="trending-card">
                <div
                  className="trending-card-img"
                  style={{ background: `${CATEGORY_COLORS[p.category]}18` }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = document.createElement("span");
                      fallback.style.fontSize = "32px";
                      fallback.textContent = p.emoji;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                </div>
                <p className="trending-card-name">{p.name}</p>
                <p className="trending-card-price">{formatPrice(p.price)}</p>
                <Badge variant="default">{p.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;