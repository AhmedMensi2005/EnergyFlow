import AnalyticsKPI from "../components/kpi.jsx";

import { getAnalyticsKPIs } from "../../../services/analytics.js";
import { useState, useEffect } from "react";

import "./style.css";


function KPIsSection({ period }) {

    const [data, setData] = useState({
        period: "30d",
        startDate: "2026-07-01T12:00:00Z",
        endDate: "2026-07-31T12:00:00Z",

        totalRooms: 12,
        totalDevices: 37,
        totalConsumption: 1240.50,
        averageConsumption: 33.53,
        activeDevices: 29,
        averagePower: 4820.25,
    });


    useEffect(() => {

        async function loadKPIs() {

            try {

                const data = await getAnalyticsKPIs(period);

                setData(data);

            } catch (error) {

                console.error(
                    "Error loading analytics KPIs:",
                    error
                );

            }

        }

        loadKPIs();

    }, [period]);


    return (

        <div className="analytics-kpis">

            <div className="kpi-group kpi-counting-group">

                <AnalyticsKPI
                    type="rooms"
                    title="Rooms"
                    value={data.totalRooms}
                    subtitle="Registered rooms"
                />

                <AnalyticsKPI
                    type="devices"
                    title="Devices"
                    value={data.totalDevices}
                    subtitle="Registered devices"
                />

                <AnalyticsKPI
                    type="active"
                    title="ON Devices"
                    value={data.activeDevices}
                    subtitle={`of ${data.totalDevices} devices`}
                />

            </div>


            <div className="kpi-group kpi-consumption-group">

                <AnalyticsKPI
                    type="consumption"
                    title="Consumption"
                    value={data.totalConsumption}
                    unit="kWh"
                    subtitle="Selected period"
                />

                <AnalyticsKPI
                    type="average"
                    title="Avg Use"
                    value={data.averageConsumption}
                    unit="kWh"
                    subtitle="Per device"
                />

                <AnalyticsKPI
                    type="power"
                    title="Avg Power"
                    value={data.averagePower}
                    unit="W"
                    subtitle="Current period"
                />

            </div>

        </div>

    );
}


export default KPIsSection;