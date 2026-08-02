import api from "./api";

/* ===========================
   GET USERS
=========================== */

export const getUsers = async () => {

    const response = await api.get("/users/");

    return response.data;

};


/* ===========================
   INVITE USER
=========================== */

export const inviteUser = async (data) => {

    const response = await api.post(
        "/users/invite/",
        data
    );

    return response.data;

};


/* ===========================
   UPDATE USER
=========================== */

export const updateUser = async (id, data) => {

    const response = await api.put(
        `/users/${id}/update/`,
        data
    );

    return response.data;

};


/* ===========================
   DELETE OPERATOR
=========================== */

export const deleteOperator = async (id) => {

    const response = await api.delete(
        `/users/operator/${id}/delete/`
    );

    return response.data;

};


/* ===========================
   DELETE ADMIN
=========================== */

export const deleteAdmin = async (id) => {

    const response = await api.delete(
        `/users/admin/${id}/delete/`
    );

    return response.data;

};


/* ===========================
   LIST INVITATIONS
=========================== */

export const getInvitations = async()=>{

    const response = await api.get(
        "/users/invitations/"
    );

    return response.data;

};
