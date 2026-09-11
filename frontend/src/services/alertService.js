import api from "./api";

// ===============================
// ALERTS
// ===============================

export const getAlerts = async (params = {}) => {
    const response = await api.get("/alerts/", {
        params,
    });

    return response.data;
};

export const getAlert = async (id) => {
    const response = await api.get(`/alerts/${id}/`);

    return response.data;
};

export const updateAlertStatus = async (id, status) => {
    const response = await api.patch(
        `/alerts/${id}/update/`,
        {
            status,
        }
    );

    return response.data;
};


// ===============================
// ALERT RULES
// ===============================

export const getAlertRules = async () => {
    const response = await api.get("/alerts/rules/");

    return response.data;
};

export const createAlertRule = async (data) => {
    const response = await api.post(
        "/alerts/rules/",
        data
    );

    return response.data;
};

export const updateAlertRule = async (id, data) => {
    const response = await api.patch(
        `/alerts/rules/${id}/`,
        data
    );

    return response.data;
};

export const deleteAlertRule = async (id) => {
    await api.delete(`/alerts/rules/${id}/`);
};


export const getAlertHeatmap = async (month) => {
    const response = await api.get(`/alerts/heatmap/`, {
        params: {
            month,
        },
    });

    return response.data;
};


export const getUnsolvedAlerts = async (month) => {
    const response = await api.get(`/alerts/unsolved/`, {
        params: {
            month,
        },
    });

    return response.data;
};