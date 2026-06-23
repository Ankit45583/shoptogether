import "./MembersPanel.css";

function MembersPanel({ room, members = [] }) {
  return (
    <aside className="members-panel">
      <div className="members-panel-header">
        <div>
          <h3 className="members-room-name">{room?.name}</h3>
          <div className="members-room-code">Code: {room?.code}</div>
        </div>
      </div>

      <div className="members-divider" />

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
                  <div className="avatar-fallback">
                    {m.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="member-online" />
              </div>
              <div className="member-info">
                <span className="member-name">{m.user?.name}</span>
                <span className="member-username">@{m.user?.username}</span>
              </div>
              {m.role === "host" && <span className="member-host">Host</span>}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default MembersPanel;