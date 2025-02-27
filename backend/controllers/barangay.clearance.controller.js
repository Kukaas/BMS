import BarangayClearance from "../models/barangay.clearance.model.js";
import {
    sendNotificationToBarangaySecretaries,
    createNotification,
} from "../utils/notifications.js";
import User from "../models/user.model.js";
import { createLog } from "./log.controller.js";
import { createTransactionHistory } from "./transaction.history.controller.js";

export const createBarangayClearance = async (req, res, next) => {
    try {
        const {
            userId,
            name,
            email,
            contactNumber,
            purpose,
            barangay,
            age,
            purok,
            dateOfBirth,
            sex,
            placeOfBirth,
            civilStatus,
        } = req.body;

        if (
            !name ||
            !purpose ||
            !age ||
            !purok ||
            !dateOfBirth ||
            !sex ||
            !placeOfBirth ||
            !civilStatus
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayClearance = new BarangayClearance({
            userId,
            name,
            email,
            age,
            contactNumber,
            barangay,
            purpose,
            purok,
            dateOfBirth,
            sex,
            placeOfBirth,
            civilStatus,
            type: "Barangay Clearance",
        });

        // Create log entry
        await createLog(
            userId,
            "Barangay Clearance Request",
            "Barangay Clearance",
            `${name} has requested a barangay clearance for ${purpose}`
        );

        await barangayClearance.save();

        // Create transaction history
        await createTransactionHistory({
            userId,
            transactionId: barangayClearance._id,
            residentName: name,
            requestedDocument: "Barangay Clearance",
            dateRequested: new Date(),
            barangay,
            action: "created",
            status: "Pending",
        });

        // Create and send notification to secretaries
        const staffNotification = createNotification(
            "New Barangay Clearance Request",
            `${name} has requested a barangay clearance for ${purpose}`,
            "request",
            barangayClearance._id,
            "BarangayClearance"
        );

        // Send notification to secretaries of the user's barangay
        await sendNotificationToBarangaySecretaries(barangay, staffNotification);

        res.status(201).json({
            success: true,
            message: "Barangay clearance request created successfully",
            data: {
                ...barangayClearance.toObject(),
                type: "Barangay Clearance",
            },
        });
    } catch (error) {
        console.error("Error creating barangay clearance:", error);
        res.status(500).json({ message: "Error creating barangay clearance" });
    }
};

export const approveBarangayClearance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { name: secretaryName } = req.user;

        const barangayClearance = await BarangayClearance.findById(id);

        if (!barangayClearance) {
            return res.status(404).json({
                success: false,
                message: "Barangay clearance not found",
            });
        }

        const currentDate = new Date();

        // Update status-related fields
        barangayClearance.status = status;
        barangayClearance.isVerified = status === "Approved";

        // Update date fields based on status
        if (status === "Approved") {
            barangayClearance.dateApproved = currentDate;
            barangayClearance.dateOfIssuance = currentDate;
        } else if (status === "Completed") {
            barangayClearance.dateCompleted = currentDate;
        }

        await barangayClearance.save();

        // Create and send notification to the requestor with secretary info
        const user = await User.findOne({ email: barangayClearance.email });
        if (user) {
            const notification = createNotification(
                "Barangay Clearance Status Update",
                `Your barangay clearance request has been ${status} by ${secretaryName}`,
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
