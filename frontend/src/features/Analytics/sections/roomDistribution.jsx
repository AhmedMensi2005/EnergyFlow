import PieChart from "../components/pieChart.jsx";

import { useState, useEffect } from "react";
import { getRoomDistributionAnalytics } from "../../../services/analytics.js";

import "./style.css";

function RoomDistributionSection({ period, metric}) {

    const [data, setData] = useState([]);
    
    const loadRoomDistribution = async () => {
        try {
            const response = await getRoomDistributionAnalytics(period,metric);
            setData(response.data || []);
        } catch (error) {
            console.error("Error loading distribution analytics:",error);
        } 
    };

    useEffect(() => {
        loadRoomDistribution();
    }, [period, metric]);

    return (

        <section className="room-distribution-section">

            <div className="room-distribution-header">

                <div>

                    <h2>
                        {metric} Distribution by Room
                    </h2>

                    <p>
                        Share of total energy consumption by room
                    </p>

                </div>

            </div>

            <div className="room-distribution-chart">

                <PieChart
                    data={data}
                />

            </div>

        </section>

    );
}

export default RoomDistributionSection;