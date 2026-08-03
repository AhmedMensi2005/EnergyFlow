import SidebarItem from "./navItem";
import DashboardIcon from "../../../../assets/Dashboard.svg";
import MonitoringIcon from "../../../../assets/Monitoring.svg";
import AnalyticsIcon from "../../../../assets/Analytics.svg";
import RoomsIcon from "../../../../assets/Rooms.svg";
import AirConditionerIcon from "../../../../assets/AirConditioner.svg";
import OperatorsIcon from "../../../../assets/Operators.svg";
import AlertsIcon from "../../../../assets/Alerts.svg";
import { FiDownload } from "react-icons/fi";

export default function SidebarNav({activePage, setActivePage, onExport,}) {
  
  return (
    <div className="sidebar-nav">
      <SidebarItem label="Dashboard" active={activePage === "Dashboard"} onClick={setActivePage} icon={<img src={DashboardIcon} alt="dashboard"></img>}icon={<img src={DashboardIcon} alt="dashboard"></img>} />
      <SidebarItem label="Monitoring" active={activePage === "Monitoring"} onClick={setActivePage} icon={<img src={MonitoringIcon} alt="monitoring"></img>} />
      <SidebarItem label="Analytics" active={activePage === "Analytics"} onClick={setActivePage} icon={<img src={AnalyticsIcon} alt="analitics"></img>} />
      <SidebarItem label="Rooms" active={activePage === "Rooms"} onClick={setActivePage} icon={<img src={RoomsIcon} alt="rooms"></img>} />
      <SidebarItem label="Devices" active={activePage === "Devices"} onClick={setActivePage} icon={<img src={AirConditionerIcon} alt="airconditioners"></img>} />
      <SidebarItem label="Operators" active={activePage === "Operators"} onClick={setActivePage} icon={<img src={OperatorsIcon} alt="operators"></img>} />
      <SidebarItem label="Alerts" active={activePage === "Alerts"} onClick={setActivePage} icon={<img src={AlertsIcon} alt="alerts"></img>} />
      <button className="export-btn" onClick={onExport}>
          <FiDownload />
          Export Data
      </button>
    </div>
  );
}