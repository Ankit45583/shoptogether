import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsDoorOpen, BsBagHeart, BsHandThumbsUp } from "react-icons/bs";
import Avatar from "../../components/ui/Avatar/Avatar";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import useAuthStore from "../../store/auth.store";
import { MOCK_ROOMS, MOCK_PRODUCTS } from "../../config/constants";
import { formatPrice } from "../../lib/utils";
import "./ProfilePage.css";

const tabs = ["Room History", "Saved Products", "Activity"];

const activity = [
  { icon: "🚪", text: "Joined Weekend Fashion Haul", time: "2 hours ago" },
  { icon: "👍", text: "Voted on Nike Air Max 270", time: "3 hours ago" },
  { icon: "🎉", text: "Group decided on boAt Rockerz 450", time: "Yesterday" },
  { icon: "💾", text: "Saved Mamaearth Vitamin C Serum", time: "2 days ago" },
  { icon: "🏠", text: "Created Home Decor Ideas room", time: "3 days ago" },
];

function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Room History");

  return (
    <div className="profile-page">
      {/* Header card */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrap">
          <Avatar name={user?.name} size="xl" />
          <button className="profile-edit-avatar" title="Edit photo">
            <AiOutlineEdit size={14} />
          </button>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.name || "Arjun Sharma"}</h2>
          <p className="profile-username">@{user?.username || "arjun_s"}</p>
          <p className="profile-bio">{user?.bio || "Fashion lover from Mumbai 🛍️"}</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<AiOutlineEdit size={14} />}>
          Edit Profile
        </Button>
      </div>

      {/* Stats row */}
      <div className="profile-stats-row">
        {[
          { label: "Rooms Created", value: 4, icon: <BsDoorOpen size={18} /> },
          { label: "Rooms Joined", value: 12, icon: <BsDoorOpen size={18} /> },
          { label: "Products Saved", value: 47, icon: <BsBagHeart size={18} /> },
          { label: "Votes Cast", value: 89, icon: <BsHandThumbsUp size={18} /> },
        ].map((s, i) => (
          <div key={i} className="profile-stat-card">
            <div className="profile-stat-icon">{s.icon}</div>
            <div className="profile-stat-value">{s.value}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`profile-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="profile-tab-content">
        {activeTab === "Room History" && (
          <div className="rooms-history-list">
            {MOCK_ROOMS.map((r) => (
              <div key={r.id} className="history-room-item">
                <div className="history-room-info">
                  <span className="history-room-name">{r.name}</span>
                  <span className="history-room-meta">Hosted by {r.host} · {r.members} members</span>
                </div>
                <div className="history-room-right">
                  <Badge variant={r.type === "private" ? "warning" : "default"}>{r.type}</Badge>
                  <Badge variant="purple">{r.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Saved Products" && (
          <div className="saved-products-grid">
            {MOCK_PRODUCTS.slice(0, 6).map((p) => (
              <div key={p.id} className="saved-product-card">
                <div className="saved-product-img" style={{ background: `rgba(139,92,246,0.08)` }}>
                  <span style={{ fontSize: 32 }}>{p.emoji}</span>
                </div>
                <div className="saved-product-info">
                  <span className="saved-product-name">{p.name}</span>
                  <span className="saved-product-price">{formatPrice(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="profile-activity-list">
            {activity.map((a, i) => (
              <div key={i} className="profile-activity-item">
                <span className="activity-icon">{a.icon}</span>
                <span className="activity-text">{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
