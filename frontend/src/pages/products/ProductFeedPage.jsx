import { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineSearch, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsHandThumbsUp, BsShareFill } from "react-icons/bs";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge/Badge";
import Modal from "../../components/ui/Modal/Modal";
import Button from "../../components/ui/Button/Button";
import { MOCK_PRODUCTS, MOCK_ROOMS, CATEGORIES, CATEGORY_COLORS } from "../../config/constants";
import { formatPrice } from "../../lib/utils";
import "./ProductFeedPage.css";

/* ==========================================
   STAR RATING
========================================== */

function StarRating({ rating }) {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
      <span className="star-count">{rating}</span>
    </div>
  );
}

/* ==========================================
   PRODUCT CARD
========================================== */

function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);
  const [votes, setVotes] = useState(product.votes.up);
  const [shareOpen, setShareOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleVote = () => {
    setVotes((v) => v + 1);
    toast.success("Voted! 👍");
  };

  const handleSave = () => {
    setSaved((p) => !p);
    toast(saved ? "Removed from saved" : "Saved! 💾");
  };

  return (
    <>
      <motion.div
        className="product-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        {/* ✅ Image Wrapper */}
        <div
          className="product-card-img"
          style={{ background: `${CATEGORY_COLORS[product.category]}15` }}
        >
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="product-emoji">{product.emoji}</span>
          )}

          {/* Save button overlay */}
          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={handleSave}
            aria-label="Save product"
          >
            {saved ? <AiFillHeart size={18} /> : <AiOutlineHeart size={18} />}
          </button>

          {/* Trending badge (optional) */}
          {product.votes.up > 15 && (
            <span className="trending-badge">🔥 Trending</span>
          )}
        </div>

        {/* Product Body */}
        <div className="product-card-body">
          <Badge
            variant={
              product.category === "Electronics"
                ? "info"
                : product.category === "Beauty"
                ? "pink"
                : "purple"
            }
          >
            {product.category}
          </Badge>

          <h4 className="product-card-name">{product.name}</h4>
          <p className="product-card-price">{formatPrice(product.price)}</p>

          <StarRating rating={product.rating} />

          <div className="product-card-votes">
            <button className="vote-count-btn" onClick={handleVote}>
              <BsHandThumbsUp size={13} /> {votes}
            </button>
            <span className="rating-count-text">({product.ratingCount})</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            leftIcon={<BsShareFill size={12} />}
            onClick={() => setShareOpen(true)}
          >
            Share to Room
          </Button>
        </div>
      </motion.div>

      {/* Share Modal */}
      <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} title="Share to Room">
        <p className="share-modal-sub">Choose a room to share this product:</p>
        <div className="share-room-list">
          {MOCK_ROOMS.slice(0, 4).map((r) => (
            <button
              key={r.id}
              className="share-room-item"
              onClick={() => {
                toast.success(`Shared "${product.name}" to ${r.name}!`);
                setShareOpen(false);
              }}
            >
              <div className="share-room-info">
                <span className="share-room-name">{r.name}</span>
                <span className="share-room-meta">
                  {r.members} members · {r.category}
                </span>
              </div>
              <Badge variant="default">{r.type}</Badge>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

/* ==========================================
   PRODUCT FEED PAGE
========================================== */

function ProductFeedPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

  const filtered = MOCK_PRODUCTS
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Most Voted") return b.votes.up - a.votes.up;
      return 0;
    });

  return (
    <div className="product-feed-page">
      
      {/* Header */}
      <div className="product-feed-header">
        <div>
          <h1 className="page-title">Discover Products</h1>
          <p className="page-subtitle">
            Browse trending products and share with your shopping rooms
          </p>
        </div>

        <div className="product-feed-controls">
          <div className="feed-search">
            <AiOutlineSearch size={16} className="search-icon" />
            <input
              className="feed-search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="feed-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Voted</option>
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="filter-chips">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="empty-products">
          <p>😕 No products found for "{search}"</p>
        </div>
      ) : (
        <>
          <div className="product-count">
            Showing <strong>{filtered.length}</strong> products
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductFeedPage;