import { useEffect, useState } from "react";

import RoomDistributionChart from "../components/RoomDistributionChart.jsx";

import { getRoomDistributionAnalytics } from "../../../services/analytics.js";

import "./style.css";

function RoomDistributionSection({
    period = "3m",
    metric = "energy",
}) {

    const [data, setData] = useState([]);
    const [unit, setUnit] = useState("kWh");


    const loadRoomDistribution = async () => {

        try {

            const response =
                await getRoomDistributionAnalytics(
                    period,
                    metric
                );

            setData(response.data || []);

            setUnit(
                response.unit ||
                (metric === "energy" ? "kWh" : "kW")
            );

        } catch (error) {

            console.error(
                "Error loading room distribution analytics:",
                error
            );

            setData([]);

        }

    };


    useEffect(() => {

        loadRoomDistribution();

    }, [period, metric]);


    return (

        <section className="room-distribution-section">

            <div className="section-header">

                <div>

                    <h2>
                        {metric === "energy"
                            ? "Energy Distribution"
                            : "Power Distribution"}
                    </h2>

                </div>

            </div>


            <div className="room-distribution-content">

                <RoomDistributionChart
                    data={data}
                    unit={unit}
                    period={period}
                />

            </div>

        </section>

    );
}


export default RoomDistributionSection;

