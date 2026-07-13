import api from "./api";

// GET all rooms
export const getRooms = async () => {
    const response = await api.get("rooms/");
    return response.data;
};

// GET one room
export const getRoom = async (id) => {
    const response = await api.get(`rooms/${id}/`);
    return response.data;
};

// CREATE room
export const createRoom = async (room) => {
    const response = await api.post("rooms/", room);
    return response.data;
};

// UPDATE room
export const updateRoom = async (id, room) => {
    const response = await api.put(`rooms/${id}/`, room);
    return response.data;
};

// DELETE room
export const deleteRoom = async (id) => {
    await api.delete(`rooms/${id}/`);
};