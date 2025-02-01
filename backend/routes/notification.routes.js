import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    getUserNotifications,
    markNotificationsAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get user notifications
router.get("/", verifyToken, getUserNotifications);

// Mark notifications as read
router.post("/mark-read", verifyToken, markNotificationsAsRead);

// Delete notification
router.delete("/:notificationId", verifyToken, deleteNotification);

export default router;