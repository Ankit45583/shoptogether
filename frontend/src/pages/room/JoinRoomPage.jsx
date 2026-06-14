import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";
import { MOCK_ROOMS, CATEGORIES } from "../../config/constants";
import { sleep } from "../../lib/utils";
import "./JoinRoomPage.css";

function JoinRoomPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRefs = useRef([]);

  // Handle code box input
  const handleCodeInput = (i, val) => {
    const char = val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(-1);
    const next = [...code];
    next[i] = char;
    setCode(next);
    if (char && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setCode(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  const handleJoinByCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) { toast.error("Enter full 6-character code"); return; }

    setLoading(true);
    await sleep(700);
    setLoading(false);

    const room = MOCK_ROOMS.find((r) => r.code === fullCode);
    if (room) {
      toast.success(`Joining "${room.name}"!`);
      navigate(`/rooms/${room.id}`);
    } else {
      toast.error("Room not found. Check the code and try again.");
    }
  };

  const publicRooms = MOCK_ROOMS.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.host.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return r.type === "public" && matchSearch && matchCat;
  });

  return (
    <div className="join-room-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={20} /> Back
        </button>
        <h1 className="page-title">Join a Room</h1>
      </div>

      {/* Join by Code */}
      <div className="join-card">
        <h3 className="join-card-title">Enter Room Code</h3>
        <p className="join-card-sub">Ask your friend for the 6-character room code</p>
        <div className="code-inputs" onPaste={handleCodePaste}>
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className="code-box"
              value={c}
              maxLength={1}
              onChange={(e) => handleCodeInput(i, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(i, e)}
            />
          ))}
        </div>
        <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleJoinByCode}>
          Join Room
        </Button>
      </div>

      {/* Browse Public Rooms */}
      <div className="browse-section">
        <h3 className="section-heading">Browse Public Rooms</h3>

        <div className="browse-controls">
          <div className="browse-search">
            <AiOutlineSearch className="search-icon" size={16} />
            <input
              className="browse-search-input"
              placeholder="Search rooms or hosts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="public-rooms-list">
          {publicRooms.length === 0 ? (
            <div className="empty-browse">
              <p>😕 No rooms found. Try a different filter.</p>
            </div>
          ) : (
            publicRooms.map((room) => (
              <div key={room.id} className="public-room-card">
                <div className="public-room-info">
                  <div className="public-room-top">
                    <h4 className="public-room-name">{room.name}</h4>
                    <Badge variant="purple">{room.category}</Badge>
                  </div>
                  <p className="public-room-meta">
                    Hosted by <strong>{room.host}</strong> · {room.members}/{room.maxMembers} members
                  </p>
                  <p className="public-room-code">Code: <span>{room.code}</span></p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    toast.success(`Joining "${room.name}"!`);
                    await sleep(400);
                    navigate(`/rooms/${room.id}`);
                  }}
                >
                  Join
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default JoinRoomPage;
