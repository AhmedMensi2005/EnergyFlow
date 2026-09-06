import { useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import AlertsHeatmap from "../components/AlertsHeatmap";
import "./style.css";

function DeviceStatusSection() {
    const today = new Date();

    const [selectedMonth, setSelectedMonth] = useState(
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`
    );

    const alertData = [
        { date: "2026-05-03", level: 1 },
        { date: "2026-05-05", level: 2 },
        { date: "2026-05-12", level: 3 },
        { date: "2026-05-21", level: 4 },

        { date: "2026-06-07", level: 3 },
        { date: "2026-06-21", level: 4 },

        { date: "2026-07-15", level: 2 },
        { date: "2026-07-19", level: 1 },

        { date: "2026-08-03", level: 3 },
        { date: "2026-08-12", level: 4 },
    ];

    // Calculate the 5 available months
    const monthOptions = [];

    for (let i = 4; i >= 0; i--) {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() - i,
            1
        );

        const value = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        monthOptions.push(value);
    }

    const currentIndex = monthOptions.indexOf(
        selectedMonth
    );

    const canGoPrevious = currentIndex > 0;
    const canGoNext =
        currentIndex < monthOptions.length - 1;

    const changeMonth = (direction) => {
        const newIndex = currentIndex + direction;

        if (
            newIndex >= 0 &&
            newIndex < monthOptions.length
        ) {
            setSelectedMonth(monthOptions[newIndex]);
        }
    };

    const currentMonth = new Date(
        Number(selectedMonth.split("-")[0]),
        Number(selectedMonth.split("-")[1]) - 1,
        1
    ).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <section className="device-status">

            <div className="section-header">

                <div>
                    <h2>Alerts</h2>
                </div>

                {/* Month navigation */}
                <div className="month-navigation">

                    <button
                        className="month-nav-button"
                        onClick={() => changeMonth(-1)}
                        disabled={!canGoPrevious}
                        aria-label="Previous month"
                    >
                        <FiChevronLeft />
                    </button>

                    <span className="current-month">
                        {currentMonth}
                    </span>

                    <button
                        className="month-nav-button"
                        onClick={() => changeMonth(1)}
                        disabled={!canGoNext}
                        aria-label="Next month"
                    >
                        <FiChevronRight />
                    </button>

                </div>

            </div>

            <div className="device-status-chart">
                <AlertsHeatmap
                    data={alertData}
                    selectedMonth={selectedMonth}
                />
            </div>

        </section>
    );
}

export default DeviceStatusSection;