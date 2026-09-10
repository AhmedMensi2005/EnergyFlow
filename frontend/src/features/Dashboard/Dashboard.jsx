import "./Dashboard.css";

import { useEffect, useState } from "react";

import EnergyOverviewSection from "./sections/EnergyOverviewSection";
import DeviceStatusSection from "./sections/DeviceStatusSection";
import ActiveDevicesKpi from "./sections/ActiveDevicesKpi";
import UnsolvedAlertsKpi from "./sections/UnsolvedAlertsKpi";
import DashboardListSection from "./sections/DashboardListSection";
import RoomDistributionSection from "./sections/RoomDistributionSection.jsx";
import EnvironmentSection from "./sections/EnvironmentSection.jsx";

import { getOnDevices } from "../../services/devices.js";


function DashboardPage() {

    // ==========================
    // Selected dashboard view
    // ==========================

    const [selectedView, setSelectedView] = useState("devices");


    // ==========================
    // Devices data
    // ==========================

    const [devicesData, setDevicesData] = useState({
        total_devices: 0,
        on_devices: [],
    });


    // ==========================
    // Alerts
    // ==========================

    const [alerts] = useState([
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
    ]);


    // ==========================
    // Load devices
    // ==========================

    useEffect(() => {

        const loadDevices = async () => {

            try {

                const response = await getOnDevices();
                console.log("ON devices response:", response);
                setDevicesData(response);

            } catch (error) {

                console.error(
                    "Error loading devices:",
                    error
                );

            }

        };

        loadDevices();

    }, []);


    return (

        <div className="dashboard">

            <div className="active-devices-kpi">

                <ActiveDevicesKpi
                    data={devicesData}
                    active={selectedView === "devices"}
                    onClick={() =>setSelectedView("devices")}
                />

            </div>


            <div className="unsolved-alerts-kpi">

                <UnsolvedAlertsKpi
                    alerts={alerts}
                    active={
                        selectedView === "alerts"
                    }
                    onClick={() =>
                        setSelectedView("alerts")
                    }
                />

            </div>

            <div className="environment-section">

                <EnvironmentSection />

            </div>


            <div className="energy-overview-section">

                <EnergyOverviewSection />

            </div>


            <div className="device-status-section">

                <DeviceStatusSection />

            </div>


            <div className="room-distribution-percentage-section">

                <RoomDistributionSection />

            </div>

            <div className="dashboard-list-section">

                <DashboardListSection
                    view={selectedView}
                    data={devicesData}
                    alerts={alerts}
                />

            </div>

        </div>

    );
}

export default DashboardPage;