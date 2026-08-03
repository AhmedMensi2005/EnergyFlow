// services/export.js
import api from "./api";

export async function exportMeasurements({ format, start, end, fields }) {
    const response = await api.get("measurements/export/", {
        params: {export_format: format, start, end, fields },
        paramsSerializer: { indexes: null },
        responseType: "blob",
    });

    return response.data;
}