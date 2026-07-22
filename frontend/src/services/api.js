import axios from "axios";


const api = axios.create({

    baseURL: "http://127.0.0.1:8000/api",

    headers: {
        "Content-Type": "application/json",
    },

});

// Add JWT only for protected routes
api.interceptors.request.use(
    (config) => {
        const publicRoutes = ["/auth/login/","/auth/forgot-password/","/auth/reset-password/"];
        const isPublicRoute = publicRoutes.some(
            (route) => config.url.includes(route)
        );


        if (!isPublicRoute) {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.Authorization =`Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }

);



export default api;