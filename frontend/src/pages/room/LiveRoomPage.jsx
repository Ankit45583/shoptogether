import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MembersPanel from "./components/MembersPanel";
import ChatPanel from "./components/ChatPanel";
import RightPanel from "./components/RightPanel";
import { getRoomById } from "../../api/room.api";
import { getRoomMessages } from "../../api/message.api";
import { connectSocket, getSocket } from "../../lib/socket";
import "./LiveRoomPage.css";

function LiveRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  // ✨ NEW: AI states
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);

  /* ==========================================
     LOAD ROOM + MESSAGES
  ========================================== */

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const roomRes = await getRoomById(roomId);
        const roomData = roomRes.data.room;
        setRoom(roomData);
        setMembers(roomData.members || []);

        const msgRes = await getRoomMessages(roomId, 1, 50);
        setMessages(msgRes.data.messages || []);
      } catch (error) {
        toast.error("Failed to load room");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId, navigate]);

  /* ==========================================
     SOCKET.IO
  ========================================== */

  useEffect(() => {
    if (!room) return;

    const socket = connectSocket();
    if (!socket) {
      toast.error("Cannot connect to chat");
      return;
    }

    socket.emit("room:join", { roomId });

    /* ============ CHAT EVENTS ============ */

    socket.on("chat:new", ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat:message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, isDeleted: true, content: "This message was deleted" }
            : m
        )
      );
    });

    socket.on("chat:user_typing", ({ userId, name, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (prev.find((u) => u.userId === userId)) return prev;
          return [...prev, { userId, name }];
        } else {
          return prev.filter((u) => u.userId !== userId);
        }
      });
    });

    socket.on("chat:reaction_updated", ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, reactions } : m))
      );
    });

    /* ============ ROOM EVENTS ============ */

    socket.on("room:member_joined", ({ user }) => {
      toast.success(`${user.name} joined the room`);
    });

    socket.on("room:member_left", ({ user }) => {
      toast(`${user.name} left the room`);
    });

    /* ============ ✨ AI EVENTS ============ */

    socket.on("ai:recommendation", ({ recommendations }) => {
      setAiRecommendations(recommendations || []);
      toast.success(
        `🤖 AI generated ${recommendations?.length || 0} new recommendations!`
      );
    });

    socket.on("ai:thinking", ({ thinking }) => {
      setAiThinking(thinking);
      if (thinking) {
        toast.loading("🤖 AI is thinking...", { id: "ai-thinking" });
      } else {
        toast.dismiss("ai-thinking");
      }
    });

    /* ============ CLEANUP ============ */

    return () => {
      socket.off("chat:new");
      socket.off("chat:message_deleted");
      socket.off("chat:user_typing");
      socket.off("chat:reaction_updated");
      socket.off("room:member_joined");
      socket.off("room:member_left");
      socket.off("ai:recommendation");
      socket.off("ai:thinking");

      if (socket.connected) {
        socket.emit("room:leave", { roomId });
      }
    };
  }, [room, roomId]);

  /* ==========================================
     SEND MESSAGE
  ========================================== */

  const handleSendMessage = (content) => {
    const socket = getSocket();
    if (!socket) {
      toast.error("Not connected to chat");
      return;
    }

    socket.emit("chat:send", {
      roomId,
      content,
      type: "text",
    });
  };

  /* ==========================================
     TYPING
  ========================================== */

  const handleTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket) return;

    if (isTyping) {
      socket.emit("chat:typing_start", { roomId });
    } else {
      socket.emit("chat:typing_stop", { roomId });
    }
  };

  /* ==========================================
     LOADING / NOT FOUND
  ========================================== */

  if (loading) {
    return (
      <div className="live-room live-room--center">
        <p className="live-room-status">Loading room...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="live-room live-room--center">
        <p className="live-room-status">Room not found</p>
      </div>
    );
  }

  /* ==========================================
     MAIN RENDER
  ========================================== */

  return (
    <div className="live-room">
      <MembersPanel
        room={room}
        members={members}
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
      />

      <ChatPanel
        room={room}
        messages={messages}
        typingUsers={typingUsers}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onOpenMembers={() => setMembersOpen(true)}
        onBack={() => navigate("/dashboard")}
      />

      <RightPanel
        room={room}
        aiRecommendations={aiRecommendations}
        aiThinking={aiThinking}
      />
    </div>
  );
}

export default LiveRoomPage;