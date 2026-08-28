//main components
import Side from "./components/Side/Side";
import Header from "./components/header/header";
import ExportModal from "./components/ExportModal.jsx";

//style sheets
import "./styleMain.css"
import "../../styles/variables.css";
import "../../styles/global.css";

//react use state
import { useState } from "react";

//content pages
import Monitoring from "../Monitoring/Monitoring.jsx"
import Rooms from "../Rooms/Rooms.jsx"
import Users from "../Users/pages/Users.jsx";
import Devices from "../Devices/Devices.jsx";
import Analytics from "../Analytics/Analytics.jsx";

export default function Main() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="main">
      <div className="nav">
        <Side activePage={activePage} setActivePage={setActivePage} onExport={() => setShowModal(true)}/>
      </div>
      <div className="header-area">
        <Header label={activePage}/>
      </div>
      <div className="content">
        <div className="content-wrapper">
          {activePage === "Dashboard" && <DashboardPage />}
          {activePage === "Monitoring" && <Monitoring />}
          {activePage === "Analytics" && <Analytics />}
          {activePage === "Rooms" && <Rooms />}
          {activePage === "Users" && <Users />}
          {activePage === "Devices" && <Devices />}
          {activePage === "Alerts" && <Alerts />}
        </div>
      </div>
      {showModal && (
          <ExportModal
              onClose={() => setShowModal(false)}
          />
      )}
    </div>
  );
}

function DashboardPage() {
  return <h1>Dashboard</h1>;
}








function Alerts() {
  return <h1>Alerts</h1>;
}