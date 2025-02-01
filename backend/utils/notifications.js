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
        // Normalize barangay name to match database format
        const normalizedBarangay = barangay.charAt(0).toUpperCase() + barangay.slice(1).toLowerCase();
        console.log("Sending notification to secretaries in barangay:", {
            originalBarangay: barangay,
            normalizedBarangay: normalizedBarangay
        });

        // First find all secretaries and chairmen regardless of isActive status
        const allSecretaries = await User.find({
            barangay: normalizedBarangay,
            role: { $in: ['secretary', 'chairman'] }
        });

        console.log("All secretaries found (including inactive):", allSecretaries.map(s => ({
            name: s.name,
            role: s.role,
            barangay: s.barangay,
            isActive: s.isActive,
            hasIsActive: 'isActive' in s // Debug if field exists
        })));

        // Then find active ones
        const activeSecretaries = await User.find({
            barangay: normalizedBarangay,
            role: { $in: ['secretary', 'chairman'] },
            $or: [
                { isActive: true },
                { isActive: { $exists: false } } // Include documents where isActive isn't set
            ]
        });

        console.log("Active secretaries found:", {
            count: activeSecretaries.length,
            details: activeSecretaries.map(s => ({
                id: s._id,
                name: s.name,
                role: s.role,
                barangay: s.barangay,
                isActive: s.isActive
            }))
        });

        if (activeSecretaries.length === 0) {
            console.log(`No active secretaries found for barangay: ${normalizedBarangay}`);
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
                console.log(`Notification sent successfully to ${secretary.role} ${secretary.name}`);
            } catch (error) {
                console.error(`Failed to send notification to ${secretary.role} ${secretary.name}:`, error);
            }
        }

        return true;

    } catch (error) {
        console.error("Error sending notifications to secretaries:", error);
        console.error("Error details:", error.stack);
        return false;
    }
};

// Create notification object
export const createNotification = (title, message, type, docId = null, docModel = null) => {
    const notification = {
        title,
        message,
        type,
        read: false,
        relatedDocId: docId,
        docModel: docModel,
        createdAt: new Date()
    };
    console.log("Created notification:", notification);
    return notification;
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
            console.log("User not found for status notification:", document.email);
            return false;
        }

        const notification = createNotification(
            `${requestType} Status Update`,
            `Your ${requestType.toLowerCase()} request has been ${status}`,
            "status_update",
            document._id,
            requestType
        );

        user.notifications.push(notification);
        user.unreadNotifications += 1;
        await user.save();

        console.log(`${requestType} status notification sent to user:`, user.name);
        return true;
    } catch (error) {
        console.error(`Error sending ${requestType} status notification:`, error);
        return false;
    }
};