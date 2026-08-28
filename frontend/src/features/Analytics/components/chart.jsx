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

function ConsumptionChart({
    data = [],
    metric = "energy",
}) {

    const isEnergy = metric === "energy";

    const unit = isEnergy ? "kWh" : "kW";
    const label = isEnergy ? "Energy" : "Power";

    return (

        <ResponsiveContainer width="100%" height={300}>

            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                }}
            >

                <defs>

                    <linearGradient
                        id="consumptionGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity={0.30}
                        />

                        <stop
                            offset="100%"
                            stopColor="#2563eb"
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
                    dataKey="date"
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
                    labelFormatter={(label) => label}
                />

                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#consumptionGradient)"
                    dot={false}
                    activeDot={{
                        r: 5,
                        fill: "#2563eb",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                    }}
                />

            </AreaChart>

        </ResponsiveContainer>

    );
}

export default ConsumptionChart;