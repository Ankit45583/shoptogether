import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MOCK_ROOMS } from "../../config/constants";
import MembersPanel from "./components/MembersPanel";
import ChatPanel from "./components/ChatPanel";
import RightPanel from "./components/RightPanel";
import "./LiveRoomPage.css";

function LiveRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = MOCK_ROOMS.find((r) => r.id === roomId) || MOCK_ROOMS[0];
  const [membersOpen, setMembersOpen] = useState(false);

  useEffect(() => {
    // Body pe class add karo
    document.body.classList.add("room-page-open");
    document.documentElement.classList.add("room-page-open");
    
    return () => {
      // Cleanup
      document.body.classList.remove("room-page-open");
      document.documentElement.classList.remove("room-page-open");
    };
  }, []);

  return (
    <div className="live-room">
      <MembersPanel
        room={room}
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
      />
      <ChatPanel
        room={room}
        onOpenMembers={() => setMembersOpen(true)}
        onBack={() => navigate("/dashboard")}
      />
      <RightPanel room={room} />
    </div>
  );
}

export default LiveRoomPage;