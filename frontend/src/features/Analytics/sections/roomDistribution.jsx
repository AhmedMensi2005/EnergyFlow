import PieChart from "../components/pieChart.jsx";

import { useState, useEffect } from "react";
import { getRoomDistributionAnalytics } from "../../../services/analytics.js";

import "./style.css";

function RoomDistributionSection({ period, metric }) {

    const [data, setData] = useState([]);

    const loadRoomDistribution = async () => {
        try {
            const response = await getRoomDistributionAnalytics(period, metric);
            setData(response.data || []);
        } catch (error) {
            console.error(
                "Error loading distribution analytics:",
                error
            );
        }
    };

    useEffect(() => {
        loadRoomDistribution();
    }, [period, metric]);

    return (

        <section className="analytics-room-distribution-section">

            <div className="analytics-room-distribution-header">

                <div>

                    <h2>
                        {metric.charAt(0).toUpperCase() + metric.slice(1)} Distribution by Room
                    </h2>

                    <p>
                        Share of total energy consumption by room
                    </p>

                </div>

            </div>

            <div className="analytics-room-distribution-chart">

                <PieChart data={data} />

            </div>

        </section>

    );
}
export default RoomDistributionSection