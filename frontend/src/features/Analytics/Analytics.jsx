import AnalyticsHeader from "./sections/AnalyticsHeader.jsx";
import KPIsSection from "./sections/kpisSection.jsx";
import ConsumptionSection from "./sections/consumptionSection.jsx";
import RoomConsumptionSection from "./sections/roomConsumptionSection.jsx";
import DeviceConsumptionSection from "./sections/deviceConsumptionSection.jsx";
import RoomDistributionSection from "./sections/roomDistribution.jsx";

import { useState } from "react";

import "./AnalyticsStyle.css";

function Analytics() {

    const [period, setPeriod] = useState("7d");
    const [metric, setMetric] = useState("energy");

    return (

        <div className="analytics-page">
            <AnalyticsHeader
                    period={period}
                    setPeriod={setPeriod}
                    metric={metric}
                    setMetric={setMetric}
            />

            <div className="fade-top"></div>

            <div className="analytics-container">

                <KPIsSection
                    period={period}
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

                <RoomDistributionSection
                    period={period}
                    metric={metric}
                />

            </div>

            <div className="fade-bottom"></div>

        </div>
    );
}

export default Analytics;
