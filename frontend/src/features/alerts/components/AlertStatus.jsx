const AlertStatus = ({
    counts = { all: 0, new: 0, acknowledged: 0, resolved: 0 },
    activeStatus,
    onStatusChange,
}) => {

    const statuses = [

        {
            key: "all",
            label: "All alerts",
            count: counts.all,
        },

        {
            key: "new",
            label: "New",
            count: counts.new,
        },

        {
            key: "acknowledged",
            label: "Acknowledged",
            count: counts.acknowledged,
        },

        {
            key: "resolved",
            label: "Resolved",
            count: counts.resolved,
        },

    ];


    return (

        <nav
            className="alert-status"
            aria-label="Alert status"
        >

            <div className="alert-status-tabs">

                {statuses.map((status) => (

                    <button
                        key={status.key}
                        type="button"
                        className={`alert-status-tab ${
                            activeStatus === status.key
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            onStatusChange(
                                status.key
                            )
                        }
                    >

                        <span className="alert-status-label">
                            {status.label}
                        </span>

                        <span className="alert-status-count">
                            {status.count}
                        </span>

                    </button>

                ))}

            </div>

        </nav>

    );

};


export default AlertStatus;