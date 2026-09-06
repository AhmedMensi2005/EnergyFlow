import ConsumptionBarChart from "../components/barChart.jsx";

import { useState, useEffect } from "react";
import { getTopDevicesAnalytics } from "../../../services/analytics.js";

import "./style.css";

function DeviceConsumptionSection({ period, metric }) {

    const [data, setData] = useState([]);

    const loadTopDevices = async () => {
        try {
            const response = await getTopDevicesAnalytics(period,metric);
            setData(response.data || []);
        } catch (error) {
            console.error("Error loading devices analytics:",error);
        } 
    };

    useEffect(() => {
        loadTopDevices();
    }, [period, metric]);
    return (
        <section className="consumption-section">

            <div className="section-header">
                <div>
                    <h2>{metric.charAt(0).toUpperCase() + metric.slice(1)} consumption by device</h2>
                    <span>Consumption per device</span>
                </div>
            </div>

            <ConsumptionBarChart
                data={data}
                dataKey="consumption"
            />

        </section>
    );
}

export default DeviceConsumptionSection;