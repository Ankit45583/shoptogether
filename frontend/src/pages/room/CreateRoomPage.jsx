import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineCopy,
  AiOutlineCheck,
  AiOutlineTeam,
  AiOutlineSetting,
} from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import useRoomStore from "../../store/room.store";
import { generateRoomCode, copyToClipboard, sleep } from "../../lib/utils";
import "./CreateRoomPage.css";

const categories = ["Fashion", "Electronics", "Beauty", "Home", "Sports", "Books"];

/* ==========================================
   TOGGLE COMPONENT
========================================== */

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row-info">
        <span className="toggle-label">{label}</span>
        {description && <span className="toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        className={`toggle ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

/* ==========================================
   CREATE ROOM PAGE
========================================== */

function CreateRoomPage() {
  const navigate = useNavigate();
  const { addRoom } = useRoomStore();

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Fashion",
    type: "public",
    maxMembers: 20,
    allowChat: true,
    allowVoting: true,
    allowSharing: true,
    aiHost: true,
  });

  const set = (key) => (val) =>
    setForm((p) => ({
      ...p,
      [key]: val instanceof Object && val.target ? val.target.value : val,
    }));

  /* ==========================================
     SUBMIT HANDLER
  ========================================== */

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    if (form.name.trim().length < 2) {
      toast.error("Room name must be at least 2 characters");
      return;
    }

    if (form.maxMembers < 2 || form.maxMembers > 50) {
      toast.error("Members must be between 2 and 50");
      return;
    }

    setLoading(true);

    try {
      await sleep(700);

      const room = {
        ...form,
        id: Date.now().toString(),
        code: generateRoomCode(),
        members: 1,
        status: "active",
        host: "You",
      };

      addRoom(room);
      setCreated(room);
      toast.success("Room created successfully!");
    } catch {
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     COPY HANDLER
  ========================================== */

  const handleCopy = async () => {
    await copyToClipboard(created.code);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ==========================================
     SUCCESS SCREEN
  ========================================== */

  if (created) {
    return (
      <div className="create-room-page">
        <div className="create-room-success">
          <div className="success-icon">
            <AiOutlineCheck size={40} />
          </div>

          <div>
            <h2>Room Created!</h2>
            <p className="success-subtitle">
              Share this code with your friends to invite them to your shopping room
            </p>
          </div>

          <div className="room-code-display">
            <span className="room-code-text">{created.code}</span>
            <button
              className={`copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              aria-label="Copy room code"
            >
              {copied ? <AiOutlineCheck size={18} /> : <AiOutlineCopy size={18} />}
            </button>
          </div>

          <div className="success-actions">
            <Button
              variant="secondary"
              onClick={() => {
                copyToClipboard(created.code);
                toast.success("Invite copied!");
              }}
            >
              Share Invite
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/rooms/${created.id}`)}
            >
              Enter Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================
     FORM SCREEN
  ========================================== */

  return (
    <div className="create-room-page">
      
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="page-title">Create Shopping Room</h1>
          <p className="page-subtitle">
            Set up a new room and invite your friends to shop together
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="create-room-form" onSubmit={handleCreate}>
        
        {/* Room Details Card */}
        <div className="form-card">
          <h3 className="form-section-title">
            <AiOutlineTeam className="form-section-title-icon" size={20} />
            Room Details
          </h3>

          <div className="form-group">
            <label className="form-label">
              Room Name
              <span className="form-label-hint">{form.name.length}/50</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., Weekend Fashion Haul"
              maxLength={50}
              value={form.name}
              onChange={set("name")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Description
              <span className="form-label-hint">Optional</span>
            </label>
            <textarea
              className="textarea"
              placeholder="What are you shopping for today?"
              value={form.description}
              onChange={set("description")}
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={set("category")}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${form.type === "public" ? "active" : ""}`}
                onClick={() => set("type")("public")}
              >
                🌐 Public
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === "private" ? "active" : ""}`}
                onClick={() => set("type")("private")}
              >
                🔒 Private
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Max Members
              <span className="form-label-hint">2-50 members</span>
            </label>
            <input
              className="form-input"
              type="number"
              min="2"
              max="50"
              value={form.maxMembers}
              onChange={set("maxMembers")}
            />
          </div>
        </div>

        {/* Room Settings Card */}
        <div className="form-card">
          <h3 className="form-section-title">
            <AiOutlineSetting className="form-section-title-icon" size={20} />
            Room Settings
          </h3>

          <Toggle
            label="Allow Chat"
            description="Members can send messages in the room"
            checked={form.allowChat}
            onChange={set("allowChat")}
          />

          <Toggle
            label="Allow Voting"
            description="Members can vote on shared products"
            checked={form.allowVoting}
            onChange={set("allowVoting")}
          />

          <Toggle
            label="Allow Product Sharing"
            description="Members can share products to the room"
            checked={form.allowSharing}
            onChange={set("allowSharing")}
          />

          <Toggle
            label="Enable AI Host"
            description="Get smart recommendations powered by AI"
            checked={form.aiHost}
            onChange={set("aiHost")}
          />
        </div>

        {/* Submit Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
          >
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRoomPage;