import api from "./api";


// Login
export const login = async (email, password) => {

    const response = await api.post(
        "/auth/login/",
        {
            email,
            password,
        }
    );

    return response.data;

};



// Logout
export const logout = () => {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );


    sessionStorage.removeItem(
        "access_token"
    );

    sessionStorage.removeItem(
        "refresh_token"
    );

};



// Forgot password
export const forgotPassword = async (email) => {

    const response = await api.post(
        "/auth/forgot-password/",
        {
            email,
        }
    );

    return response.data;

};



// Reset password
export const resetPassword = async (
    uid,
    token,
    password,
    passwordConfirm
) => {

    const response = await api.post(

        `/auth/reset-password/${uid}/${token}/`,

        {
            password,
            password_confirm: passwordConfirm,
        }

    );


    return response.data;

};
export const createAccount = async(data)=>{

    const response = await api.post(

        "/users/create-account/",

        data

    );


    return response.data;

};