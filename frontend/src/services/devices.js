import api from "./api"

export const getDevices = async () => {
    const response = await api.get("devices/");
    return response.data;
};

// GET one room
export const getDevice = async (id) => {
    const response = await api.get(`devices/${id}/`);
    return response.data;
};

export const updateDevice = async (id, device) => {
    const response = await api.put(`devices/${id}/`, device);
    return response.data;
};
