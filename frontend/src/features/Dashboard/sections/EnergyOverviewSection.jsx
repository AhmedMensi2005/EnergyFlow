import { useState } from "react";
import EnergyOverviewChart from "../components/EnergyOverviewChart";

import "./style.css";

function EnergyOverviewSection() {
    const [metric, setMetric] = useState("energy");

    const data = [
        { month: "Jan", energy: 420, power: 2.1 },
        { month: "Feb", energy: 390, power: 1.9 },
        { month: "Mar", energy: 450, power: 2.3 },
        { month: "Apr", energy: 510, power: 2.5 },
        { month: "May", energy: 580, power: 2.8 },
        { month: "Jun", energy: 620, power: 3.0 },
        { month: "Jul", energy: 680, power: 3.2 },
        { month: "Aug", energy: 710, power: 3.4 },
        { month: "Sep", energy: 590, power: 2.9 },
        { month: "Oct", energy: 520, power: 2.6 },
        { month: "Nov", energy: 460, power: 2.3 },
        { month: "Dec", energy: 430, power: 2.1 },
    ];

    return (
        <section className="energy-overview">

            <div className="section-header">

                <div>
                    <h2>{metric.charAt(0).toUpperCase() + metric.slice(1)} Overview</h2>
                </div>

                <div className="metric-navigation">

                    <button
                        type="button"
                        className={`metric-option ${
                            metric === "energy" ? "active" : ""
                        }`}
                        onClick={() => setMetric("energy")}
                    >
                        Energy
                    </button>

                    <button
                        type="button"
                        className={`metric-option ${
                            metric === "power" ? "active" : ""
                        }`}
                        onClick={() => setMetric("power")}
                    >
                        Power
                    </button>

                </div>

            </div>

            <div className="energy-overview-chart">

                <EnergyOverviewChart
                    data={data}
                    metric={metric}
                />

            </div>

        </section>
    );
}

export default EnergyOverviewSection;