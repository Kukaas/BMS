import axios from "@/lib/axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const notificationService = {
    getNotifications: async () => {
        const response = await axios.get("/notifications", getAuthHeader());
        return response.data;
    },

    markAsRead: async (notificationIds) => {
        const response = await axios.post("/notifications/mark-read", {
            notificationIds,
        }, getAuthHeader());
        return response.data;
    },

    deleteNotification: async (notificationId) => {
        const response = await axios.delete(`/notifications/${notificationId}`, getAuthHeader());
        return response.data;
    },
};