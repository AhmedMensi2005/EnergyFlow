import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import "./style.css";

function EnergyOverviewChart({
    data = [],
    metric = "energy",
}) {
    const isEnergy = metric === "energy";

    const unit = isEnergy ? "kWh" : "kW";
    const label = isEnergy ? "Energy" : "Power";

    // Chart colors
    const chartColor = isEnergy
        ? "#10b981"   // Energy - green
        : "#8b5cf6";  // Power - purple

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
                    top: 0,
                    right: 0,
                    left: -25,
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
                            stopOpacity={0.30}
                        />

                        <stop
                            offset="100%"
                            stopColor={chartColor}
                            stopOpacity={0}
                        />

                    </linearGradient>

                </defs>

                <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                    vertical={false}
                />

                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontSize: 11,
                        fill: "#64748b",
                    }}
                />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontSize: 11,
                        fill: "#64748b",
                    }}
                />

                <Tooltip
                    contentStyle={{
                        background: "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 8px 20px rgba(0,0,0,.10)",
                        fontSize: "13px",
                    }}
                    formatter={(value) => [
                        `${value} ${unit}`,
                        label,
                    ]}
                />

                <Area
                    key={metric}
                    animationId={metric}
                    isAnimationActive={true}
                    animationDuration={700}
                    animationEasing="ease-in-out"

                    type="monotone"
                    dataKey={metric}

                    stroke={chartColor}
                    strokeWidth={3}

                    fill={`url(#${gradientId})`}

                    dot={false}

                    activeDot={{
                        r: 5,
                        fill: chartColor,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                    }}
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

export default EnergyOverviewChart;