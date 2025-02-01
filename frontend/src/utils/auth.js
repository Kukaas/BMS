import { store } from "@/redux/store";
import { loginSuccess } from "@/redux/user/userSlice";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

export const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    try {
        // Decode the token to get user data
        const decodedToken = jwtDecode(token);

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return false;
        }

        // If token is valid, update the store with user data
        store.dispatch(loginSuccess({ ...decodedToken, token }));
        return true;
    } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
};
