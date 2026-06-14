import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineSetting, AiOutlineSend, AiOutlineSmile } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import Avatar from "../../../components/ui/Avatar/Avatar";
import useChatStore from "../../../store/chat.store";
import useAuthStore from "../../../store/auth.store";
import "./ChatPanel.css";

function ChatMessage({ msg, isOwn }) {
  const isAI = msg.sender === "AI Host";
  return (
    <motion.div
      className={`chat-msg ${isOwn ? "own" : ""} ${isAI ? "ai-msg" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isOwn && (
        <Avatar name={msg.sender} size="xs" />
      )}
      <div className="chat-msg-body">
        {!isOwn && (
          <div className="chat-msg-meta">
            <span className="chat-msg-sender">{msg.sender}</span>
            <span className="chat-msg-time">{msg.time}</span>
          </div>
        )}
        <div className="chat-msg-bubble">{msg.content}</div>
        {isOwn && <span className="chat-msg-time own-time">{msg.time}</span>}
      </div>
    </motion.div>
  );
}

function TypingIndicator({ users }) {
  if (!users.length) return null;
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span /><span /><span />
      </div>
      <span className="typing-text">
        {users.join(", ")} {users.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
}

function ChatPanel({ room, onBack, onOpenMembers }) {
  const { messages, addMessage, typingUsers } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({
      id: Date.now().toString(),
      senderId: user?.id || "1",
      sender: user?.name || "You",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isTyping) setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 1500);
  };

  return (
    <div className="chat-panel">
      {/* Chat top bar */}
      <div className="chat-topbar">
        <button className="icon-btn" onClick={onBack} title="Back">
          <AiOutlineArrowLeft size={18} />
        </button>
        <div className="chat-room-info">
          <span className="chat-room-name">{room.name}</span>
          <span className="chat-room-status">
            <span className="online-dot" />
            {room.members} members online
          </span>
        </div>
        <div className="chat-topbar-actions">
          <button className="icon-btn show-mobile" onClick={onOpenMembers} title="Members">
            <BsPeopleFill size={18} />
          </button>
          <button className="icon-btn" title="Settings">
            <AiOutlineSetting size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <div className="chat-messages-inner">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                msg={msg}
                isOwn={msg.senderId === (user?.id || "1")}
              />
            ))}
          </AnimatePresence>
          <TypingIndicator users={typingUsers} />
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="chat-input-area">
        <button className="icon-btn chat-emoji-btn" title="Emoji">
          <AiOutlineSmile size={20} />
        </button>
        <input
          className="chat-input"
          placeholder="Message the group..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button
          className={`chat-send-btn ${input.trim() ? "active" : ""}`}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <AiOutlineSend size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
