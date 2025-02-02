import User from "../models/user.model.js";

// Get user notifications
export const getUserNotifications = async (req, res, next) => {
    try {
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
        next(error);
    }
};

// Mark notifications as read
export const markNotificationsAsRead = async (req, res, next) => {
    try {
        const { notificationIds } = req.body;

        // Use findOneAndUpdate to update notifications atomically
        const updateQuery =
            notificationIds && notificationIds.length > 0
                ? {
                      $set: {
                          "notifications.$[elem].read": true,
                          unreadNotifications: 0,
                      },
                  }
                : {
                      $set: {
                          "notifications.$[].read": true,
                          unreadNotifications: 0,
                      },
                  };

        const options =
            notificationIds && notificationIds.length > 0
                ? {
                      arrayFilters: [{ "elem._id": { $in: notificationIds } }],
                      new: true,
                  }
                : { new: true };

        const user = await User.findOneAndUpdate({ _id: req.user.id }, updateQuery, options);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notifications marked as read",
            data: {
                notifications: user.notifications,
                unreadCount: 0,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                $pull: { notifications: { _id: notificationId } },
                $inc: { unreadNotifications: -1 },
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
            data: {
                notifications: user.notifications,
                unreadCount: user.unreadNotifications,
            },
        });
    } catch (error) {
        next(error);
    }
};