import { useState } from "react";
import EnergyOverviewChart from "../components/EnergyOverviewChart";

import "./style.css";

function EnergyOverviewSection() {
    const [metric, setMetric] = useState("energy");

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
                    metric={metric}
                />

            </div>

        </section>
    );
}

export default EnergyOverviewSection;