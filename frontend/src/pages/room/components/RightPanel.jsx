import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineDelete, AiOutlineShareAlt } from "react-icons/ai";
import { BsRobot, BsCartCheck, BsLightningCharge } from "react-icons/bs";
import toast from "react-hot-toast";
import Avatar from "../../../components/ui/Avatar/Avatar";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";
import { MOCK_PRODUCTS, CATEGORIES, CATEGORY_COLORS } from "../../../config/constants";
import { formatPrice } from "../../../lib/utils";
import useCartStore from "../../../store/cart.store";
import useAuthStore from "../../../store/auth.store";
import "./RightPanel.css";

const tabs = ["Products", "Voting", "Cart", "AI"];

/* ---------- Products tab ---------- */
function ProductsTab() {
  const [cat, setCat] = useState("All");
  const { addToCart } = useCartStore();
  const filtered = cat === "All" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === cat);

  return (
    <div className="tab-content">
      <div className="mini-chips">
        {["All", "Fashion", "Electronics", "Beauty", "Sports"].map((c) => (
          <button key={c} className={`mini-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="products-list">
        {filtered.map((p) => (
          <div key={p.id} className="room-product-card">
            <div className="rp-img" style={{ background: `${CATEGORY_COLORS[p.category]}18` }}>
              <span>{p.emoji}</span>
            </div>
            <div className="rp-info">
              <span className="rp-name">{p.name}</span>
              <span className="rp-price">{formatPrice(p.price)}</span>
            </div>
            <div className="rp-actions">
              <button className="rp-btn" title="Share" onClick={() => toast.success("Shared to chat!")}>
                <AiOutlineShareAlt size={14} />
              </button>
              <button className="rp-btn vote" title="Add to cart" onClick={() => { addToCart({ ...p, addedBy: "You" }); toast.success("Added to cart!"); }}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Voting tab ---------- */
function VotingTab() {
  const [votes, setVotes] = useState(() =>
    MOCK_PRODUCTS.slice(0, 5).map((p) => ({ ...p }))
  );

  const vote = (id, dir) => {
    setVotes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, votes: { ...p.votes, [dir]: p.votes[dir] + 1 } } : p
      )
    );
    toast.success(dir === "up" ? "👍 Voted up!" : "👎 Voted down!");
  };

  return (
    <div className="tab-content">
      <h4 className="tab-section-title">Active Votes</h4>
      <div className="voting-list">
        {votes.map((p) => {
          const total = p.votes.up + p.votes.down;
          const pct = total ? Math.round((p.votes.up / total) * 100) : 0;
          return (
            <div key={p.id} className="vote-item">
              <div className="vote-item-top">
                <div className="rp-img sm" style={{ background: `${CATEGORY_COLORS[p.category]}18` }}>
                  <span>{p.emoji}</span>
                </div>
                <span className="vote-item-name">{p.name}</span>
              </div>
              <div className="vote-bar-wrap">
                <div className="vote-bar-bg">
                  <motion.div
                    className="vote-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="vote-pct">{pct}%</span>
              </div>
              <div className="vote-btns">
                <button className="vote-btn up" onClick={() => vote(p.id, "up")}>
                  <AiOutlineArrowUp size={13} /> {p.votes.up}
                </button>
                <button className="vote-btn down" onClick={() => vote(p.id, "down")}>
                  <AiOutlineArrowDown size={13} /> {p.votes.down}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ai-consensus-card">
        <div className="ai-consensus-header">
          <BsRobot size={14} />
          <span>AI Consensus Summary</span>
        </div>
        <p className="ai-consensus-text">
          The group prefers electronics under ₹5,000. boAt Rockerz is leading with 89% approval.
        </p>
      </div>
    </div>
  );
}

/* ---------- Cart tab ---------- */
function CartTab() {
  const { cartItems, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const total = cartItems.reduce((s, i) => s + i.price, 0);

  return (
    <div className="tab-content">
      <div className="cart-header">
        <h4 className="tab-section-title">Group Cart</h4>
        <Badge variant="purple">{cartItems.length} items</Badge>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <BsCartCheck size={32} />
          <p>Cart is empty</p>
          <span>Add products from the Products tab</span>
        </div>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="rp-img sm" style={{ background: `${CATEGORY_COLORS[item.category]}18` }}>
                <span>{item.emoji}</span>
              </div>
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{formatPrice(item.price)}</span>
                <span className="cart-item-by">Added by {item.addedBy || "You"}</span>
              </div>
              {(item.addedBy === "You" || !item.addedBy) && (
                <button className="icon-btn danger" onClick={() => removeFromCart(item.id)} title="Remove">
                  <AiOutlineDelete size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button variant="primary" fullWidth onClick={() => toast("🚀 Checkout coming soon!")}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- AI tab ---------- */
function AITab() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    { icon: "💰", text: "Group budget seems to be around ₹2,000 – ₹5,000" },
    { icon: "🎯", text: "Most members prefer Electronics and Fashion" },
    { icon: "👍", text: "3 members liked boAt Rockerz 450" },
    { icon: "🔥", text: "Nike Air Max 270 has high engagement in chat" },
  ]);

  const refresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSuggestions([
      { icon: "📊", text: "Price sweet spot for this group: ₹1,000 – ₹4,000" },
      { icon: "⭐", text: "Highest rated items: JBL Flip 6 & Lakme Kajal" },
      { icon: "🛍️", text: "4 members have voted on Electronics today" },
      { icon: "💡", text: "Consider Noise ColorFit Pro 4 — best value pick" },
    ]);
    setLoading(false);
    toast.success("AI recommendations refreshed!");
  };

  return (
    <div className="tab-content">
      <div className="ai-header">
        <div className="ai-avatar">
          <BsRobot size={22} />
        </div>
        <div>
          <h4 className="ai-title">AI Shopping Assistant</h4>
          <div className="ai-status">
            <span className="ai-dot" />
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="ai-suggestions">
        {suggestions.map((s, i) => (
          <motion.div
            key={`${s.text}-${i}`}
            className="ai-suggestion-card"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="ai-suggestion-icon">{s.icon}</span>
            <p className="ai-suggestion-text">{s.text}</p>
          </motion.div>
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        loading={loading}
        leftIcon={<BsLightningCharge size={14} />}
        onClick={refresh}
      >
        Get New Recommendations
      </Button>

      <div className="ai-prefs">
        <span className="ai-prefs-label">Detected Preferences</span>
        <div className="ai-pref-tags">
          {["Electronics", "Under ₹5K", "Fashion", "High Rated"].map((t) => (
            <span key={t} className="ai-pref-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Right Panel ---------- */
function RightPanel() {
  const [active, setActive] = useState("Products");
  const { cartItems } = useCartStore();

  const tabContent = { Products: <ProductsTab />, Voting: <VotingTab />, Cart: <CartTab />, AI: <AITab /> };

  return (
    <div className="right-panel">
      <div className="right-panel-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`right-tab ${active === t ? "active" : ""}`}
            onClick={() => setActive(t)}
          >
            {t}
            {t === "Cart" && cartItems.length > 0 && (
              <span className="tab-badge">{cartItems.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="right-panel-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ height: "100%" }}
          >
            {tabContent[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RightPanel;
