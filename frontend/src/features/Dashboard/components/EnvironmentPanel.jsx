import { useEffect, useState } from "react";

import {
    FiDroplet,
    FiMapPin,
    FiWind,
    FiActivity,
    FiCloud,
} from "react-icons/fi";

import { getEnvironment } from "../../../services/analytics";

import LoadingSpinner from "../../../shared/LoadingSpinner/LoadingSpinner";

import "./style.css";

import weatherIcons from "./weatherIcons";


function EnvironmentPanel() {
    const [time, setTime] = useState(new Date());

    const [weather, setWeather] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);


    // ================================
    // Clock
    // ================================

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // ================================
    // Environment data
    // ================================

    useEffect(() => {
        const loadEnvironment = async () => {
            try {
                const data = await getEnvironment();

                setWeather(data);
                setError(false);
            } catch (error) {
                console.error(
                    "Error loading environment data:",
                    error
                );

                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadEnvironment();

        // Refresh every 10 minutes
        const interval = setInterval(
            loadEnvironment,
            10 * 60 * 1000
        );

        return () => clearInterval(interval);
    }, []);


    // ================================
    // Clock formatting
    // ================================

    const hours = String(time.getHours()).padStart(2, "0");

    const minutes = String(time.getMinutes()).padStart(2, "0");

    const seconds = String(time.getSeconds()).padStart(2, "0");

    const date = time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
    });


    // ================================
    // Loading
    // ================================

    if (loading) {
        return (
                <div className="environment-panel">
                    <LoadingSpinner text="Loading environmental data..." />
                </div>
            );
    }


    // ================================
    // Error
    // ================================

    if (error || !weather) {
        return (
            <div className="environment-panel">

                <div className="environment-error">
                    Unable to load environmental data.
                </div>

            </div>
        );
    }


    return (
        <div className="environment-panel">

            {/* =================================
                Location
            ================================= */}

            <div className="environment-header">

                <div className="environment-location">

                    <FiMapPin />

                    <span>
                        {weather.location}
                    </span>

                </div>

                <div className="environment-status">

                    <span className="environment-status-dot" />

                    LIVE

                </div>

            </div>


            {/* =================================
                Weather
            ================================= */}

            <div className="environment-weather">

                <div className="environment-weather-main">

                    <div className="environment-temperature">

                        <span className="temperature-value">
                            {weather.temperature}
                        </span>

                        <span className="temperature-unit">
                            °C
                        </span>

                    </div>

                    <div className="environment-condition">
                        {weather.condition}
                    </div>

                    <div className="environment-feels">
                        Feels like {weather.feelsLike}°C
                    </div>

                </div>


                {/* =================================
                    Weather metrics
                ================================= */}

                <div className="environment-metrics">

                    <div className="environment-metric humidity">

                        <div className="metric-icon">
                            <FiDroplet />
                        </div>

                        <div className="metric-information">

                            <span className="metric-value">
                                {weather.humidity}%
                            </span>

                            <span className="metric-label">
                                Humidity
                            </span>

                        </div>

                    </div>


                    <div className="environment-metric wind">

                        <div className="metric-icon">
                            <FiWind />
                        </div>

                        <div className="metric-information">

                            <span className="metric-value">
                                {weather.wind}
                            </span>

                            <span className="metric-label">
                                km/h wind
                            </span>

                        </div>

                    </div>

                </div>

                {/* ================================
                            Next hours
                ================================= */}

                <div className="environment-hourly">

                    <div className="environment-hourly-title">
                        NEXT HOURS
                    </div>


                    <div className="environment-hourly-list">

                        {weather.next_hours?.map((hour, index) => {

                            const hourDate = new Date(hour.time);

                            const hourLabel = hourDate.toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                }
                            );
                            
                            const WeatherIcon = weatherIcons[hour.weather_code] || FiCloud;
                            
                            return (
                                <div
                                    className="environment-hour"
                                    key={`${hour.time}-${index}`}
                                >

                                    <div className="environment-hour-time">
                                        {hourLabel}
                                    </div>


                                    <div className="environment-hour-icon">
                                        <WeatherIcon />
                                    </div>


                                    <div className="environment-hour-temperature">
                                        {Math.round(hour.temperature)}°
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>
            


            {/* =================================
                Clock
            ================================= */}

            <div className="environment-clock">

                <div className="clock-label">
                    CURRENT TIME
                </div>

                <div className="clock-time">

                    <span>
                        {hours}
                    </span>

                    <span className="clock-colon">
                        :
                    </span>

                    <span>
                        {minutes}
                    </span>

                </div>

                <div className="clock-seconds">
                    {seconds} SEC
                </div>

                <div className="clock-date">
                    {date}
                </div>

            </div>


            {/* =================================
                Energy synchronization
            ================================= */}

            <div className="environment-energy-status">

                <FiActivity />

                <span>
                    Environmental data synchronized
                </span>

            </div>

        </div>
    );
}


export default EnvironmentPanel;
