import {
    FiHome,
    FiCpu,
    FiZap,
    FiPieChart,
    FiRadio,
    FiTrendingUp,
} from "react-icons/fi";

import "./style.css";

const icons = {
    rooms: FiHome,
    devices: FiCpu,
    consumption: FiZap,
    average: FiPieChart,
    active: FiRadio,
    power: FiTrendingUp,
};

function AnalyticsKPI({type,title,value,unit,subtitle,}) {

    const Icon = icons[type];

    return (
        <div className="analytics-kpi">

            <div className={`kpi-icon ${type}`}>
                <Icon />
            </div>
            <span className="kpi-separation">|</span>
            <div className="kpi-content">

                <span className="kpi-title">
                    {title}
                </span>

                <div className="kpi-value">
                    {value}
                    {unit && (
                        <span className="kpi-unit">
                            {unit}
                        </span>
                    )}
                </div>

                {subtitle && (
                    <span className="kpi-subtitle">
                        {subtitle}
                    </span>
                )}

            </div>

        </div>
    );
}
export default AnalyticsKPI;