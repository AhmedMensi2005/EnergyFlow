const AlertCard = ({
    alert,
    onViewDetails,
}) => {

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    const formatValue = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return "—";
        }

        return Number(value).toLocaleString(
            undefined,
            {
                maximumFractionDigits: 2,
            }
        );

    };


    return (

        <article
            className={`alert-card ${
                alert.severity || "medium"
            }`}
        >

            <div className="alert-card-left">

                <div className="alert-severity-indicator" />


                <div className="alert-card-content">

                    <div className="alert-card-header">

                        <h3>
                            {alert.title}
                        </h3>

                        <span
                            className={`severity-badge ${
                                alert.severity
                            }`}
                        >
                            {alert.severity}
                        </span>

                        <span
                            className={`alert-status-badge ${
                                alert.status
                            }`}
                        >
                            {alert.status}
                        </span>

                    </div>


                    <p className="alert-message">
                        {alert.message}
                    </p>


                    <div className="alert-card-meta">

                        <span>
                            Device
                            <strong>
                                {alert.device_name || "—"}
                            </strong>
                        </span>

                        <span>
                            Room
                            <strong>
                                {alert.room_name || "—"}
                            </strong>
                        </span>

                        <span>
                            {formatDate(
                                alert.created_at
                            )}
                        </span>

                    </div>

                </div>

            </div>


            <div className="alert-card-right">

                <div className="alert-card-value">

                    <span>
                        Current value
                    </span>

                    <strong>
                        {formatValue(
                            alert.current_value
                        )}
                    </strong>

                    <small>
                        Threshold:{" "}
                        {formatValue(
                            alert.threshold_value
                        )}
                    </small>

                </div>


                <button
                    type="button"
                    className="view-alert-btn"
                    onClick={() =>
                        onViewDetails(alert)
                    }
                >
                    View details
                    <span>→</span>
                </button>

            </div>

        </article>

    );

};


export default AlertCard;