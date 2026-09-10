import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import "./style.css";


function CustomTooltip({ active, payload }) {

    if (!active || !payload || !payload.length) {
        return null;
    }

    const room = payload[0].payload;

    return (
        <div className="pie-tooltip">

            <div className="pie-tooltip-room">

                <span
                    className="pie-tooltip-dot"
                    style={{
                        backgroundColor: room.color,
                    }}
                />

                {room.name}

            </div>

            <div className="pie-tooltip-value">

                {room.consumption} kWh

            </div>

        </div>
    );
}


function PieChart({ data = [] }) {

    return (

        <div className="pie-chart">

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <RechartsPieChart>

                    <Pie
                        data={data}
                        dataKey="consumption"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={110}
                        paddingAngle={3}
                        cornerRadius={6}
                        isAnimationActive={true}
                        animationDuration={700}
                        animationEasing="ease-out"
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />

                        ))}

                    </Pie>

                    <Tooltip
                        content={<CustomTooltip />}
                        isAnimationActive={false}
                        animationDuration={0}
                        cursor={false}
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                    />

                </RechartsPieChart>

            </ResponsiveContainer>

        </div>
    );
}


export default PieChart;