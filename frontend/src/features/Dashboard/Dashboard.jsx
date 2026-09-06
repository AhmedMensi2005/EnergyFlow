import "./Dashboard.css";

import { useState } from "react";

import EnergyOverviewSection from "./sections/EnergyOverviewSection";
import DeviceStatusSection from "./sections/DeviceStatusSection";
import ActiveDevicesKpi from "./sections/ActiveDevicesKpi";
import UnsolvedAlertsKpi from "./sections/UnsolvedAlertsKpi";
import DashboardListSection from "./sections/DashboardListSection";



function DashboardPage() {

    const [selectedView, setSelectedView] =
        useState("devices");

    const devices = [
        {
            id: 1,
            name: "AC Living Room",
            status: "on",
            room: "Living Room",
        },
        {
            id: 2,
            name: "AC Bedroom",
            status: "off",
            room: "Bedroom",
        },
        {
            id: 3,
            name: "AC Office",
            status: "on",
            room: "Office",
        },
        {
            id: 4,
            name: "AC Kitchen",
            status: "on",
            room: "Kitchen",
        },
    ];

    const alerts = [
        {
            id: 1,
            name: "High temperature",
            description: "Living Room",
            resolved: false,
        },
        {
            id: 2,
            name: "High power",
            description: "Bedroom",
            resolved: true,
        },
        {
            id: 3,
            name: "Device offline",
            description: "Office",
            resolved: false,
        },
    ];


    return (

        <div className="dashboard">

            <div className="div1">
                <ActiveDevicesKpi
                    devices={devices}
                    active={selectedView === "devices"}
                    onClick={() =>
                        setSelectedView("devices")
                    }
                />
            </div>

            <div className="div2">
                <UnsolvedAlertsKpi
                    alerts={alerts}
                    active={selectedView === "alerts"}
                    onClick={() =>
                        setSelectedView("alerts")
                    }
                />
            </div>

            <div className="div3">
            </div>

            <div className="energy-overview-section">

                <EnergyOverviewSection />

            </div>

            <div className="device-status-section">

                <DeviceStatusSection />
            
            </div>

            <div className="div6">
            </div>

            <div className="div7">
                <DashboardListSection
                    view={selectedView}
                    devices={devices}
                    alerts={alerts}
                />
            </div>

        </div>

    );
}

export default DashboardPage;