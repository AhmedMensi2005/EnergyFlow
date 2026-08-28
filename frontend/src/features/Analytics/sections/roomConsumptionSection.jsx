import ConsumptionBarChart from "../components/barChart.jsx";

import { useState, useEffect } from "react";
import { getTopRoomsAnalytics } from "../../../services/analytics.js";

import "./style.css";

function RoomConsumptionSection({ period, metric }) {

    const [data, setData] = useState([]);

    const loadTopRooms = async () => {
        try {
            const response = await getTopRoomsAnalytics(period,metric);
            setData(response.data || []);
        } catch (error) {
            console.error("Error loading rooms analytics:",error);
        } 
    };

    useEffect(() => {
        loadTopRooms();
    }, [period, metric]);

    return (
        <section className="consumption-section">

            <div className="section-header">
                <div>
                    <h2>{metric} intensity by room</h2>
                    <span>Consumption per room</span>
                </div>
            </div>

            <ConsumptionBarChart
                data={data}
                dataKey="consumption"
            />

        </section>
    );
}

export default RoomConsumptionSection;