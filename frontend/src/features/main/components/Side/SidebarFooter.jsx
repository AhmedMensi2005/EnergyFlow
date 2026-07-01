export default function SidebarFooter({ username, role, avatar }) {
  return (
    <div className="sidebar-footer">
      <div className="user-section">
        <img
          src={avatar}
          alt="avatar"
          className="user-avatar"
        />

        <div className="user-info">
          <span className="user-name">{username}</span>
          <span className="user-role">{role}</span>
        </div>
      </div>

      <span className="logout-icon">↪</span>
    </div>
  );
}