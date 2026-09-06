import { useState } from "react";
import "./style.css";
import { exportMeasurements } from "../../../services/export";

const FORMATS = [
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
    { value: "xlsx", label: "Excel" },
];

const FIELD_GROUPS = [
    {
        label: "Device info",
        fields: [
            { value: "device.name", label: "Name" },
            { value: "device.external_id", label: "External ID" },
            { value: "device.room", label: "Room" },
        ],
    },
    {
        label: "Electrical / energy",
        fields: [
            { value: "power", label: "Power (W)" },
            { value: "energy_total", label: "Energy total (Wh)" },
            { value: "energy_delta", label: "Energy delta (Wh)" },
            { value: "energy_saved", label: "Energy saved (Wh)" },
            { value: "power_energy", label: "Power energy" },
        ],
    },
    {
        label: "Environment",
        fields: [
            { value: "temperature", label: "Temperature (°C)" },
            { value: "target_temperature", label: "Target temperature (°C)" },
            { value: "humidity", label: "Humidity (%)" },
        ],
    },
    {
        label: "Operating state",
        fields: [
            { value: "operating_state", label: "Operating state" },
            { value: "mode", label: "Mode" },
            { value: "fan_mode", label: "Fan mode" },
            { value: "swing_mode", label: "Swing mode" },
            { value: "sleep_mode", label: "Sleep mode" },
            { value: "wind_free", label: "Wind free" },
        ],
    },
    {
        label: "Maintenance",
        fields: [
            { value: "filter_status", label: "Filter status" },
            { value: "filter_usage", label: "Filter usage (%)" },
        ],
    },
];

const ALL_FIELD_VALUES = FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.value));

function ExportModal({ onClose }) {
    const [format, setFormat] = useState("csv");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedFields, setSelectedFields] = useState(ALL_FIELD_VALUES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function toggleField(value) {
        setSelectedFields((prev) =>
            prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
        );
    }

    function toggleAllFields() {
        setSelectedFields(selectedFields.length === ALL_FIELD_VALUES.length ? [] : ALL_FIELD_VALUES);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (selectedFields.length === 0) {
            setError("Select at least one field.");
            return;
        }
        setLoading(true);
        try {
            const blob = await exportMeasurements({
                format,
                start: startDate,
                end: endDate,
                fields: selectedFields,
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `measurements.${format}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            onClose();
        }
        catch (err) {
            console.error(err);
            setError("Export failed.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal export-modal">
                <h2>Export Data</h2>

                <form onSubmit={handleSubmit}>
                    <div className="export-body">
                        <div className="modal-section">
                            <label className="modal-label">Format</label>
                            <div className="format-options">
                                {FORMATS.map((f) => (
                                    <button
                                        key={f.value}
                                        type="button"
                                        className={`format-chip ${format === f.value ? "active" : ""}`}
                                        onClick={() => setFormat(f.value)}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="export-top">
                            <div className="modal-section">
                                <label className="modal-label">Date range</label>
                                <div className="date-range">
                                    <input
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span>to</span>
                                    <input
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="export-bottom">
                            <div className="fields-header">
                                <label className="modal-label">Fields</label>
                                <button type="button" className="select-all-btn" onClick={toggleAllFields}>
                                    {selectedFields.length === ALL_FIELD_VALUES.length ? "Deselect all" : "Select all"}
                                </button>
                            </div>

                            <div className="fields-section">
                                {FIELD_GROUPS.map((group) => (
                                    <div key={group.label} className="field-group">
                                        <span className="field-group-label">{group.label}</span>
                                        <div className="fields-grid">
                                            {group.fields.map((f) => (
                                                <label key={f.value} className="field-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFields.includes(f.value)}
                                                        onChange={() => toggleField(f.value)}
                                                    />
                                                    {f.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && <p className="modal-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Exporting..." : "Export"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExportModal;