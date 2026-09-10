import { useState } from "react";

import {
    updateAlertStatus,
} from "../../../services/alertService";


const AlertDetails = ({
    alert,
    onClose,
    onAlertUpdated,
}) => {

    const [updating, setUpdating] =
        useState(false);

    const [error, setError] =
        useState("");


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            undefined,
            {
                day: "2-digit",
                month: "long",
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


    const handleStatusUpdate = async (
        newStatus
    ) => {

        try {

            setUpdating(true);

            setError("");


            const updatedAlert =
                await updateAlertStatus(
                    alert.id,
                    newStatus
                );


            if (onAlertUpdated) {

                onAlertUpdated(
                    updatedAlert
                );

            }

        } catch (err) {

            console.error(
                "Error updating alert:",
                err
            );

            setError(
                "Unable to update the alert."
            );

        } finally {

            setUpdating(false);

        }

    };


    return (

        <div
            className="alert-details-overlay"
            onClick={onClose}
        >

            <aside
                className="alert-details-panel"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="alert-details-header">

                    <div>

                        <span className="details-eyebrow">
                            ALERT DETAILS
                        </span>

                        <h2>
                            {alert.title}
                        </h2>

                        <p>
                            {alert.device_name || "Unknown device"}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* BODY */}

                <div className="alert-details-body">

                    {/* BADGES */}

                    <div className="details-badges">

                        <span
                            className={`severity-badge large ${
                                alert.severity
                            }`}
                        >
                            {alert.severity}
                        </span>

                        <span
                            className={`alert-status-badge large ${
                                alert.status
                            }`}
                        >
                            {alert.status}
                        </span>

                    </div>


                    {/* VALUES */}

                    <section className="detail-section">

                        <h4>
                            Measurement
                        </h4>

                        <div className="condition-box">

                            <div>

                                <span>
                                    Current value
                                </span>

                                <strong>
                                    {formatValue(
                                        alert.current_value
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Threshold
                                </span>

                                <strong>
                                    {formatValue(
                                        alert.threshold_value
                                    )}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* DEVICE */}

                    <section className="detail-section">

                        <h4>
                            Device information
                        </h4>

                        <div className="detail-grid">

                            <div>

                                <span>
                                    Device
                                </span>

                                <strong>
                                    {alert.device_name || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Room
                                </span>

                                <strong>
                                    {alert.room_name || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rule
                                </span>

                                <strong>
                                    {alert.rule_name || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Created
                                </span>

                                <strong>
                                    {formatDate(
                                        alert.created_at
                                    )}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* MESSAGE */}

                    <section className="detail-section">

                        <h4>
                            Description
                        </h4>

                        <p className="detail-message">
                            {alert.message}
                        </p>

                    </section>


                    {/* STATUS TIMELINE */}

                    <section className="detail-section">

                        <h4>
                            Status history
                        </h4>

                        <div className="detail-grid">

                            <div>

                                <span>
                                    Acknowledged
                                </span>

                                <strong>
                                    {formatDate(
                                        alert.acknowledged_at
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Resolved
                                </span>

                                <strong>
                                    {formatDate(
                                        alert.resolved_at
                                    )}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* ERROR */}

                    {error && (

                        <div className="details-error">
                            {error}
                        </div>

                    )}

                </div>


                {/* ACTIONS */}

                <div className="alert-details-actions">

                    <button
                        type="button"
                        className="details-cancel-btn"
                        onClick={onClose}
                        disabled={updating}
                    >
                        Close
                    </button>


                    {alert.status === "new" && (

                        <button
                            type="button"
                            className="acknowledge-btn"
                            onClick={() =>
                                handleStatusUpdate(
                                    "acknowledged"
                                )
                            }
                            disabled={updating}
                        >
                            {updating
                                ? "Updating..."
                                : "Acknowledge"}
                        </button>

                    )}


                    {alert.status !== "resolved" && (

                        <button
                            type="button"
                            className="resolve-btn"
                            onClick={() =>
                                handleStatusUpdate(
                                    "resolved"
                                )
                            }
                            disabled={updating}
                        >
                            {updating
                                ? "Resolving..."
                                : "Resolve"}
                        </button>

                    )}

                </div>

            </aside>

        </div>

    );

};


export default AlertDetails;