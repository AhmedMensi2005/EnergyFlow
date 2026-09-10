import React, { useEffect, useMemo, useState } from "react";

import {
    getAlerts,
    getAlertRules,
} from "../../services/alertService";

import AlertCard from "./components/AlertCard";
import AlertDetails from "./components/AlertDetails";
import AlertFilters from "./components/AlertFilters";
import AlertRules from "./components/AlertRules";
import AlertStatus from "./components/AlertStatus";

import "./Alerts.css";


const Alerts = () => {
    /* =====================================================
       STATE
    ===================================================== */

    const [alerts, setAlerts] = useState([]);
    const [rules, setRules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [rulesLoading, setRulesLoading] = useState(true);

    const [selectedAlert, setSelectedAlert] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const [showRulesModal, setShowRulesModal] = useState(false);


    /* =====================================================
       LOAD ALERTS
    ===================================================== */

    const loadAlerts = async () => {
        try {
            setLoading(true);

            const data = await getAlerts();

            /*
             * Supports both:
             * - normal array response
             * - DRF paginated response { results: [] }
             */

            const alertData = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                    ? data.results
                    : [];

            setAlerts(alertData);
        } catch (error) {
            console.error("Error loading alerts:", error);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       LOAD ALERT RULES
    ===================================================== */

    const loadRules = async () => {
        try {
            setRulesLoading(true);

            const data = await getAlertRules();

            /*
             * Supports both:
             * - normal array response
             * - DRF paginated response { results: [] }
             */

            const ruleData = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                    ? data.results
                    : [];

            setRules(ruleData);
        } catch (error) {
            console.error("Error loading alert rules:", error);
            setRules([]);
        } finally {
            setRulesLoading(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        loadAlerts();
        loadRules();
    }, []);


    /* =====================================================
       ALERT COUNTS
    ===================================================== */

    const alertCounts = useMemo(() => {
        return {
            all: alerts.length,

            new: alerts.filter(
                (alert) => alert.status === "new"
            ).length,

            acknowledged: alerts.filter(
                (alert) => alert.status === "acknowledged"
            ).length,

            resolved: alerts.filter(
                (alert) => alert.status === "resolved"
            ).length,
        };
    }, [alerts]);


    /* =====================================================
       FILTER + SORT ALERTS
    ===================================================== */

    const filteredAlerts = useMemo(() => {
        let result = [...alerts];


        /* -------------------------------------------------
           STATUS
        ------------------------------------------------- */

        if (statusFilter !== "all") {
            result = result.filter(
                (alert) =>
                    alert.status === statusFilter
            );
        }


        /* -------------------------------------------------
           SEVERITY
        ------------------------------------------------- */

        if (severityFilter !== "all") {
            result = result.filter(
                (alert) =>
                    alert.severity === severityFilter
            );
        }


        /* -------------------------------------------------
           SEARCH
        ------------------------------------------------- */

        if (search.trim()) {
            const searchValue =
                search.toLowerCase().trim();

            result = result.filter((alert) => {
                return (
                    alert.title
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    alert.message
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    alert.device_name
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    alert.room_name
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    alert.rule_name
                        ?.toLowerCase()
                        .includes(searchValue)
                );
            });
        }


        /* -------------------------------------------------
           SORT
        ------------------------------------------------- */

        result.sort((a, b) => {
            if (sortBy === "severity") {
                const severityOrder = {
                    critical: 4,
                    high: 3,
                    medium: 2,
                    low: 1,
                };

                return (
                    (severityOrder[b.severity] || 0) -
                    (severityOrder[a.severity] || 0)
                );
            }


            const dateA = new Date(
                a.created_at
            ).getTime();

            const dateB = new Date(
                b.created_at
            ).getTime();


            if (sortBy === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;
        });


        return result;
    }, [
        alerts,
        statusFilter,
        severityFilter,
        search,
        sortBy,
    ]);


    /* =====================================================
       SELECT ALERT
    ===================================================== */

    const handleViewDetails = (alert) => {
        setSelectedAlert(alert);
    };


    /* =====================================================
       CLOSE ALERT DETAILS
    ===================================================== */

    const handleCloseDetails = () => {
        setSelectedAlert(null);
    };


    /* =====================================================
       ALERT UPDATED
    ===================================================== */

    const handleAlertUpdated = (updatedAlert) => {
        if (!updatedAlert) {
            return;
        }

        /*
         * Update the alert inside the list.
         */

        setAlerts((currentAlerts) =>
            currentAlerts.map((alert) =>
                alert.id === updatedAlert.id
                    ? updatedAlert
                    : alert
            )
        );


        /*
         * Update the details panel.
         */

        setSelectedAlert(updatedAlert);
    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setStatusFilter("all");
        setSeverityFilter("all");
        setSearch("");
        setSortBy("newest");
    };


    /* =====================================================
       RULE CREATED
    ===================================================== */

    const handleRuleCreated = async () => {
        setShowRulesModal(false);

        await loadRules();
    };


    /* =====================================================
       RULES CHANGED
    ===================================================== */

    const handleRulesChange = async () => {
        await loadRules();
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="alerts-page">
    
            {/* HEADER — OUTSIDE SCROLLABLE CONTENT */}
            <header className="alerts-header">
                <p className="alerts-subtitle">
                    Monitor alerts and manage your energy monitoring rules.
                </p>
    
                <button
                    type="button"
                    className="create-rule-btn"
                    onClick={() => setShowRulesModal(true)}
                >
                    <span className="btn-icon">+</span>
                    Create alert rule
                </button>
            </header>
    
            {/* SCROLLABLE CONTENT */}
            <main className="alerts-content">
    
                <AlertStatus
                    counts={alertCounts}
                    activeStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                />
    
                <AlertFilters
                    severity={severityFilter}
                    search={search}
                    sortBy={sortBy}
                    onSeverityChange={setSeverityFilter}
                    onSearchChange={setSearch}
                    onSortChange={setSortBy}
                    onClear={handleClearFilters}
                />
    
                {loading ? (
                    <div className="alerts-empty">
                        <p>Loading alerts...</p>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="alerts-empty">
                        <h3>No alerts found</h3>
                        <p>
                            There are no alerts matching your current filters.
                        </p>
                    </div>
                ) : (
                    <div className="alerts-list">
                        {filteredAlerts.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}
    
                <section className="rules-section">
                    
                    <div className="rules-section-header">
                        
                        <div>
                            <h2 className="rules-section-title">
                                Alert rules
                            </h2>
                            <p className="rules-section-subtitle">
                                All configured rules used to generate alerts.
                            </p>
                        </div>
                    </div>
    
                    {rulesLoading ? (
                        <div className="alerts-empty">
                            <p>Loading alert rules...</p>
                        </div>
                    ) : (
                        <AlertRules
                            rules={rules}
                            onRulesChange={handleRulesChange}
                        />
                    )}
                </section>
    
            </main>
    
            {/* DETAILS */}
            {selectedAlert && (
                <AlertDetails
                    alert={selectedAlert}
                    onClose={handleCloseDetails}
                    onAlertUpdated={handleAlertUpdated}
                />
            )}
    
            {/* CREATE RULE MODAL */}
            {showRulesModal && (
                <AlertRules
                    mode="create"
                    onClose={() => setShowRulesModal(false)}
                    onCreated={handleRuleCreated}
                />
            )}
    
        </div>
)}

export default Alerts;