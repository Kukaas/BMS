import BarangayIndigency from "../models/barangay.indigency.model.js";
import {
    createNotification,
    sendNotificationToBarangaySecretaries,
} from "../utils/notifications.js";
import User from "../models/user.model.js";
import { createLog } from "./log.controller.js";
import { createTransactionHistory } from "./transaction.history.controller.js";

export const createBarangayIndigency = async (req, res, next) => {
    try {
        const { userId, name, email, purpose, contactNumber } = req.body;
        const userBarangay = req.user.barangay;

        if (!name || !email || !purpose || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayIndigency = new BarangayIndigency({
            userId,
            name,
            email,
            barangay: userBarangay,
            purpose,
            contactNumber,
        });

        await createLog(
            userId,
            "Barangay Indigency Request",
            "Barangay Indigency",
            `${name} has requested a barangay indigency for ${purpose}`
        );

        const savedIndigency = await barangayIndigency.save();

        // Create transaction history with proper object structure
        const transactionData = {
            userId: req.user.id,
            transactionId: savedIndigency._id,
            residentName: name,
            requestedDocument: "Barangay Indigency",
            dateRequested: new Date(),
            barangay: userBarangay,
            action: "created",
            status: "Pending",
        };

        console.log("Transaction data:", transactionData); // Debug log
        await createTransactionHistory(transactionData);

        // Create and send notification to secretaries
        const staffNotification = createNotification(
            "New Barangay Indigency Request",
            `${name} has requested a barangay indigency for ${purpose}`,
            "request",
            savedIndigency._id,
            "BarangayIndigency"
        );

        // Send notification to secretaries of the user's barangay
        await sendNotificationToBarangaySecretaries(userBarangay, staffNotification);

        res.status(201).json({
            success: true,
            message: "Barangay indigency request created successfully",
            data: savedIndigency,
        });
    } catch (error) {
        console.error("Error creating barangay indigency:", error);
        res.status(500).json({ message: "Error creating barangay indigency" });
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
                message: "Not authorized to verify indigency requests",
            });
        }

        // Validate status
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const barangayIndigency = await BarangayIndigency.findOne({
            _id: id,
            barangay, // Ensure the document belongs to secretary's barangay
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
            `An indigency request from ${
                barangayIndigency.name
            } has been ${status.toLowerCase()} by ${secretaryName}`,
            "status_update",
            barangayIndigency._id,
            "BarangayIndigency"
        );

        // Find and notify other staff members in the same barangay
        const otherStaff = await User.find({
            barangay: barangayIndigency.barangay,
            role: { $in: ["secretary", "chairman"] },
            _id: { $ne: req.user.id }, // Exclude the current user
            isActive: true,
        });

        // Send notifications to other staff members
        const notificationPromises = otherStaff.map((staff) =>
            User.findByIdAndUpdate(staff._id, {
                $push: { notifications: staffNotification },
                $inc: { unreadNotifications: 1 },
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
