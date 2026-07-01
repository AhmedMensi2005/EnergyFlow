import Side from "./components/Side/Side";
import Header from "./components/header/header";
import "./styleMain.css"
import { useState } from "react";

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
          {activePage === "Operators" && <Operators />}
          {activePage === "Alerts" && <Alerts />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return <h1>Dashboard</h1>;
}

function Monitoring() {
  return <h1>Monitoring</h1>;
}

function Analytics() {
  return <h1>Analytics</h1>;
}

function Rooms() {
  return <h1>Rooms</h1>;
}

function AirConditioners() {
  return <h1>Air Conditioners</h1>;
}

function Operators() {
  return <h1>Operators</h1>;
}

function Alerts() {
  return <h1>Alerts</h1>;
}