//main components
import Side from "./components/Side/Side";
import Header from "./components/header/header";

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
export default function Main() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="main">
      <div className="nav">
        <Side activePage={activePage} setActivePage={setActivePage}/>
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
          {activePage === "Air Conditioners" && <AirConditioners />}
          {activePage === "Users" && <Users />}
          {activePage === "Alerts" && <Alerts />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return <h1>Dashboard</h1>;
}


function Analytics() {
  return <h1>Analytics</h1>;
}


function AirConditioners() {
  return <h1>Air Conditioners</h1>;
}


function Alerts() {
  return <h1>Alerts</h1>;
}