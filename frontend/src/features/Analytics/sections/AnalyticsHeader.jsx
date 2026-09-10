import AnalyticsFilters from "../components/chartFilter";
import "./style.css";

function AnalyticsHeader({
    period,
    setPeriod,
    metric,
    setMetric,
}) {

    return (
        <div className="analytics-header">

            <div className="analytics-header-info">
                <p>
                    OverView KPIs and charts showing data statistics
                </p>

            </div>

            <div className="analytics-header-filters">

                <AnalyticsFilters
                    period={period}
                    setPeriod={setPeriod}
                    metric={metric}
                    setMetric={setMetric}
                />

            </div>

        </div>
    );
}

export default AnalyticsHeader;
