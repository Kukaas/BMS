import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Check if response indicates failure
        if (response.data && response.data.success === false) {
            return Promise.reject(response);
        }
        return response;
    },
    (error) => {
        // Don't redirect for password change errors
        if (error.config.url.includes('/change-password')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !error.response?.data?.isPasswordError) {
            // Clear auth state and redirect to login only for non-password errors
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }
);

export default api;
