import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsBag, BsDoorOpen } from "react-icons/bs";
import { getAllProducts } from "../../../api/product.api";
import { getPublicRooms } from "../../../api/room.api";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], rooms: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Debounced search */
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults({ products: [], rooms: [] });
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const [productsRes, roomsRes] = await Promise.all([
          getAllProducts({ search: query, limit: 5 }),
          getPublicRooms(1, 20),
        ]);

        const products = productsRes?.data?.products || [];

        // Filter rooms by name (client-side, since no search param)
        const allRooms = roomsRes?.data?.rooms || [];
        const filteredRooms = allRooms
          .filter((r) =>
            r.name?.toLowerCase().includes(query.toLowerCase()) ||
            r.code?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);

        setResults({ products, rooms: filteredRooms });
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleProductClick = () => {
    navigate("/products");
    setShowDropdown(false);
    setQuery("");
  };

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
    setShowDropdown(false);
    setQuery("");
  };

  const hasResults = results.products.length > 0 || results.rooms.length > 0;

  return (
    <div className="search-bar-wrap" ref={dropdownRef}>
      <div className="search-bar-input-wrap">
        <AiOutlineSearch className="search-bar-icon" size={16} />
        <input
          className="search-bar-input"
          placeholder="Search products, rooms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
        />
        {query && (
          <button
            className="search-bar-clear"
            onClick={() => {
              setQuery("");
              setResults({ products: [], rooms: [] });
            }}
          >
            <AiOutlineClose size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && query && (
        <div className="search-bar-dropdown">
          {loading ? (
            <p className="search-bar-empty">Searching...</p>
          ) : !hasResults ? (
            <p className="search-bar-empty">
              No results for "<strong>{query}</strong>"
            </p>
          ) : (
            <>
              {/* Products */}
              {results.products.length > 0 && (
                <div className="search-bar-section">
                  <h4 className="search-bar-title">
                    <BsBag size={12} /> Products
                  </h4>
                  {results.products.map((p) => (
                    <div
                      key={p._id}
                      className="search-bar-item"
                      onClick={handleProductClick}
                    >
                      <div className="search-bar-thumb">
                        {p.thumbnail && <img src={p.thumbnail} alt={p.name} />}
                      </div>
                      <div className="search-bar-info">
                        <span className="search-bar-name">{p.name}</span>
                        <span className="search-bar-meta">
                          ₹{p.price?.toLocaleString("en-IN")} · {p.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rooms */}
              {results.rooms.length > 0 && (
                <div className="search-bar-section">
                  <h4 className="search-bar-title">
                    <BsDoorOpen size={12} /> Rooms
                  </h4>
                  {results.rooms.map((r) => (
                    <div
                      key={r._id}
                      className="search-bar-item"
                      onClick={() => handleRoomClick(r._id)}
                    >
                      <div className="search-bar-thumb room-thumb">
                        {r.name?.[0]?.toUpperCase() || "R"}
                      </div>
                      <div className="search-bar-info">
                        <span className="search-bar-name">{r.name}</span>
                        <span className="search-bar-meta">
                          Code: {r.code} · {r.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;