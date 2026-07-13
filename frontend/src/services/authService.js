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
    user_id,
    token,
    password,
    passwordConfirm
) => {

    const response = await api.post(

        `/auth/reset-password/${user_id}/${token}/`,

        {
            password,
            password_confirm: passwordConfirm,
        }

    );


    return response.data;

};