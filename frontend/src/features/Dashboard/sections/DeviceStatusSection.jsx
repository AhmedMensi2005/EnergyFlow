import { useEffect, useState } from "react";

import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

import AlertsHeatmap from "../components/AlertsHeatmap";
import { getAlertHeatmap } from "../../../services/alertService";

import "./style.css";


function DeviceStatusSection() {

    const today = new Date();

    const [selectedMonth, setSelectedMonth] = useState(
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`
    );

    const [alertData, setAlertData] = useState([]);


    // Load real alerts for selected month
    useEffect(() => {

        const loadAlerts = async () => {

            try {

                const response = await getAlertHeatmap(
                    selectedMonth
                );

                setAlertData(response.data || []);

            } catch (error) {

                console.error(
                    "Error loading alert heatmap:",
                    error
                );

                setAlertData([]);

            }

        };

        loadAlerts();

    }, [selectedMonth]);


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


    const currentIndex =
        monthOptions.indexOf(selectedMonth);

    const canGoPrevious =
        currentIndex > 0;

    const canGoNext =
        currentIndex < monthOptions.length - 1;


    const changeMonth = (direction) => {

        const newIndex =
            currentIndex + direction;

        if (
            newIndex >= 0 &&
            newIndex < monthOptions.length
        ) {
            setSelectedMonth(
                monthOptions[newIndex]
            );
        }
    };


    const [year, month] =
        selectedMonth.split("-").map(Number);

    const currentMonth = new Date(
        year,
        month - 1,
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