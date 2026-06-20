import { useState, useRef, useEffect } from "react";
import { AiOutlineArrowLeft, AiOutlineMenu, AiOutlineSend, AiOutlineSmile } from "react-icons/ai";
import useAuthStore from "../../../store/auth.store";
import Avatar from "../../../components/ui/Avatar/Avatar";
import "./ChatPanel.css";

function ChatPanel({
  room,
  messages = [],
  typingUsers = [],
  onSendMessage,
  onTyping,
  onOpenMembers,
  onBack,
}) {
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null); // ✨ NEW: container ref
  const typingTimeoutRef = useRef(null);

  /* ==========================================
     ✅ FIXED: AUTO SCROLL — only inside container
  ========================================== */

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Scroll only the messages container, NOT the whole page
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

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
      {/* Top bar */}
      <div className="chat-topbar">
        <button className="icon-btn show-mobile" onClick={onBack}>
          <AiOutlineArrowLeft size={18} />
        </button>
        <button className="icon-btn show-mobile" onClick={onOpenMembers}>
          <AiOutlineMenu size={18} />
        </button>
        <div className="chat-room-info">
          <h3 className="chat-room-name">{room?.name || "Loading..."}</h3>
          <div className="chat-room-status">
            <span className="online-dot" />
            {room?.members?.length || 0} members
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Added ref to container instead of dummy div */}
      <div className="chat-messages" ref={messagesContainerRef}>
        <div className="chat-messages-inner">
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
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
                        <span className="chat-msg-sender">{msg.sender?.name}</span>
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
                        <em style={{ opacity: 0.6 }}>This message was deleted</em>
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
                <span /><span /><span />
              </div>
              <span className="typing-text">
                {typingUsers.map((u) => u.name).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <form className="chat-input-area" onSubmit={handleSend}>
        <button type="button" className="chat-emoji-btn icon-btn">
          <AiOutlineSmile size={20} />
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