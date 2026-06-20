import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineDelete,
  AiOutlineShareAlt,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsRobot, BsCartCheck, BsLightningCharge, BsTrophy } from "react-icons/bs";
import toast from "react-hot-toast";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";
import { getSocket } from "../../../lib/socket";

import { getAllProducts, shareProductToRoom } from "../../../api/product.api";
import { castVote, getRoomVotes } from "../../../api/vote.api";
import { getGroupCart, addToGroupCart, removeFromGroupCart } from "../../../api/cart.api";
import { getSharedProducts } from "../../../api/room.api";
import { getAIRecommendations, getRoomSummary } from "../../../api/ai.api";

import useCartStore from "../../../store/cart.store";
import useAuthStore from "../../../store/auth.store";
import "./RightPanel.css";

const tabs = ["Products", "Voting", "Cart", "AI"];
const categories = ["All", "fashion", "electronics", "beauty", "sports", "home", "books"];

/* ==========================================
   PRODUCTS TAB
========================================== */
function ProductsTab({ roomId }) {
  const [cat, setCat] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [cat]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts({ category: cat, limit: 50 });
      setProducts(res?.data?.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (product) => {
    if (!roomId) return toast.error("Room not loaded");
    try {
      setActionId(`share-${product._id}`);
      await shareProductToRoom(product._id, roomId);
      toast.success(`📢 Shared "${product.name}" for voting`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to share");
    } finally {
      setActionId(null);
    }
  };

  const handleAddToCart = async (product) => {
    if (!roomId) return toast.error("Room not loaded");
    try {
      setActionId(`cart-${product._id}`);
      await addToGroupCart(roomId, { productId: product._id, quantity: 1 });
      toast.success(`🛒 Added "${product.name}" to cart`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="tab-content">
      <div className="mini-chips">
        {categories.map((c) => (
          <button
            key={c}
            className={`mini-chip ${cat === c ? "active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c === "All" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="rp-empty-msg">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="rp-empty-msg">No products found</p>
      ) : (
        <div className="products-list">
          {products.map((p) => (
            <div key={p._id} className="room-product-card">
              <div className="rp-img">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className="rp-info">
                <span className="rp-name">{p.name}</span>
                <span className="rp-price">₹{p.price?.toLocaleString("en-IN")}</span>
              </div>
              <div className="rp-actions">
                <button
                  className="rp-btn share"
                  title="Share for voting"
                  onClick={() => handleShare(p)}
                  disabled={actionId === `share-${p._id}`}
                >
                  <AiOutlineShareAlt size={14} />
                </button>
                <button
                  className="rp-btn add"
                  title="Add to cart"
                  onClick={() => handleAddToCart(p)}
                  disabled={actionId === `cart-${p._id}`}
                >
                  <AiOutlinePlus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   VOTING TAB — Clean & Simple
========================================== */
function VotingTab({ roomId }) {
  const [products, setProducts] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { user } = useAuthStore();

  /* Initial load */
  useEffect(() => {
    if (roomId) loadData();
  }, [roomId]);

  /* Real-time socket updates */
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomId) return;

    const handleVoteUpdate = (data) => {
      // Skip my own vote (already updated optimistically)
      if (data?.votedBy?.toString() === user?._id?.toString()) return;

      setVotes((prev) => ({
        ...prev,
        [data.productId]: {
          productId: data.productId,
          votes: data.votes,
          userVote: prev[data.productId]?.userVote || null,
        },
      }));
    };

    const handleProductShared = () => loadData();

    socket.on("vote:updated", handleVoteUpdate);
    socket.on("product:shared", handleProductShared);

    return () => {
      socket.off("vote:updated", handleVoteUpdate);
      socket.off("product:shared", handleProductShared);
    };
  }, [roomId, user?._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sharedRes, votesRes] = await Promise.all([
        getSharedProducts(roomId),
        getRoomVotes(roomId),
      ]);

      const sharedProducts = sharedRes?.data?.products || [];
      const votesArr = votesRes?.data?.votes || [];

      const votesMap = {};
      votesArr.forEach((v) => {
        const pid = v.productId?.toString();
        if (pid) votesMap[pid] = v;
      });

      setProducts(sharedProducts);
      setVotes(votesMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load voting data");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Optimistic vote update */
  const handleVote = async (productId, type) => {
    const current = votes[productId] || {
      productId,
      votes: { up: 0, down: 0, total: 0, percentage: 0 },
      userVote: null,
    };

    let newUp = current.votes.up;
    let newDown = current.votes.down;
    let newUserVote = type;

    if (current.userVote === type) {
      if (type === "upvote") newUp--;
      else newDown--;
      newUserVote = null;
    } else if (current.userVote && current.userVote !== type) {
      if (type === "upvote") {
        newUp++;
        newDown--;
      } else {
        newDown++;
        newUp--;
      }
    } else {
      if (type === "upvote") newUp++;
      else newDown++;
    }

    const newTotal = newUp + newDown;
    const newPercentage = newTotal > 0 ? Math.round((newUp / newTotal) * 100) : 0;

    setVotes((prev) => ({
      ...prev,
      [productId]: {
        productId,
        votes: { up: newUp, down: newDown, total: newTotal, percentage: newPercentage },
        userVote: newUserVote,
      },
    }));

    try {
      await castVote({ productId, roomId, type });
    } catch (err) {
      toast.error("Failed to vote");
      loadData();
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product._id);
      await addToGroupCart(roomId, { productId: product._id, quantity: 1 });
      toast.success(`🛒 Added "${product.name}" to cart`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setAddingId(null);
    }
  };

  /* Sort by approval percentage (highest first) */
  const sorted = products
    .map((p) => ({
      product: p,
      vote: votes[p._id] || { votes: { up: 0, down: 0, total: 0, percentage: 0 } },
    }))
    .sort((a, b) => {
      const totalDiff = (b.vote?.votes?.total || 0) - (a.vote?.votes?.total || 0);
      if (totalDiff !== 0) return totalDiff;
      return (b.vote?.votes?.up || 0) - (a.vote?.votes?.up || 0);
    });

  return (
    <div className="tab-content">
      <div className="vote-header">
        <h4 className="tab-section-title">🗳️ Group Voting</h4>
        <Badge variant="purple">{products.length} products</Badge>
      </div>

      {loading ? (
        <p className="rp-empty-msg">Loading...</p>
      ) : products.length === 0 ? (
        <div className="vote-empty">
          <AiOutlineShareAlt size={32} style={{ opacity: 0.3 }} />
          <p style={{ marginTop: 8, fontWeight: 600 }}>No products to vote on</p>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Share products from the Products tab to start voting
          </span>
        </div>
      ) : (
        <div className="voting-list">
          {sorted.map(({ product: p, vote }) => {
            const v = vote.votes;
            const userVote = vote.userVote;

            return (
              <div key={p._id} className="vote-item">
                <div className="vote-item-top">
                  <div className="rp-img sm">
                    {p.thumbnail && <img src={p.thumbnail} alt={p.name} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="vote-item-name">{p.name}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--accent-purple)",
                        fontWeight: 700,
                      }}
                    >
                      ₹{p.price?.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    className="vote-add-btn"
                    title="Add to cart"
                    onClick={() => handleAddToCart(p)}
                    disabled={addingId === p._id}
                  >
                    <AiOutlinePlus size={14} />
                  </button>
                </div>

                <div className="vote-bar-wrap">
                  <div className="vote-bar-bg">
                    <motion.div
                      className="vote-bar-fill"
                      initial={false}
                      animate={{ width: `${v.percentage}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span className="vote-pct">
                    {v.total > 0 ? `${v.percentage}%` : "—"}
                  </span>
                </div>

                <div className="vote-btns">
                  <button
                    className={`vote-btn up ${userVote === "upvote" ? "active" : ""}`}
                    onClick={() => handleVote(p._id, "upvote")}
                  >
                    <AiOutlineArrowUp size={13} /> {v.up}
                  </button>
                  <button
                    className={`vote-btn down ${userVote === "downvote" ? "active" : ""}`}
                    onClick={() => handleVote(p._id, "downvote")}
                  >
                    <AiOutlineArrowDown size={13} /> {v.down}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   CART TAB (Same as before)
========================================== */
function CartTab({ roomId }) {
  const { cart, cartItems, totalItems, totalPrice, setCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) loadCart();
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomId) return;

    const handleCartUpdate = ({ cart: updatedCart }) => setCart(updatedCart);
    socket.on("cart:updated", handleCartUpdate);
    return () => socket.off("cart:updated", handleCartUpdate);
  }, [roomId, setCart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getGroupCart(roomId);
      setCart(res?.data?.cart);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromGroupCart(roomId, productId);
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="tab-content">
      <div className="vote-header">
        <h4 className="tab-section-title">🛒 Group Cart</h4>
        <Badge variant="purple">{totalItems} items</Badge>
      </div>

      {loading ? (
        <p className="rp-empty-msg">Loading...</p>
      ) : cartItems.length === 0 ? (
        <div className="vote-empty">
          <BsCartCheck size={32} style={{ opacity: 0.3 }} />
          <p style={{ marginTop: 8, fontWeight: 600 }}>Cart is empty</p>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Add products from Products tab or vote on shared items
          </span>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.product?._id} className="cart-item">
                <div className="rp-img sm">
                  {item.product?.thumbnail && <img src={item.product.thumbnail} alt={item.product.name} />}
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.product?.name}</span>
                  <span className="cart-item-price">
                    ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")} · Qty {item.quantity}
                  </span>
                  <span className="cart-item-by">By {item.addedBy?.name || "Unknown"}</span>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => handleRemove(item.product?._id)}
                  title="Remove"
                >
                  <AiOutlineDelete size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>₹{totalPrice?.toLocaleString("en-IN")}</span>
            </div>
            <Button variant="primary" fullWidth onClick={() => toast("🚀 Checkout coming soon!")}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ==========================================
   AI TAB
========================================== */
function AITab({ roomId }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");

  const handleGenerate = async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      const res = await getAIRecommendations(roomId);
      setRecommendations(res?.data?.recommendations || []);
      toast.success("🤖 AI recommendations generated!");
    } catch {
      toast.error("Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      const res = await getRoomSummary(roomId);
      setSummary(res?.data?.summary || "");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="ai-header">
        <div className="ai-avatar"><BsRobot size={22} /></div>
        <div>
          <h4 className="ai-title">AI Assistant</h4>
          <div className="ai-status">Powered by Gemini</div>
        </div>
      </div>

      <Button variant="primary" fullWidth loading={loading} leftIcon={<BsLightningCharge size={14} />} onClick={handleGenerate}>
        Generate Recommendations
      </Button>

      {recommendations.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {recommendations.map((rec, i) => (
            <motion.div key={i} className="ai-suggestion-card" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <span style={{ fontSize: 18 }}>🛍️</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{rec.productName}</p>
                <p style={{ fontSize: 11, opacity: 0.8, margin: "4px 0" }}>{rec.reason}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ color: "var(--accent-purple)", fontWeight: 700, fontSize: 12 }}>{rec.estimatedPrice}</span>
                  <span className="ai-pref-tag">{rec.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Button variant="secondary" size="sm" fullWidth loading={loading} onClick={handleSummary} style={{ marginTop: 10 }}>
        📝 Get Session Summary
      </Button>

      {summary && (
        <div className="ai-consensus-card" style={{ marginTop: 10 }}>
          <p className="ai-consensus-text">{summary}</p>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   MAIN RIGHT PANEL
========================================== */
function RightPanel({ room }) {
  const [active, setActive] = useState("Products");
  const { totalItems } = useCartStore();
  const roomId = room?._id;

  const tabContent = {
    Products: <ProductsTab roomId={roomId} />,
    Voting: <VotingTab roomId={roomId} />,
    Cart: <CartTab roomId={roomId} />,
    AI: <AITab roomId={roomId} />,
  };

  return (
    <div className="right-panel">
      <div className="right-panel-tabs">
        {tabs.map((t) => (
          <button key={t} className={`right-tab ${active === t ? "active" : ""}`} onClick={() => setActive(t)}>
            {t}
            {t === "Cart" && totalItems > 0 && <span className="tab-badge">{totalItems}</span>}
          </button>
        ))}
      </div>

      <div className="right-panel-body">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} style={{ height: "100%" }}>
            {tabContent[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RightPanel;