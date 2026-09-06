import "./style.css";

function DashboardListSection({
    view,
    devices = [],
    alerts = [],
}) {
    // ==========================
    // Active devices
    // ==========================

    const activeDevices = devices.filter(
        (device) =>
            device.status === "on" ||
            device.status === "ON" ||
            device.status === "active"
    );

    // ==========================
    // Unsolved alerts
    // ==========================

    const unsolvedAlerts = alerts.filter(
        (alert) =>
            alert.resolved === false ||
            alert.is_resolved === false ||
            alert.status === "unsolved"
    );

    const isDevicesView = view === "devices";

    const items = isDevicesView
        ? activeDevices
        : unsolvedAlerts;

    // ==========================
    // Header
    // ==========================

    const title = isDevicesView
        ? "Active Devices"
        : "Unsolved Alerts";

    const subtitle = isDevicesView
        ? `${activeDevices.length} ${
              activeDevices.length === 1 ? "device" : "devices"
          } online`
        : `${unsolvedAlerts.length} ${
              unsolvedAlerts.length === 1 ? "alert" : "alerts"
          } require attention`;

    // ==========================
    // Empty state
    // ==========================

    const emptyMessage = isDevicesView
        ? "No active devices"
        : "No unsolved alerts";

    return (
        <section className="dashboard-list-section">

            {/* ==========================
                Header
            ========================== */}

            <div className="section-header">

                <div>
                    <h2>{title}</h2>

                    <p>{subtitle}</p>
                </div>

            </div>


            {/* ==========================
                List
            ========================== */}

            <div className="dashboard-list">

                {items.length === 0 ? (

                    <div className="dashboard-list-empty">
                        <span>{emptyMessage}</span>
                    </div>

                ) : (

                    items.map((item, index) => {

                        const name =
                            item.name ||
                            item.title ||
                            `#${item.id}`;

                        const secondary =
                            isDevicesView
                                ? item.room ||
                                  item.location ||
                                  "No room"
                                : item.description ||
                                  item.message ||
                                  "Alert";

                        return (
                            <div
                                className="dashboard-list-item"
                                key={`${view}-${item.id}`}
                                style={{
                                    "--i": index,
                                }}
                            >

                                {/* ==========================
                                    Status indicator
                                ========================== */}

                                <div
                                    className={`dashboard-list-indicator ${
                                        isDevicesView
                                            ? "indicator-online"
                                            : "indicator-alert"
                                    }`}
                                />


                                {/* ==========================
                                    Information
                                ========================== */}

                                <div className="dashboard-list-info">

                                    <span className="dashboard-list-name">
                                        {name}
                                    </span>

                                    <span className="dashboard-list-secondary">
                                        {secondary}
                                    </span>

                                </div>


                      

                            </div>
                        );
                    })
                )}

            </div>

        </section>
    );
}

export default DashboardListSection;