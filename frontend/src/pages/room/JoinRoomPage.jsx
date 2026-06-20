import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";
import { joinRoom, getPublicRooms } from "../../api/room.api";
import "./JoinRoomPage.css";

function JoinRoomPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  /* ==========================================
     LOAD PUBLIC ROOMS
  ========================================== */

  useEffect(() => {
    loadPublicRooms();
  }, []);

  const loadPublicRooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await getPublicRooms(1, 20);
      setPublicRooms(response.data.rooms || []);
    } catch (error) {
      toast.error("Failed to load public rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  /* ==========================================
     JOIN ROOM HANDLER
  ========================================== */

  const handleJoin = async (roomCode) => {
    const finalCode = roomCode || code;

    if (!finalCode || finalCode.length !== 6) {
      toast.error("Please enter a valid 6-character code");
      return;
    }

    setLoading(true);

    try {
      const response = await joinRoom(finalCode.toUpperCase());
      const room = response.data.room;

      toast.success(`Joined "${room.name}"!`);
      navigate(`/rooms/${room._id}`);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to join room";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-room-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="page-title">Join a Room</h1>
          <p className="page-subtitle">
            Enter a room code or browse public rooms
          </p>
        </div>
      </div>

      {/* Join by Code */}
      <div className="join-section">
        <h3 className="section-title">Join by Code</h3>
        <div className="join-code-form">
          <input
            type="text"
            className="join-code-input"
            placeholder="ABC123"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={() => handleJoin()}
          >
            Join Room
          </Button>
        </div>
      </div>

      {/* Public Rooms */}
      <div className="join-section">
        <h3 className="section-title">Browse Public Rooms</h3>

        {loadingRooms ? (
          <p className="loading-text">Loading rooms...</p>
        ) : publicRooms.length === 0 ? (
          <p className="empty-text">No public rooms available</p>
        ) : (
          <div className="public-rooms-list">
            {publicRooms.map((room) => (
              <div key={room._id} className="public-room-card">
                <div className="public-room-info">
                  <h4>{room.name}</h4>
                  <p>
                    Hosted by {room.host?.name} · {room.members?.length || 0}/
                    {room.maxMembers} members
                  </p>
                  <Badge variant="purple">{room.category}</Badge>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleJoin(room.code)}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinRoomPage;