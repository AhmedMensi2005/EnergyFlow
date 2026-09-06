import { useState, useEffect } from "react";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

import { getConsumptionAnalytics } from "../../../services/analytics.js";
import ConsumptionChart from "../components/chart.jsx";

import "./style.css";

function ConsumptionSection({period, metric}) {

    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);

    const loadConsumption = async () => {
        try {
            const response = await getConsumptionAnalytics(period,metric);
            setData(response.data || []);
        } catch (error) {
            console.error("Error loading consumption analytics:",error);
        } 
    };

    useEffect(() => {
        loadConsumption();
    }, [period, metric]);

    return (
        <section className="consumption-section">

            <div className="consumption-header">

                <div className="consumption-title">

                    <h2>
                        Total {metric.charAt(0).toUpperCase() + metric.slice(1)} Consumption
                    </h2>

                    <p>
                        {metric.charAt(0).toUpperCase() + metric.slice(1)} consumption over time
                    </p>

                </div>
            </div>

            <div className="consumption-chart">

                <ConsumptionChart
                    data={data}
                    metric={metric}
                />

            </div>

        </section>
    );
}

export default ConsumptionSection;