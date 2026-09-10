import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

import "./style.css";


function RoomDistributionChart({
    data = [],
    unit = "kWh",
    period = "30d",
}) {

    const totalConsumption = data.reduce(
        (sum, room) =>
            sum + Number(room.consumption || 0),
        0
    );


    const chartData = data.map((room) => ({

        ...room,

        percentage:
            totalConsumption > 0
                ? (
                    (Number(room.consumption || 0) /
                        totalConsumption) *
                    100
                ).toFixed(1)
                : 0,

    }));


    const periodLabels = {

        "24h": "Last 24 hours",

        "7d": "Last 7 days",

        "30d": "Last 30 days",

        "3m": "Last 3 months",

        "6m": "Last 6 months",

        "1y": "Last year",

    };


    const CustomTooltip = ({
        active,
        payload,
    }) => {

        if (
            !active ||
            !payload ||
            payload.length === 0
        ) {
            return null;
        }


        const room = payload[0].payload;


        return (

            <div className="room-distribution-tooltip">

                <div className="tooltip-room-name">
                    {room.name}
                </div>


                <div
                    className="tooltip-room-value"
                    style={{
                        color: room.color,
                    }}
                >
                    {room.percentage}%
                </div>


                <div className="tooltip-room-consumption">

                    {Number(
                        room.consumption || 0
                    ).toFixed(2)}{" "}

                    {unit}

                </div>

            </div>

        );

    };


    return (

        <div className="room-distribution-chart">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <PieChart>

                    <Pie
                        data={chartData}

                        dataKey="consumption"

                        nameKey="name"

                        cx="50%"

                        cy="82%"

                        startAngle={180}

                        endAngle={0}

                        innerRadius="90%"

                        outerRadius="120%"

                        paddingAngle={2}

                        stroke="none"

                        cornerRadius={4}
                    >

                        {chartData.map(
                            (room, index) => (

                                <Cell
                                    key={`cell-${index}`}

                                    fill={
                                        room.color ||
                                        "var(--chart-green)"
                                    }
                                />

                            )
                        )}

                    </Pie>


                    <Tooltip
                        content={
                            <CustomTooltip />
                        }

                        cursor={false}

                        position={{
                            x: 0,
                            y: 0,
                        }}

                        wrapperStyle={{
                            zIndex: 99999,
                        }}
                    />

                </PieChart>

            </ResponsiveContainer>


            <div className="room-distribution-center">

                <span className="distribution-total">
                    {totalConsumption.toFixed(1)}
                </span>


                <span className="distribution-unit">
                    {unit}
                </span>


                <span className="distribution-label">
                    {periodLabels[period] ||
                        "Selected period"}
                </span>

            </div>

        </div>

    );
}


export default RoomDistributionChart;