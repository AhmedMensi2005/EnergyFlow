import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { getConsumptionAnalytics } from "../../../services/analytics";

import "./style.css";


function EnergyOverviewChart({
    period = "1y",
    metric = "energy",
}) {
    const [data, setData] = useState([]);

    const [unit, setUnit] = useState(
        metric === "energy" ? "kWh" : "kW"
    );


    useEffect(() => {
        let isMounted = true;

        const fetchAnalytics = async () => {
            try {
                const response =
                    await getConsumptionAnalytics(
                        period,
                        metric
                    );

                if (!isMounted) {
                    return;
                }

                setData(response.data || []);

                setUnit(
                    response.unit ||
                    (metric === "energy"
                        ? "kWh"
                        : "kW")
                );

            } catch (error) {
                console.error(
                    "Failed to load consumption analytics:",
                    error
                );

                if (isMounted) {
                    setData([]);
                }
            }
        };


        fetchAnalytics();


        return () => {
            isMounted = false;
        };

    }, [period, metric]);


    const isEnergy = metric === "energy";

    const label = isEnergy
        ? "Energy"
        : "Power";


    const chartColor = isEnergy
        ? "var(--primary)"
        : "var(--chart-blue)";


    const gradientId = isEnergy
        ? "energyGradient"
        : "powerGradient";


    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <AreaChart
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: -20,
                    bottom: -10,
                }}
            >

                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor={chartColor}
                            stopOpacity={0.32}
                        />

                        <stop
                            offset="55%"
                            stopColor={chartColor}
                            stopOpacity={0.12}
                        />

                        <stop
                            offset="100%"
                            stopColor={chartColor}
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>


                <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="4 4"
                    vertical={false}
                    opacity={0.7}
                />


                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontSize: 11,
                        fill: "var(--text-secondary)",
                    }}
                />


                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontSize: 11,
                        fill: "var(--text-secondary)",
                    }}
                />


                <Tooltip
                    cursor={{
                        stroke: chartColor,
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                        opacity: 0.5,
                    }}

                    contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        boxShadow: "var(--shadow-md)",
                        fontSize: "13px",
                    }}

                    formatter={(value) => [
                        `${Number(value).toFixed(2)} ${unit}`,
                        label,
                    ]}
                />


                <Area
                    key={`${period}-${metric}`}

                    type="monotone"

                    dataKey="value"

                    stroke={chartColor}

                    strokeWidth={3}

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    fill={`url(#${gradientId})`}

                    fillOpacity={1}

                    dot={false}

                    activeDot={{
                        r: 5,
                        fill: chartColor,
                        stroke: "var(--text-white)",
                        strokeWidth: 2,
                    }}

                    isAnimationActive={true}

                    animationBegin={100}

                    animationDuration={1400}

                    animationEasing="ease-out"
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}


export default EnergyOverviewChart;