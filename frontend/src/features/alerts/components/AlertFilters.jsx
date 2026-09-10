import { useState, useRef, useEffect } from "react";
import "../Alerts.css";

/* ---------------------------------------------------------
   CustomSelect
   Pill-shaped trigger + dropdown panel with a gradient
   highlight on the selected option (matches the reference
   screenshot). Drop-in replacement for a native <select>:
   pass `options` as [{ value, label }] and it fires
   onChange(value) just like a native select would.
--------------------------------------------------------- */
const CustomSelect = ({ id, label, value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selected = options.find((o) => o.value === value) ?? options[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="filter-group" ref={wrapperRef}>
            {label && (
                <label htmlFor={id} className="filter-label">
                    {label}
                </label>
            )}

            <div className="custom-select">
                {/* Trigger */}
                <button
                    id={id}
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className={`custom-select-trigger ${open ? "is-open" : ""}`}
                >
                    <span>{selected?.label}</span>
                    <span className={`custom-select-arrow ${open ? "is-open" : ""}`}>
                        ▾
                    </span>
                </button>

                {/* Dropdown panel */}
                {open && (
                    <div className="custom-select-panel">
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`custom-select-option ${
                                        isSelected ? "is-selected" : ""
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------------------------------------------------
   AlertFilters — same props/behavior as before, now using
   CustomSelect for Severity and Sort.
--------------------------------------------------------- */
const AlertFilters = ({
    severity,
    search,
    sortBy,
    onSeverityChange,
    onSearchChange,
    onSortChange,
    onClear,
}) => {
    return (
        <div className="alert-filters">

            {/* SEVERITY */}
            <CustomSelect
                id="severity-filter"
                label="Severity"
                value={severity}
                onChange={onSeverityChange}
                options={[
                    { value: "all", label: "All severities" },
                    { value: "critical", label: "Critical" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                ]}
            />

            {/* SEARCH */}
            <div className="filter-group filter-search">
                <label htmlFor="alert-search">Search</label>

                <div className="search-wrapper">
                    <span className="search-icon">⌕</span>
                    <input
                        id="alert-search"
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search device, room or alert..."
                    />
                </div>
            </div>

            {/* SORT */}
            <CustomSelect
                id="alert-sort"
                label="Sort by"
                value={sortBy}
                onChange={onSortChange}
                options={[
                    { value: "newest", label: "Newest first" },
                    { value: "oldest", label: "Oldest first" },
                    { value: "severity", label: "Severity" },
                ]}
            />

            {/* CLEAR */}
            <button
                type="button"
                className="clear-filters-btn"
                onClick={onClear}
            >
                Clear filters
            </button>

        </div>
    );
};

export default AlertFilters;
