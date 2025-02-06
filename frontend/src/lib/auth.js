import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export function getRedirectPath(role) {
    switch (role) {
        case "superAdmin":
            return "/dashboard?tab=overview";
        case "chairman":
        case "secretary":
            return "/dashboard?tab=overview";
        case "user":
            return "/dashboard?tab=overview";
        default:
            return "/sign-in";
    }
}

export const isAdminRole = (role) => {
  return role === 'chairman' || role === 'secretary';
};