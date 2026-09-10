import { useState } from "react";
import {
    FiCalendar,
    FiBarChart2,
    FiChevronDown,
} from "react-icons/fi";

import "./chartFilter.css";

function ChartFilters({
    period,
    setPeriod,
    metric,
    setMetric,
}) {

    const [openMenu, setOpenMenu] = useState(null);

    const periods = [
        {
            value: "24h",
            label: "Last 24 hours",
        },
        {
            value: "7d",
            label: "Last 7 days",
        },
        {
            value: "30d",
            label: "Last 30 days",
        },
        {
            value: "3m",
            label: "Last 3 months",
        },
        {
            value: "6m",
            label: "Last 6 months",
        },
        {
            value: "1y",
            label: "Last year",
        },
    ];

    const metrics = [
        {
            value: "energy",
            label: "Energy",
            unit: "kWh",
        },
        {
            value: "power",
            label: "Power",
            unit: "W",
        },


    ];

    const currentPeriod =
        periods.find(item => item.value === period)?.label ||
        "Last 7 days";

    const currentMetric =
        metrics.find(item => item.value === metric)?.label ||
        "Energy";

    const toggleMenu = (menu) => {
        setOpenMenu(
            openMenu === menu
                ? null
                : menu
        );
    };

    return (
        <div className="chart-filters">

            {/* PERIOD */}

            <div className="filter">

                <FiCalendar className="filter-icon" />

                <button
                    type="button"
                    className="filter-select"
                    onClick={() => toggleMenu("period")}
                >

                    <span>
                        {currentPeriod}
                    </span>

                    <FiChevronDown
                        className={
                            openMenu === "period"
                                ? "filter-chevron open"
                                : "filter-chevron"
                        }
                    />

                </button>

                {openMenu === "period" && (

                    <div className="filter-menu">

                        {periods.map(item => (

                            <button
                                type="button"
                                key={item.value}
                                className={
                                    period === item.value
                                        ? "filter-option active"
                                        : "filter-option"
                                }
                                onClick={() => {
                                    setPeriod(item.value);
                                    setOpenMenu(null);
                                }}
                            >
                                {item.label}
                            </button>

                        ))}

                    </div>

                )}

            </div>


            {/* METRIC */}

            <div className="filter">

                <FiBarChart2 className="filter-icon" />

                <button
                    type="button"
                    className="filter-select"
                    onClick={() => toggleMenu("metric")}
                >

                    <span>
                        {currentMetric}
                    </span>

                    <FiChevronDown
                        className={
                            openMenu === "metric"
                                ? "filter-chevron open"
                                : "filter-chevron"
                        }
                    />

                </button>

                {openMenu === "metric" && (

                    <div className="filter-menu">

                        {metrics.map(item => (

                            <button
                                type="button"
                                key={item.value}
                                className={
                                    metric === item.value
                                        ? "filter-option active"
                                        : "filter-option"
                                }
                                onClick={() => {
                                    setMetric(item.value);
                                    setOpenMenu(null);
                                }}
                            >

                                <span>
                                    {item.label}
                                </span>

                                <small>
                                    {item.unit}
                                </small>

                            </button>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default ChartFilters;