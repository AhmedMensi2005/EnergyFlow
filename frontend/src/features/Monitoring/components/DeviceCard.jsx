import "./style.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    YAxis,
    XAxis,
    Area,
} from "recharts";

import {
    MdElectricBolt,
    MdWaterDrop,
    MdAir,
    MdMeetingRoom,
} from "react-icons/md";

import {
    BsThermometerHalf
} from "react-icons/bs";

export default function DeviceCard({
    device,
    measurement,
    chartData = [],
}) {

    const statusClass = device.status.toLowerCase();
    const operatingState = device.last_operating_state.toLowerCase();
    return (
        <div className="device-card">
            {/* HEADER */}
            <div className="device-header">

                <div>
                    <h2>{device.name}</h2>
                    
                    <div className="room">
                        <MdMeetingRoom />
                        {device.label}
                    </div>
                </div>
                
                <div className={`operating_state ${operatingState}`}>
                    {device.last_operating_state}
                </div>

            </div>

            {/* CHART */}
            <div className="chart-card">

                <div className="chart-header">
                    <h4>Power Consumption</h4>
                    <span>Today</span>
                </div>

                <ResponsiveContainer width="100%" height={170}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 8,
                            right: 12,
                            left: 20,
                            bottom: 2,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="powerGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            stroke="#edf2f7"
                            strokeDasharray="4 4"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            tick={{
                                fontSize: 10,
                                fill: "#94A3B8",
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(value) => [`${value} W`, "Power"]}
                            labelFormatter={(label) => `Time: ${label}`}
                            contentStyle={{
                                background: "#ffffff",
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 8px 20px rgba(0,0,0,.12)",
                                fontSize: "13px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="power"
                            fill="url(#powerGradient)"
                            stroke="none"
                            tooltipType="none"
                        />
                        <Line
                            type="monotone"
                            dataKey="power"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#2563eb",
                                stroke: "#fff",
                                strokeWidth: 3,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>

            </div>

            {/* METRICS */}
            <div className="metrics">

                <div className="metric-box">

                    <div className="metric-icon">
                        <BsThermometerHalf />
                    </div>

                    <div>
                        <span>Temperature</span>
                        <h3>{measurement.temperature}°C</h3>
                    </div>

                </div>

                <div className="metric-box">

                    <div className="metric-icon">
                        <MdElectricBolt />
                    </div>

                    <div>
                        <span>Power</span>
                        <h3>{measurement.power} W</h3>
                    </div>

                </div>

                <div className="metric-box">

                    <div className="metric-icon">
                        <MdWaterDrop />
                    </div>

                    <div>
                        <span>Humidity</span>
                        <h3>{measurement.humidity}%</h3>
                    </div>

                </div>

                <div className="metric-box">

                    <div className="metric-icon">
                        <MdAir />
                    </div>

                    <div>
                        <span>Fan</span>
                        <h3>{measurement.fan_mode}</h3>
                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <div className="device-footer">

                <div className="mode">
                    {(measurement.mode || "—").toUpperCase()}
                </div>


                <div className="updated">
                    Last update
                    <br />
                    {new Date(device.last_seen_at).toLocaleTimeString()}
                </div>

            </div>

        </div>

    );

}