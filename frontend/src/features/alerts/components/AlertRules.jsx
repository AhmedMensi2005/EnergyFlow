import React, { useState } from "react";
import {
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
} from "../../../services/alertService";

const METRIC_LABELS = {
    power: "Power",
    energy_total: "Energy Total",
    energy_delta: "Energy Delta",
    energy_saved: "Energy Saved",
    power_energy: "Power Energy",
    temperature: "Temperature",
    target_temperature: "Target Temperature",
    humidity: "Humidity",
    filter_usage: "Filter Usage",
};

const CONDITION_LABELS = {
    ">": "greater than",
    "<": "less than",
    ">=": "greater than or equal to",
    "<=": "less than or equal to",
};

const SEVERITY_LABELS = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
};


/* =========================================================
   RULE LIST
========================================================= */

const AlertRulesList = ({
    rules = [],
    onRulesChange,
}) => {
    const [updatingId, setUpdatingId] = useState(null);

    /* =====================================================
       ENABLE / DISABLE RULE
    ===================================================== */

    const handleToggle = async (rule) => {
        try {
            setUpdatingId(rule.id);

            await updateAlertRule(rule.id, {
                enabled: !rule.enabled,
            });

            if (onRulesChange) {
                await onRulesChange();
            }
        } catch (error) {
            console.error(
                "Error updating alert rule:",
                error
            );
        } finally {
            setUpdatingId(null);
        }
    };


    /* =====================================================
       DELETE RULE
    ===================================================== */

    const handleDelete = async (ruleId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this alert rule?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingId(ruleId);

            await deleteAlertRule(ruleId);

            if (onRulesChange) {
                await onRulesChange();
            }
        } catch (error) {
            console.error(
                "Error deleting alert rule:",
                error
            );
        } finally {
            setUpdatingId(null);
        }
    };


    /* =====================================================
       EMPTY
    ===================================================== */

    if (!rules.length) {
        return (
            <div className="alerts-empty">
                <h3>No alert rules yet</h3>

                <p>
                    Create your first alert rule to start
                    monitoring your devices.
                </p>
            </div>
        );
    }


    /* =====================================================
       LIST
    ===================================================== */

    return (
        <div className="rules-list">

            {rules.map((rule) => {
                const metric =
                    METRIC_LABELS[rule.metric] ||
                    rule.metric;

                const condition =
                    CONDITION_LABELS[rule.condition] ||
                    rule.condition;

                const severity =
                    SEVERITY_LABELS[rule.severity] ||
                    rule.severity;

                let target = "All devices";

                if (rule.device_name) {
                    target = `Device: ${rule.device_name}`;
                } else if (rule.room_name) {
                    target = `Room: ${rule.room_name}`;
                }

                return (
                    <article
                        className="rule-card"
                        key={rule.id}
                    >

                        <div className="rule-card-header">

                            <h3 className="rule-card-title">
                                {rule.name}
                            </h3>

                            <span
                                className={`rule-severity ${rule.severity}`}
                            >
                                {severity}
                            </span>

                        </div>


                        <div className="rule-card-condition">
                            <strong>{metric}</strong>{" "}
                            {condition}{" "}
                            <strong>
                                {rule.threshold}
                            </strong>
                        </div>


                        <div className="rule-card-target">
                            {target}
                        </div>


                        <div className="rule-card-footer">

                            {rule.enabled ? (
                                <span className="rule-enabled">
                                    ● Enabled
                                </span>
                            ) : (
                                <span className="rule-disabled">
                                    ● Disabled
                                </span>
                            )}


                            <div className="rule-actions">

                                <button
                                    type="button"
                                    className="rule-action-btn"
                                    disabled={
                                        updatingId === rule.id
                                    }
                                    onClick={() =>
                                        handleToggle(rule)
                                    }
                                >
                                    {updatingId === rule.id
                                        ? "..."
                                        : rule.enabled
                                        ? "Disable"
                                        : "Enable"}
                                </button>


                                <button
                                    type="button"
                                    className="rule-action-btn delete"
                                    disabled={
                                        updatingId === rule.id
                                    }
                                    onClick={() =>
                                        handleDelete(rule.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </article>
                );
            })}

        </div>
    );
};


/* =========================================================
   CREATE RULE MODAL
========================================================= */

const CreateAlertRule = ({
    onClose,
    onCreated,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        metric: "power",
        condition: ">",
        threshold: "",
        severity: "medium",
        enabled: true,
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    /* =====================================================
       HANDLE INPUT
    ===================================================== */

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError("Please enter a rule name.");
            return;
        }

        if (
            formData.threshold === "" ||
            Number.isNaN(Number(formData.threshold))
        ) {
            setError(
                "Please enter a valid threshold."
            );
            return;
        }

        try {
            setSubmitting(true);

            await createAlertRule({
                name: formData.name.trim(),
                metric: formData.metric,
                condition: formData.condition,
                threshold: Number(formData.threshold),
                severity: formData.severity,
                enabled: formData.enabled,
            });

            if (onCreated) {
                await onCreated();
            }
        } catch (err) {
            console.error(
                "Error creating alert rule:",
                err
            );

            setError(
                err?.response?.data
                    ? JSON.stringify(
                          err.response.data
                      )
                    : "Unable to create the alert rule."
            );
        } finally {
            setSubmitting(false);
        }
    };


    /* =====================================================
       MODAL
    ===================================================== */

    return (
        <div
            className="rules-modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >

            <div className="rules-modal">

                <div className="rules-modal-header">

                    <h2>
                        Create alert rule
                    </h2>

                    <button
                        type="button"
                        className="rules-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <form
                    className="rule-form"
                    onSubmit={handleSubmit}
                >

                    {/* NAME */}

                    <div className="rule-form-group">

                        <label htmlFor="rule-name">
                            Rule name
                        </label>

                        <input
                            id="rule-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. High AC Power"
                        />

                    </div>


                    {/* METRIC */}

                    <div className="rule-form-group">

                        <label htmlFor="rule-metric">
                            Metric
                        </label>

                        <select
                            id="rule-metric"
                            name="metric"
                            value={formData.metric}
                            onChange={handleChange}
                        >
                            <option value="power">
                                Power
                            </option>

                            <option value="energy_total">
                                Energy Total
                            </option>

                            <option value="energy_delta">
                                Energy Delta
                            </option>

                            <option value="energy_saved">
                                Energy Saved
                            </option>

                            <option value="power_energy">
                                Power Energy
                            </option>

                            <option value="temperature">
                                Temperature
                            </option>

                            <option value="target_temperature">
                                Target Temperature
                            </option>

                            <option value="humidity">
                                Humidity
                            </option>

                            <option value="filter_usage">
                                Filter Usage
                            </option>
                        </select>

                    </div>


                    {/* CONDITION */}

                    <div className="rule-form-group">

                        <label htmlFor="rule-condition">
                            Condition
                        </label>

                        <select
                            id="rule-condition"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value=">">
                                Greater than
                            </option>

                            <option value="<">
                                Less than
                            </option>

                            <option value=">=">
                                Greater than or equal
                            </option>

                            <option value="<=">
                                Less than or equal
                            </option>
                        </select>

                    </div>


                    {/* THRESHOLD */}

                    <div className="rule-form-group">

                        <label htmlFor="rule-threshold">
                            Threshold
                        </label>

                        <input
                            id="rule-threshold"
                            name="threshold"
                            type="number"
                            step="any"
                            value={formData.threshold}
                            onChange={handleChange}
                            placeholder="e.g. 5000"
                        />

                    </div>


                    {/* SEVERITY */}

                    <div className="rule-form-group">

                        <label htmlFor="rule-severity">
                            Severity
                        </label>

                        <select
                            id="rule-severity"
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="critical">
                                Critical
                            </option>
                        </select>

                    </div>


                    {/* ENABLED */}

                    <label className="rule-form-checkbox">

                        <input
                            type="checkbox"
                            name="enabled"
                            checked={formData.enabled}
                            onChange={handleChange}
                        />

                        Enable this rule

                    </label>


                    {/* ERROR */}

                    {error && (
                        <div className="rule-error">
                            {error}
                        </div>
                    )}


                    {/* ACTIONS */}

                    <div className="rule-form-actions">

                        <button
                            type="button"
                            className="rule-cancel-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rule-submit-btn"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating..."
                                : "Create rule"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

const AlertRules = ({
    mode,
    rules = [],
    onRulesChange,
    onClose,
    onCreated,
}) => {
    /*
     * When mode="create", this component becomes
     * the creation modal.
     *
     * Otherwise it displays all existing rules.
     */

    if (mode === "create") {
        return (
            <CreateAlertRule
                onClose={onClose}
                onCreated={onCreated}
            />
        );
    }

    return (
        <AlertRulesList
            rules={rules}
            onRulesChange={onRulesChange}
        />
    );
};

export default AlertRules;