import User from "../models/user.model.js";

// Get user notifications
export const getUserNotifications = async (req, res, next) => {
    try {
        console.log("Getting notifications for user:", req.user.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                notifications: user.notifications,
                unreadCount: user.unreadNotifications
            }
        });
    } catch (error) {
        console.error("Error in getUserNotifications:", error);
        next(error);
    }
};

// Mark notifications as read
export const markNotificationsAsRead = async (req, res, next) => {
    try {
        const { notificationIds } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Mark specific notifications as read
        if (notificationIds && notificationIds.length > 0) {
            user.notifications.forEach(notification => {
                if (notificationIds.includes(notification._id.toString())) {
                    notification.read = true;
                }
            });
        } else {
            // Mark all notifications as read if no specific IDs provided
            user.notifications.forEach(notification => {
                notification.read = true;
            });
        }

        user.unreadNotifications = 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Notifications marked as read",
            data: {
                notifications: user.notifications,
                unreadCount: 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const notificationIndex = user.notifications.findIndex(
            n => n._id.toString() === notificationId
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Update unread count if deleting an unread notification
        if (!user.notifications[notificationIndex].read) {
            user.unreadNotifications = Math.max(0, user.unreadNotifications - 1);
        }

        user.notifications.splice(notificationIndex, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
            data: {
                notifications: user.notifications,
                unreadCount: user.unreadNotifications
            }
        });
    } catch (error) {
        next(error);
    }
};