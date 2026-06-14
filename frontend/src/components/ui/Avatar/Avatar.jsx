import { useState } from "react";
import "./Avatar.css";
import { getInitials, getAvatarColor } from "../../../lib/utils";

/* ==========================================
   AVATAR
========================================== */

function Avatar({
  name = "",
  src = "",
  size = "md",
  online = false,
  showStatus = false,
  className = "",
  onClick,
}) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <div
      className={[
        "avatar",
        `avatar-${size}`,
        online ? "avatar-online" : "",
        onClick ? "avatar-clickable" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      title={name}
    >
      {/* Image */}
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="avatar-fallback"
          style={{ background: getAvatarColor(name) }}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online status dot */}
      {(online || showStatus) && (
        <span className={`avatar-status ${online ? "online" : "offline"}`} />
      )}
    </div>
  );
}

/* ==========================================
   AVATAR GROUP
========================================== */

export function AvatarGroup({ users = [], max = 3, size = "sm" }) {
  if (!users || users.length === 0) return null;

  const shown = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="avatar-group">
      {shown.map((u) => (
        <Avatar
          key={u.id || u._id || u.name}
          name={u.name}
          src={u.avatar}
          size={size}
        />
      ))}

      {extra > 0 && (
        <div className={`avatar avatar-${size} avatar-extra`}>+{extra}</div>
      )}
    </div>
  );
}

export default Avatar;