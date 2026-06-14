import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Avatar from "../../components/ui/Avatar/Avatar";
import useAuthStore from "../../store/auth.store";
import { sleep } from "../../lib/utils";
import "./SettingsPage.css";

const sidebarTabs = ["Account", "Preferences", "Notifications", "Privacy"];

const categories = ["Fashion", "Electronics", "Beauty", "Home", "Sports", "Books"];

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-info">
        <span className="settings-toggle-label">{label}</span>
        {description && <span className="settings-toggle-desc">{description}</span>}
      </div>
      <div className={`toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

function AccountTab({ user, setUser }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const { setUser: saveUser } = useAuthStore();

  const handleSave = async () => {
    setLoading(true);
    await sleep(600);
    saveUser({ ...user, ...form });
    toast.success("Profile updated!");
    setLoading(false);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Profile Information</h3>

      <div className="settings-avatar-row">
        <Avatar name={form.name} size="lg" />
        <Button variant="secondary" size="sm">Change Photo</Button>
      </div>

      <div className="settings-form">
        <Input label="Full Name" value={form.name} onChange={set("name")} />
        <Input label="Username" value={form.username} onChange={set("username")} />
        <Input label="Email" value={form.email} onChange={set("email")} disabled />
        <div className="input-wrapper">
          <label className="input-label">Bio</label>
          <textarea
            className="input-field textarea"
            value={form.bio}
            onChange={set("bio")}
            rows={3}
            placeholder="Tell people about yourself..."
          />
        </div>
      </div>

      <Button variant="primary" onClick={handleSave} loading={loading}>
        Save Changes
      </Button>
    </div>
  );
}

function PreferencesTab() {
  const [selectedCats, setSelectedCats] = useState(["Fashion", "Electronics"]);
  const [minPrice, setMinPrice] = useState("500");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [loading, setLoading] = useState(false);

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    await sleep(500);
    toast.success("Preferences saved!");
    setLoading(false);
  };

  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Shopping Preferences</h3>

      <div className="pref-group">
        <label className="pref-group-label">Favorite Categories</label>
        <div className="pref-cats">
          {categories.map((c) => (
            <label key={c} className={`pref-cat ${selectedCats.includes(c) ? "active" : ""}`}>
              <input
                type="checkbox"
                checked={selectedCats.includes(c)}
                onChange={() => toggleCat(c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="pref-group">
        <label className="pref-group-label">Price Range (₹)</label>
        <div className="price-range-row">
          <Input label="Min" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span className="price-range-sep">—</span>
          <Input label="Max" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <Button variant="primary" onClick={handleSave} loading={loading}>
        Save Preferences
      </Button>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    roomInvites: true,
    voteUpdates: true,
    aiSuggestions: true,
    productShared: false,
    roomClosed: true,
  });

  const toggle = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Notification Preferences</h3>
      <Toggle label="Room Invites" description="When someone invites you to a room" checked={prefs.roomInvites} onChange={toggle("roomInvites")} />
      <Toggle label="Vote Updates" description="When new votes are cast on products" checked={prefs.voteUpdates} onChange={toggle("voteUpdates")} />
      <Toggle label="AI Suggestions" description="When AI generates new recommendations" checked={prefs.aiSuggestions} onChange={toggle("aiSuggestions")} />
      <Toggle label="Product Shared" description="When someone shares a product in your room" checked={prefs.productShared} onChange={toggle("productShared")} />
      <Toggle label="Room Closed" description="When a room you joined is closed" checked={prefs.roomClosed} onChange={toggle("roomClosed")} />
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </div>
  );
}

function PrivacyTab() {
  const [publicAccount, setPublicAccount] = useState(true);
  const { logout } = useAuthStore();

  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Privacy Settings</h3>
      <Toggle
        label="Public Account"
        description="Allow others to find and see your profile"
        checked={publicAccount}
        onChange={setPublicAccount}
      />

      <div className="danger-zone">
        <h4 className="danger-zone-title">⚠️ Danger Zone</h4>
        <p className="danger-zone-desc">
          Deleting your account is permanent and cannot be undone.
          All your rooms, votes, and saved products will be lost.
        </p>
        <Button
          variant="danger"
          onClick={() => toast.error("Account deletion requires email confirmation (demo)")}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Account");

  const tabContent = {
    Account: <AccountTab user={user} />,
    Preferences: <PreferencesTab />,
    Notifications: <NotificationsTab />,
    Privacy: <PrivacyTab />,
  };

  return (
    <div className="settings-page">
      <h1 className="page-title" style={{ padding: "var(--space-6) var(--space-6) 0" }}>Settings</h1>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {sidebarTabs.map((t) => (
            <button
              key={t}
              className={`settings-sidebar-item ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </aside>

        <div className="settings-main">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
