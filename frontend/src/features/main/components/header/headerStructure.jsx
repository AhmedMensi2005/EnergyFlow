import "./styleHeader.css";

import settingsIcon from "../../../../assets/settings.svg";
import bellIcon from "../../../../assets/bell.svg";

export default function HeaderStructure({
  title = "Dashboard",
  username = "John Doe",
  role = "Admin",
  avatar = "https://via.placeholder.com/40",
}) {
  return (
    <header className="main-header">
      <div className="header-container">

        {/* Left Side */}
        <div className="header-left">
          <div className="menu-title-box">
            <h1>{title}</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="header-menu">

          <div className="menu-icons">
            <button className="menu-icon-btn" title="Settings">
              <img src={settingsIcon} alt="Settings" />
            </button>

            <button className="menu-icon-btn" title="Notifications">
              <img src={bellIcon} alt="Notifications" />
            </button>
          </div>

          <div className="menu-user-section">
            <img
              src={avatar}
              alt="User avatar"
              className="menu-user-avatar"
            />

            <div className="menu-user-info">
              <span className="menu-user-name">{username}</span>
              <span className="menu-user-role">{role}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}