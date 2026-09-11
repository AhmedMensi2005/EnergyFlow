import KpiGauge from "../components/KpiGauge";

function UnsolvedAlertsKpi({
    alerts = {},
    active,
    onClick,
}) {

    const totalAlerts =
        alerts.total_alerts || 0;

    const unsolvedAlerts =
        alerts.unsolved_alerts?.length || 0;

    return (
        <KpiGauge
            title="Unsolved Alerts"
            value={unsolvedAlerts}
            total={totalAlerts}
            active={active}
            onClick={onClick}
            color="var(--chart-blue)"
        />
    );
}

export default UnsolvedAlertsKpi;