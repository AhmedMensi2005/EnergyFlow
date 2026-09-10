import KpiGauge from "../components/KpiGauge";

function ActiveDevicesKpi({
    data = {},
    active,
    onClick,
}) {
    const totalDevices = data.total_devices || 0;

    const activeDevices =
        data.on_devices?.length || 0;

    return (
        <KpiGauge
            title="Active Devices"
            value={activeDevices}
            total={totalDevices}
            active={active}
            onClick={onClick}
            color="var(--chart-teal)"
        />
    );
}

export default ActiveDevicesKpi;