import AnalyticsFilters from "./components/chartFilter.jsx"
import KPIsSection from "./sections/kpisSection.jsx";
import ConsumptionSection from "./sections/consumptionSection.jsx";
import RoomConsumptionSection from "./sections/roomConsumptionSection.jsx";
import DeviceConsumptionSection from "./sections/deviceConsumptionSection.jsx";
import RoomDistributionSection from "./sections/roomDistribution.jsx";

import { useState, useEffect } from "react";

import "./AnalyticsStyle.css";

function Analytics() {

    const [period, setPeriod] = useState("7d");
    const [metric, setMetric] = useState("energy");

    return (

         <div className="analytics-page">

            {/* TOP FADE */}
            <div className="fade-top"></div>

            {/* SCROLLABLE CONTENT */}
            <div className="analytics-container">

                <KPIsSection
                    period={period}
                />

                <AnalyticsFilters
                    period={period}
                    setPeriod={setPeriod}
                    metric={metric}
                    setMetric={setMetric}
                />

                <ConsumptionSection 
                    period={period}
                    metric={metric}
                />

                <div className="consumption-comparison">
                    <RoomConsumptionSection
                        period={period}
                        metric={metric}
                    />
                    <DeviceConsumptionSection
                        period={period}
                        metric={metric}
                    />
                </div>

                {/* ROOM DISTRIBUTION */}
                <RoomDistributionSection
                    period={period}
                    metric={metric}
                />

            </div>

                

            {/* BOTTOM FADE */}
            <div className="fade-bottom"></div>

        </div>


    );
}

export default Analytics;