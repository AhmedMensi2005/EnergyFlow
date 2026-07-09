import "./style.css";
import {ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, YAxis, XAxis, LabelList} from "recharts";

import {FiThermometer, FiZap} from "react-icons/fi";

const ACCard = ({
  name,
  room,
  status,
  temperature,
  power,
  mode,
  updated,
  consumptionData,
}) => {
  return (
    <div className="ac-card">

      {/* Header */}
      <div className="ac-card-header">

        <div>
          <h3>{name}</h3>
          <p>{room}</p>
        </div>

        <div className={`status ${status.toLowerCase()}`}>
          <span className="dot"></span>
          {status}
        </div>

      </div>

      {/* Consumption Graph */}
    <div className="graph-container">
        <ResponsiveContainer width="100%" height={120}>
            <LineChart
                data={consumptionData}
                margin={{
                    top: 15,
                    right: 25,
                    left: -20,
                    bottom: 0,
                }}
            >
                <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#E6EEF8"
                />

                <XAxis
                    dataKey="time"
                    tick={{
                        fill: "#7A869A",
                        fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    tick={{
                        fill: "#7A869A",
                        fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                    unit="kW"
                />

                <Tooltip
                    contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 8px 25px rgba(0,0,0,.12)",
                    }}
                />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                        r: 5,
                        fill: "#3B82F6",
                        stroke: "#fff",
                        strokeWidth: 2,
                    }}
                    activeDot={{
                        r: 7,
                    }}
                >
                    <LabelList
                        dataKey="value"
                        position="top"
                        fill="#334155"
                        fontSize={11}
                    />
                </Line>

            </LineChart>
        </ResponsiveContainer>
    </div>

      {/* Metrics */}
      <div className="metrics">

        <div className="metric-box">
          <FiThermometer className="metric-icon" />

          <div>
            <span className="label">TEMP</span>
            <h2>{temperature}°C</h2>
          </div>

        </div>

        <div className="metric-box">
          <FiZap className="metric-icon" />

          <div>
            <span className="label">POWER</span>
            <h2>{power} kW</h2>
          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="ac-footer">

        <span className="mode">{mode}</span>

        <span className="updated">
          Updated {updated}
        </span>

      </div>

    </div>
  );
};

export default ACCard;