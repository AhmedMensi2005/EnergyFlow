import api from "./api";

export async function getAnalyticsKPIs(period = "7d") {
    const response = await api.get(`analytics/kpis/?period=${period}`);
    return response.data;
}

export async function getConsumptionAnalytics(period, metric) {
    const response = await api.get(`/analytics/consumption/?period=${period}&metric=${metric}`);
    return response.data;
}

export async function getTopRoomsAnalytics(period, metric) {
    const response = await api.get(`/analytics/top-rooms/?period=${period}&metric=${metric}`);
    return response.data;
}

export async function getTopDevicesAnalytics(period, metric) {
    const response = await api.get(`/analytics/top-devices/?period=${period}&metric=${metric}`);
    return response.data;
}

export async function getRoomDistributionAnalytics(period, metric) {
    const response = await api.get(`/analytics/room-distribution/?period=${period}&metric=${metric}`);
    return response.data;
}

export const getEnvironment = async () => {
    const response = await api.get(`analytics/environment/`);
    return response.data;
};