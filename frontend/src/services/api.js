import axios from "axios";


const api = axios.create({

    baseURL: "https://pout-sandworm-angriness.ngrok-free.dev/api",

    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
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