import { useEffect, useState } from "react";

import DeviceCard from "./components/DeviceCard";
import "./Monitoring.css";

import { getDevices } from "../../services/devices";
import { getLatestMeasurements } from "../../services/measurements";

export default function Monitoring() {

    const [devices, setDevices] = useState([]);


    const loadData = async () => {
      try {
          const devicesData = await getDevices();
          const measurementsData = await getLatestMeasurements();
          const mergedDevices = devicesData.map((device) => {
            const measurement =
                measurementsData.find(
                    (m) => m.device === device.id
                ) || {};
            return {
                ...device,
                measurement,
                chart: [
                    { time: "09:00", power: 650 },
                    { time: "10:00", power: 720 },
                    { time: "11:00", power: 780 },
                    { time: "12:00", power: 850 },
                    { time: "13:00", power: 820 },
                    { time: "14:00", power: 870 },
                ],
            };
          });
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

            <div className="devices-container">

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