import User from "../models/user.model.js";

// Send notification to specific user
export const sendNotificationToUser = async (userId, notification) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found for notification:", userId);
            return false;
        }

        user.notifications.push(notification);
        user.unreadNotifications += 1;
        await user.save();
        console.log("Notification sent to user:", userId);
        return true;
    } catch (error) {
        console.error("Error sending notification to user:", error);
        return false;
    }
};

// Send notification to all secretaries in a barangay
export const sendNotificationToBarangaySecretaries = async (barangay, notification) => {
    try {
        const normalizedBarangay = barangay.trim().toLowerCase();

        const activeSecretaries = await User.find({
            role: "secretary",
            barangay: { $regex: new RegExp(`^${normalizedBarangay}$`, "i") },
            isActive: true,
        });

        if (activeSecretaries.length === 0) {
            return false;
        }

        // Send notification to each secretary
        for (const secretary of activeSecretaries) {
            try {
                if (!secretary.notifications) {
                    secretary.notifications = [];
                }
                if (typeof secretary.unreadNotifications !== 'number') {
                    secretary.unreadNotifications = 0;
                }

                secretary.notifications.push(notification);
                secretary.unreadNotifications += 1;
                await secretary.save();
            } catch (error) {
                console.error(`Failed to send notification to secretary:`, error);
            }
        }

        return true;

    } catch (error) {
        console.error("Error sending notifications to secretaries:", error);
        return false;
    }
};

// Create notification object
export const createNotification = (title, message, type, docId = null, docModel = null) => {
    return {
        title,
        message,
        type,
        read: false,
        relatedDocId: docId,
        docModel: docModel,
        createdAt: new Date()
    };
};

// Generic function to handle document request notifications
export const sendDocumentRequestNotification = async (document, requestType) => {
    try {
        // Create notification for secretaries
        const secretaryNotification = createNotification(
            `New ${requestType} Request`,
            `${document.name} has requested a ${requestType.toLowerCase()} for ${document.purpose}`,
            "request",
            document._id,
            requestType
        );

        // Send notification to secretaries
        const notificationSent = await sendNotificationToBarangaySecretaries(document.barangay, secretaryNotification);

        if (!notificationSent) {
            console.log(`Warning: Failed to send ${requestType} notifications to secretaries in barangay:`, document.barangay);
        }

        return notificationSent;
    } catch (error) {
        console.error(`Error sending ${requestType} notification:`, error);
        return false;
    }
};

// Generic function to handle document status update notifications
export const sendDocumentStatusNotification = async (document, status, requestType) => {
    try {
        const user = await User.findOne({ email: document.email });
        if (!user) {
            console.warn("User not found for status notification:", document.email);
            return false;
        }

        // Create notification for the user
        const notification = createNotification(
            `${requestType} Status Update`,
            `Your ${requestType.toLowerCase()} request has been ${status}`,
            "status_update",
            document._id,
            requestType.replace(/\s+/g, '')  // Remove spaces for model name
        );

        // Add notification to user's notifications array
        if (!user.notifications) {
            user.notifications = [];
        }
        user.notifications.push(notification);

        // Increment unread notifications counter
        if (typeof user.unreadNotifications !== 'number') {
            user.unreadNotifications = 0;
        }
        user.unreadNotifications += 1;

        await user.save();
        return true;
    } catch (error) {
        console.error(`Error sending ${requestType} status notification:`, error);
        return false;
    }
};