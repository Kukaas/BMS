import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const [, payload] = token.split(".");
        const decodedPayload = JSON.parse(atob(payload));
        const currentTime = Math.floor(Date.now() / 1000);

        return decodedPayload.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

export const getRedirectPath = (role) => {
    switch (role) {
        case "superAdmin":
            return "/dashboard?tab=overview";
        case "chairman":
            return "/dashboard?tab=overview";
        case "secretary":
            return "/dashboard?tab=overview";
        case "treasurer":
            return "/dashboard?tab=overview";
        default:
            return "/dashboard?tab=overview";
    }
};

export const isAdminRole = (role) => {
  return role === 'chairman' || role === 'secretary';
};