import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import "./style.css";

function ConsumptionBarChart({
    data,
    dataKey = "consumption",
}) {

    return (
        <div className="consumption-bar-chart">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 25,
                        left: 10,
                        bottom: 10,
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize: 11,
                        }}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={75}
                        tick={{
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    />

                    <Tooltip
                        cursor={{
                            fill: "rgba(37, 99, 235, 0.04)",
                        }}
                        formatter={(value) => [
                            `${value} kWh`,
                            "Consumption",
                        ]}
                    />

                    <Bar
                        dataKey={dataKey}
                        fill="#05966886"
                        radius={[0, 8, 8, 0]}
                        barSize={40}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default ConsumptionBarChart;