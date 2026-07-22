import api from "./api"


export const getMeasurements = async () => {
    const response = await api.get("measurements/");
    return response.data;
};


export const getMeasurement = async (id) => {
    const response = await api.get(`measurements/${id}/`);
    return response.data;
};

export const getLatestMeasurement = async (id) => {
    const response = await api.get(`measurements/latest/`);
    return response.data;
};


export const getDeviceMeasurements = async (id) => {
    const response = await api.get(`devices/${id}/measurements/`);
    return response.data;
};

export const getLatestDeviceMeasurement = async (id) => {
    const response = await api.get(`devices/${id}/measurements/latest/`);
    return response.data;
};


