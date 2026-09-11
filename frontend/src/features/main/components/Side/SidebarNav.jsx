import SidebarItem from "./navItem";

import DashboardIcon from "../../../../assets/Dashboard.svg";
import MonitoringIcon from "../../../../assets/Monitoring.svg";
import AnalyticsIcon from "../../../../assets/Analytics.svg";
import RoomsIcon from "../../../../assets/Rooms.svg";
import AirConditionerIcon from "../../../../assets/AirConditioner.svg";
import OperatorsIcon from "../../../../assets/Operators.svg";
import AlertsIcon from "../../../../assets/Alerts.svg";

import { FiDownload } from "react-icons/fi";

export default function SidebarNav({
    activePage,
    setActivePage,
    onExport,
}) {
    return (
        <div className="sidebar-nav">

            {/* OVERVIEW */}
            <p className="sidebar-section-label">Overview</p>

            <SidebarItem
                label="Dashboard"
                active={activePage === "Dashboard"}
                onClick={setActivePage}
                icon={<img src={DashboardIcon} alt="dashboard" />}
            />

            <SidebarItem
                label="Monitoring"
                active={activePage === "Monitoring"}
                onClick={setActivePage}
                icon={<img src={MonitoringIcon} alt="monitoring" />}
            />


            {/* ANALYSIS */}
            <p className="sidebar-section-label">Analysis</p>

            <SidebarItem
                label="Analytics"
                active={activePage === "Analytics"}
                onClick={setActivePage}
                icon={<img src={AnalyticsIcon} alt="analytics" />}
            />

            

            {/* MANAGEMENT */}
            <p className="sidebar-section-label">Management</p>

            <SidebarItem
                label="Devices"
                active={activePage === "Devices"}
                onClick={setActivePage}
                icon={<img src={AirConditionerIcon} alt="air conditioners" />}
            />
            
            <SidebarItem
                label="Rooms"
                active={activePage === "Rooms"}
                onClick={setActivePage}
                icon={<img src={RoomsIcon} alt="rooms" />}
            />

            <SidebarItem
                label="Users"
                active={activePage === "Users"}
                onClick={setActivePage}
                icon={<img src={OperatorsIcon} alt="users" />}
            />


            {/* ALERTS */}
            <p className="sidebar-section-label">Supervision</p>

            <SidebarItem
                label="Alerts"
                active={activePage === "Alerts"}
                onClick={setActivePage}
                icon={<img src={AlertsIcon} alt="alerts" />}
            />

            <button className="export-btn" onClick={onExport}>
                <FiDownload />
                Export Data
            </button>


        </div>
    );
}