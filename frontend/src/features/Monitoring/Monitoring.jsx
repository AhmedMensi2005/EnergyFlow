import { useEffect, useState } from "react";

import DeviceCard from "./components/DeviceCard";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";

import "./Monitoring.css";

import { getDevices } from "../../services/devices";
import {
    getLatestMeasurements,
    getDeviceChart,
} from "../../services/measurements";


export default function Monitoring() {

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);


    const loadData = async () => {
        setLoading(true);

        try {
            const devicesData = await getDevices();
            const measurementsData = await getLatestMeasurements();

            const mergedDevices = await Promise.all(
                devicesData.map(async (device) => {

                    const measurement =
                        measurementsData.find(
                            (m) => m.device === device.id
                        ) || {};

                    const chart = await getDeviceChart(device.id);

                    return {
                        ...device,
                        measurement,
                        chart,
                    };
                })
            );

            setDevices(mergedDevices);

        } catch (error) {
            console.error(
                "Error loading monitoring data:",
                error
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);


    return (
        <div className="monitoring-page">

            <div className="fade-top"></div>

            {loading ? (
                <div className="monitoring-loading">
                    <LoadingSpinner text="Loading monitoring data..." />
                </div>
            ) : (
                <div className="devices-container-cards">

                    {devices.map((device) => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            measurement={device.measurement}
                            chartData={device.chart}
                        />
                    ))}

                </div>
            )}

            <div className="fade-bottom"></div>

        </div>
    );
}