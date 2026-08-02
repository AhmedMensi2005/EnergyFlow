import "./styleHeader.css";

import settingsIcon from "../../../../assets/settings.svg";
import bellIcon from "../../../../assets/bell.svg";

export default function HeaderStructure({
  title = "Dashboard",
  username = "John Doe",
  role = "Admin",
  avatar = "?",
}) {

  return (

    <header className="main-header">

      <div className="header-container">


        <div className="header-left">

          <div className="menu-title-box">

            <h1>
              {title}
            </h1>

          </div>

        </div>



        <div className="header-menu">


          <div className="menu-icons">

            <button
              className="menu-icon-btn"
              title="Settings"
            >

              <img
                src={settingsIcon}
                alt="Settings"
              />

            </button>


            <button
              className="menu-icon-btn"
              title="Notifications"
            >

              <img
                src={bellIcon}
                alt="Notifications"
              />

            </button>

          </div>




          <div className="menu-user-section">


            <div className="menu-user-avatar">

              {avatar}

            </div>

          </div>


        </div>


      </div>


    </header>

  );

}