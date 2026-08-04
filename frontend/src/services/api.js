import axios from "axios";

const api = axios.create({

    baseURL: "https://pout-sandworm-angriness.ngrok-free.dev/api",

    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },

});


// REQUEST
api.interceptors.request.use((config) => {

    const publicRoutes = [

        "/auth/login/",
        "/auth/forgot-password/",
        "/auth/reset-password/",
        "/auth/refresh/"

    ];

    const isPublic = publicRoutes.some(route =>
        config.url.includes(route)
    );

    if (!isPublic) {

        const token = localStorage.getItem("access_token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

    }

    return config;

});


// RESPONSE
api.interceptors.response.use(

    response => response,

    async error => {

        const originalRequest = error.config;

        if (

            error.response?.status === 401 &&
            !originalRequest._retry

        ) {

            originalRequest._retry = true;

            const refresh = localStorage.getItem(
                "refresh_token"
            );

            if (!refresh) {

                localStorage.clear();

                window.location.href = "/login";

                return Promise.reject(error);

            }

            try {

                const response = await axios.post(

                    "http://127.0.0.1:8000/api/auth/refresh/",

                    {
                        refresh: refresh
                    }

                );

                const newAccess =
                    response.data.access;

                localStorage.setItem(

                    "access_token",

                    newAccess

                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(originalRequest);

            }

            catch {

                localStorage.clear();

                window.location.href = "/login";

            }
        }
        return Promise.reject(error);
    }

);

export default api;