import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineArrowLeft,
  AiOutlineMenu,
  AiOutlineSend,
} from "react-icons/ai";
import useAuthStore from "../../../store/auth.store";
import Avatar from "../../../components/ui/Avatar/Avatar";
import { getSocket } from "../../../lib/socket";
import "./ChatPanel.css";

const REACTION_EMOJIS = ["❤️", "🔥", "👍", "😂", "🎉", "💯", "🛒", "💸"];

function ChatPanel({
  room,
  messages = [],
  typingUsers = [],
  onSendMessage,
  onTyping,
  onOpenMembers,
  onOpenShop,
  onBack,
}) {
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);

  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const reactionIdRef = useRef(0);

  /* ==========================================
     AUTO SCROLL TO BOTTOM
  ========================================== */
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  /* ==========================================
     ✨ LISTEN FOR FLOATING REACTIONS
  ========================================== */
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !room?._id) return;

    const handleReaction = ({ emoji, sentBy }) => {
      const id = reactionIdRef.current++;
      const newReaction = {
        id,
        emoji,
        sentBy,
        // Random horizontal position (10% - 80% from left)
        left: 10 + Math.random() * 70,
      };

      setFloatingReactions((prev) => [...prev, newReaction]);

      // Auto-remove after animation
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
      }, 3500);
    };

    socket.on("reaction:new", handleReaction);
    return () => socket.off("reaction:new", handleReaction);
  }, [room?._id]);

  /* ==========================================
     SEND REACTION
  ========================================== */
  const sendReaction = (emoji) => {
    const socket = getSocket();
    if (!socket || !room?._id) return;

    socket.emit("reaction:send", { roomId: room._id, emoji });
  };

  /* ==========================================
     SEND MESSAGE
  ========================================== */
  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    onSendMessage(input.trim());
    setInput("");
    onTyping?.(false);
    clearTimeout(typingTimeoutRef.current);
  };

  /* ==========================================
     HANDLE TYPING
  ========================================== */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    onTyping?.(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      {/* ============ TOPBAR ============ */}
      <div className="chat-topbar">
  <button className="icon-btn show-mobile" onClick={onBack} title="Back">
    <AiOutlineArrowLeft size={18} />
  </button>
  <div className="chat-room-info">
    <h3 className="chat-room-name">{room?.name || "Loading..."}</h3>
    <div className="chat-room-status">
      <span className="online-dot" />
      {room?.members?.length || 0} members
    </div>
  </div>
</div>

      {/* ============ MESSAGES ============ */}
      <div className="chat-messages" ref={messagesContainerRef}>
        <div className="chat-messages-inner">
          {messages.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "40px",
              }}
            >
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => {
              const senderId = msg.sender?._id || msg.sender;
              const isOwn = senderId === user?._id || senderId === user?.id;

              return (
                <div key={msg._id} className={`chat-msg ${isOwn ? "own" : ""}`}>
                  {!isOwn && (
                    <Avatar
                      name={msg.sender?.name}
                      src={msg.sender?.avatar}
                      size="sm"
                    />
                  )}
                  <div className="chat-msg-body">
                    <div className="chat-msg-meta">
                      {!isOwn && (
                        <span className="chat-msg-sender">
                          {msg.sender?.name}
                        </span>
                      )}
                      <span className="chat-msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="chat-msg-bubble">
                      {msg.isDeleted ? (
                        <em style={{ opacity: 0.6 }}>
                          This message was deleted
                        </em>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="typing-text">
                {typingUsers.map((u) => u.name).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}
        </div>

        {/* ============ ✨ FLOATING REACTIONS LAYER ============ */}
        <div className="floating-reactions-layer">
          <AnimatePresence>
            {floatingReactions.map((r) => (
              <motion.div
                key={r.id}
                className="floating-reaction"
                style={{ left: `${r.left}%` }}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -250,
                  scale: [0.5, 1.2, 1, 0.8],
                  x: [0, 20, -20, 10],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  ease: "easeOut",
                }}
              >
                {r.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ============ ✨ EMOJI REACTION BAR ============ */}
      <AnimatePresence>
        {showEmojiBar && (
          <motion.div
            className="reaction-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="reaction-btn"
                onClick={() => sendReaction(emoji)}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ INPUT AREA ============ */}
      <form className="chat-input-area" onSubmit={handleSend}>
        <button
          type="button"
          className={`chat-emoji-btn icon-btn ${showEmojiBar ? "active" : ""}`}
          onClick={() => setShowEmojiBar((p) => !p)}
          title="Send reaction"
        >
          😀
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Message the group..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className={`chat-send-btn ${input.trim() ? "active" : ""}`}
          disabled={!input.trim()}
        >
          <AiOutlineSend size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;