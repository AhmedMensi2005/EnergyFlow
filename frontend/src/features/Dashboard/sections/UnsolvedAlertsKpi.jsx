import KpiGauge from "../components/KpiGauge";

function UnsolvedAlertsKpi({
    alerts = [],
    active,
    onClick,
}) {
    const totalAlerts = alerts.length;

    const unsolvedAlerts = alerts.filter(
        (alert) =>
            alert.resolved === false ||
            alert.is_resolved === false ||
            alert.status === "unsolved"
    ).length;

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