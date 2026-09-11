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
import { getUnsolvedAlerts } from "../../services/alertService";


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

    const [alertsData, setAlertsData] = useState({
        total_alerts: 0,
        unsolved_alerts: [],
    });


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

    useEffect(() => {

        const loadAlerts = async () => {

            try {

                const response = await getUnsolvedAlerts();

                console.log("UNSOLVED alerts response:", response);

                setAlertsData(response);

            } catch (error) {

                console.error(
                    "Error loading alerts:",
                    error
                );

            }

        };

        loadAlerts();

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
                    alerts={alertsData}
                    active={selectedView === "alerts"}
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
                    alerts={alertsData}
                />

            </div>

        </div>

    );
}

export default DashboardPage;