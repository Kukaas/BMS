import BarangayIndigency from "../models/barangay.indigency.model.js";
import {
    createNotification,
    sendNotificationToBarangaySecretaries,
} from "../utils/notifications.js";
import User from "../models/user.model.js";
import { createLog } from "./log.controller.js";
import { createTransactionHistory } from "./transaction.history.controller.js";
import { STATUS_TYPES } from "../models/barangay.indigency.model.js";

export const createBarangayIndigency = async (req, res, next) => {
    try {
        const { userId, name, email, contactNumber, purpose, barangay, age, purok } = req.body;

        // Validate required fields
        if (!name || !purpose || !age || !email || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayIndigency = new BarangayIndigency({
            userId,
            name,
            email,
            age,
            contactNumber,
            barangay,
            purpose,
            purok,
        });

        await createLog(
            userId,
            "Barangay Indigency Request",
            "Barangay Indigency",
            `${name} has requested a barangay indigency for ${purpose}`
        );

        const savedIndigency = await barangayIndigency.save();

        // Create transaction history
        await createTransactionHistory({
            userId,
            transactionId: savedIndigency._id,
            residentName: name,
            requestedDocument: "Barangay Indigency",
            dateRequested: new Date(),
            barangay,
            action: "created",
            status: STATUS_TYPES.PENDING,
        });

        // Create and send notification to secretaries
        const staffNotification = createNotification(
            "New Barangay Indigency Request",
            `${name} has requested a barangay indigency for ${purpose}`,
            "request",
            savedIndigency._id,
            "BarangayIndigency"
        );

        // Send notification to secretaries of the user's barangay
        await sendNotificationToBarangaySecretaries(barangay, staffNotification);

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

        // Validate status using shared STATUS_TYPES
        if (!Object.values(STATUS_TYPES).includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const barangayIndigency = await BarangayIndigency.findOne({
            _id: id,
            barangay,
        });

        if (!barangayIndigency) {
            return res.status(404).json({
                success: false,
                message: "Barangay Indigency not found",
            });
        }

        // Update document fields
        barangayIndigency.isVerified = [
            STATUS_TYPES.APPROVED,
            STATUS_TYPES.FOR_PICKUP,
            STATUS_TYPES.COMPLETED,
        ].includes(status);

        barangayIndigency.status = status;

        // Handle dates based on status
        const currentDate = new Date();
        switch (status) {
            case STATUS_TYPES.APPROVED:
                if (!barangayIndigency.dateApproved) {
                    barangayIndigency.dateApproved = currentDate;
                }
                break;
            case STATUS_TYPES.FOR_PICKUP:
                if (!barangayIndigency.dateApproved) {
                    barangayIndigency.dateApproved = currentDate;
                }
                break;
            case STATUS_TYPES.COMPLETED:
                barangayIndigency.dateCompleted = currentDate;
                if (!barangayIndigency.dateApproved) {
                    barangayIndigency.dateApproved = currentDate;
                }
                break;
        }

        await barangayIndigency.save();

        // Create status update notification
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

export const printBarangayIndigency = async (req, res) => {
    try {
        const { id } = req.params;
        const { barangay } = req.user;

        const indigency = await BarangayIndigency.findOne({
            _id: id,
            barangay,
        }).populate("userId", "firstName middleName lastName");

        if (!indigency) {
            return res.status(404).json({
                success: false,
                message: "Barangay Indigency document not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...indigency.toObject(),
                dateIssued: indigency.dateApproved || indigency.createdAt,
                type: "Barangay Indigency",
            },
        });
    } catch (error) {
        console.error("Error fetching indigency document:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching indigency document",
        });
    }
};
