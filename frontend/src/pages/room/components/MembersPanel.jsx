import "./MembersPanel.css";
function MembersPanel({ room, members = [], open, onClose }) {
  return (
    <>
      <div className={`members-overlay ${open ? "active" : ""} hide-desktop`} onClick={onClose} />

      <aside className={`members-panel ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="members-panel-header">
          <div>
            <h3 className="members-room-name">{room?.name}</h3>
            <div className="members-room-code">
              Code: {room?.code}
            </div>
          </div>
        </div>

        <div className="members-divider" />

        {/* Members List */}
        <div className="members-list-header">
          <span>Members</span>
          <span className="members-count">{members.length}</span>
        </div>

        <div className="members-list">
          {members.length === 0 ? (
            <div className="members-empty">No members yet</div>
          ) : (
            members.map((m) => (
              <div key={m._id || m.user?._id} className="member-item">
                <div className="member-avatar">
                  {m.user?.avatar ? (
                    <img src={m.user.avatar} alt={m.user?.name} />
                  ) : (
                    <div
                      className="avatar-fallback"
                      style={{
                        background: "var(--accent-purple)",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                      }}
                    >
                      {m.user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="member-online" />
                </div>
                <div className="member-info">
                  <span className="member-name">{m.user?.name}</span>
                  <span className="member-username">@{m.user?.username}</span>
                </div>
                {m.role === "host" && (
                  <span className="member-host">Host</span>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default MembersPanel;