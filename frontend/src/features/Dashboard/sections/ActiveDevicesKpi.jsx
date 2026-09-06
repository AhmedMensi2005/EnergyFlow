import KpiGauge from "../components/KpiGauge";

function ActiveDevicesKpi({
    devices = [],
    active,
    onClick,
}) {
    const totalDevices = devices.length;

    const activeDevices = devices.filter(
        (device) =>
            device.status === "on" ||
            device.status === "ON" ||
            device.status === "active"
    ).length;

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