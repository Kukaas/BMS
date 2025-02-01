import BarangayClearance from "../models/barangay.clearance.model.js";
import {
    sendNotificationToBarangaySecretaries,
    createNotification
} from "../utils/notifications.js";
import User from "../models/user.model.js";

export const createBarangayClearance = async (req, res, next) => {
    try {
        const { name, email, purpose, contactNumber } = req.body;
        const userBarangay = req.user.barangay; // Get barangay from authenticated user

        console.log("User details:", {
            name: req.user.name,
            barangay: userBarangay,
            role: req.user.role
        });

        // Validate required fields
        if (!name || !email || !purpose || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayClearance = new BarangayClearance({
            name,
            email,
            barangay: userBarangay,
            purpose,
            contactNumber,
        });

        await barangayClearance.save();
        console.log("Saved barangay clearance:", barangayClearance._id);

        // Create and send notification to secretaries
        const secretaryNotification = createNotification(
            "New Barangay Clearance Request",
            `${name} has requested a barangay clearance for ${purpose}`,
            "request",
            barangayClearance._id,
            "BarangayClearance"
        );

        // Send notification to secretaries of the user's barangay
        const notificationSent = await sendNotificationToBarangaySecretaries(userBarangay, secretaryNotification);

        if (!notificationSent) {
            console.log("Warning: Failed to send notifications to secretaries in barangay:", userBarangay);
        }

        res.status(201).json({
            success: true,
            message: "Barangay clearance request created successfully",
            data: barangayClearance,
        });
    } catch (error) {
        console.error("Error creating barangay clearance:", error);
        next(error);
    }
};

export const approveBarangayClearance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const barangayClearance = await BarangayClearance.findById(id);

        if (!barangayClearance) {
            return res.status(404).json({
                success: false,
                message: "Barangay clearance not found",
            });
        }

        const date = new Date();
        barangayClearance.isVerified = status === "approved";
        barangayClearance.status = status;
        barangayClearance.dateOfIssuance = date;

        await barangayClearance.save();

        // Create and send notification to the requestor
        const user = await User.findOne({ email: barangayClearance.email });
        if (user) {
            const notification = createNotification(
                "Barangay Clearance Status Update",
                `Your barangay clearance request has been ${status}`,
                "status_update",
                barangayClearance._id,
                "BarangayClearance"
            );

            // Update user's notifications
            user.notifications.push(notification);
            user.unreadNotifications += 1;
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: barangayClearance,
        });
    } catch (error) {
        console.error("Error updating barangay clearance:", error);
        next(error);
    }
};
