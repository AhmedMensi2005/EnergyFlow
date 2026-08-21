import { useEffect, useState } from "react";

import DeviceCard from "./components/DeviceCard";
import "./Monitoring.css";

import { getDevices } from "../../services/devices";
import { getLatestMeasurements, getDeviceChart } from "../../services/measurements";

export default function Monitoring() {

    const [devices, setDevices] = useState([]);


    const loadData = async () => {
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
          console.error("Error loading monitoring data:", error);
      }

    };


    useEffect(() => {
        loadData();
    }, []);

    return (

        <div className="monitoring-page">

            <div className="fade-top"></div>

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

            <div className="fade-bottom"></div>

        </div>

    );

}