import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { BsPersonPlus } from "react-icons/bs";
import Avatar from "../../../components/ui/Avatar/Avatar";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";
import { MOCK_USERS } from "../../../config/constants";
import { copyToClipboard } from "../../../lib/utils";
import toast from "react-hot-toast";
import "./MembersPanel.css";

const members = MOCK_USERS.map((u, i) => ({ ...u, online: i < 4, role: i === 0 ? "Host" : "Member" }));

function MembersPanel({ room, open, onClose }) {
  const handleCopy = async () => {
    await copyToClipboard(room.code);
    toast.success("Room code copied!");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="members-overlay" onClick={onClose} />}

      <aside className={`members-panel ${open ? "open" : ""}`}>
        <div className="members-panel-header">
          <div>
            <h3 className="members-room-name">{room.name}</h3>
            <div className="members-room-code">
              <span>{room.code}</span>
              <button onClick={handleCopy} className="icon-btn" title="Copy code">
                <AiOutlineCopy size={14} />
              </button>
            </div>
          </div>
          <button className="icon-btn hide-desktop" onClick={onClose}>
            <AiOutlineClose size={18} />
          </button>
        </div>

        <Button variant="secondary" size="sm" fullWidth leftIcon={<BsPersonPlus size={14} />} onClick={() => { copyToClipboard(room.code); toast.success("Invite link copied!"); }}>
          Invite Friends
        </Button>

        <div className="members-divider" />

        <div className="members-list-header">
          <span>Online Members</span>
          <span className="members-count">{members.filter((m) => m.online).length}</span>
        </div>

        <div className="members-list">
          {members.map((m) => (
            <div key={m.id} className="member-item">
              <Avatar name={m.name} size="sm" online={m.online} />
              <div className="member-info">
                <span className="member-name">{m.name}</span>
                <span className="member-username">@{m.username}</span>
              </div>
              <Badge variant={m.role === "Host" ? "purple" : "default"}>{m.role}</Badge>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default MembersPanel;
