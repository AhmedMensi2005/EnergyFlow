import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";
import "./style.css";

function KpiGauge({
    title,
    value,
    total,
    color = "var(--chart-cyan)",
    active,
    onClick,
}) {
    const percentage =
        total > 0
            ? Math.min(100, (value / total) * 100)
            : 0;

    const data = [
        {
            value: percentage,
            fill: color,
        },
    ];

    return (
        <button
            type="button"
            className={`kpi-card ${active ? "active" : ""}`}
            onClick={onClick}
        >
            <div className="kpi-title">{title}</div>

            <div className="kpi-gauge-container">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="80%"
                        innerRadius="140%"
                        outerRadius="170%"
                        startAngle={180}
                        endAngle={0}
                        barSize={10}
                        data={data}
                    >
                        {/* Fixes the domain to 0–100 so the arc reflects the
                            actual percentage instead of always filling 100% */}
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />

                        <RadialBar
                            dataKey="value"
                            cornerRadius={8}
                            background={{ fill: "var(--border)" }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="kpi-gauge-number" style={{ color: color }}>
                    {value}
                </div>
            </div>

            <div className="kpi-total">/ {total}</div>
        </button>
    );
}

export default KpiGauge;