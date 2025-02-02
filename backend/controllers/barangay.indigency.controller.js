import BarangayIndigency from "../models/barangay.indigency.model.js";
import { createNotification } from "../utils/notifications.js";
import User from "../models/user.model.js";

export const createBarangayIndigency = async (req, res, next) => {
    try {
        const { name, barangay, contactNumber, purpose } = req.body;
        const user = req.user;

        // Validate required fields
        if (!name || !barangay || !contactNumber || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayIndigency = new BarangayIndigency({
            userId: user.id,
            name,
            email: user.email,
            barangay,
            contactNumber,
            purpose,
        });

        await barangayIndigency.save();

        // Create notification for barangay staff
        const staffNotification = createNotification(
            "New Indigency Request",
            `A new indigency request has been submitted by ${name} for ${purpose}.`,
            "request",
            barangayIndigency._id,
            "BarangayIndigency"
        );

        // Find and notify all secretaries and chairman in the same barangay
        const barangayStaff = await User.find({
            barangay,
            role: { $in: ["secretary", "chairman"] },
            isActive: true // Only notify active staff
        });

        // Send notifications to all barangay staff
        const notificationPromises = barangayStaff.map(staff =>
            User.findByIdAndUpdate(staff._id, {
                $push: { notifications: staffNotification },
                $inc: { unreadNotifications: 1 }
            })
        );

        await Promise.all(notificationPromises);

        res.status(201).json({
            success: true,
            message: "Barangay Indigency request submitted successfully",
            data: barangayIndigency,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyBarangayIndigency = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { name: secretaryName, barangay } = req.user;

        // Validate user role
        if (!["secretary", "chairman"].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to verify indigency requests"
            });
        }

        // Validate status
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const barangayIndigency = await BarangayIndigency.findOne({
            _id: id,
            barangay // Ensure the document belongs to secretary's barangay
        });

        if (!barangayIndigency) {
            return res.status(404).json({
                success: false,
                message: "Barangay Indigency not found",
            });
        }

        barangayIndigency.isVerified = status === "Approved";
        barangayIndigency.status = status;
        if (status === "Approved") {
            barangayIndigency.dateOfIssuance = new Date();
        }

        await barangayIndigency.save();

        // Create status update notification for other staff members
        const staffNotification = createNotification(
            "Indigency Request Updated",
            `An indigency request from ${barangayIndigency.name} has been ${status.toLowerCase()} by ${secretaryName}`,
            "status_update",
            barangayIndigency._id,
            "BarangayIndigency"
        );

        // Find and notify other staff members in the same barangay
        const otherStaff = await User.find({
            barangay: barangayIndigency.barangay,
            role: { $in: ["secretary", "chairman"] },
            _id: { $ne: req.user.id }, // Exclude the current user
            isActive: true
        });

        // Send notifications to other staff members
        const notificationPromises = otherStaff.map(staff =>
            User.findByIdAndUpdate(staff._id, {
                $push: { notifications: staffNotification },
                $inc: { unreadNotifications: 1 }
            })
        );

        await Promise.all(notificationPromises);

        res.status(200).json({
            success: true,
            message: `Indigency request ${status.toLowerCase()} successfully`,
            data: barangayIndigency,
        });
    } catch (error) {
        console.error("Error verifying indigency request:", error);
        next(error);
    }
};
