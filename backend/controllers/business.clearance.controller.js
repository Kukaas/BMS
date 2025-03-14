import BusinessClearance from "../models/business.clearance.model.js";
import {
    createNotification,
    sendNotificationToBarangaySecretaries,
} from "../utils/notifications.js";
import User from "../models/user.model.js";
import { createLog } from "./log.controller.js";
import { createTransactionHistory } from "./transaction.history.controller.js";
import { STATUS_TYPES } from "../models/business.clearance.model.js";

export const createBusinessClearance = async (req, res, next) => {
    try {
        const {
            userId,
            ownerName,
            businessName,
            barangay,
            municipality,
            province,
            businessType,
            businessNature,
            ownerAddress,
            contactNumber,
            email,
            dtiSecRegistration,
            mayorsPermit,
            leaseContract,
            barangayClearance,
            fireSafetyCertificate,
            sanitaryPermit,
            validId,
        } = req.body;

        // Validate required fields
        if (
            !ownerName ||
            !businessName ||
            !barangay ||
            !municipality ||
            !province ||
            !businessType ||
            !businessNature ||
            !ownerAddress ||
            !contactNumber ||
            !email ||
            !dtiSecRegistration ||
            !barangayClearance ||
            !validId
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const businessClearance = new BusinessClearance({
            userId,
            ownerName,
            businessName,
            barangay,
            municipality,
            province,
            businessType,
            businessNature,
            ownerAddress,
            contactNumber,
            email,
            dtiSecRegistration,
            mayorsPermit,
            leaseContract,
            barangayClearance,
            fireSafetyCertificate,
            sanitaryPermit,
            validId,
        });

        await createLog(
            userId,
            "Business Clearance Request",
            "Business Clearance",
            `${ownerName} has requested a business clearance for ${businessName}`
        );

        const savedClearance = await businessClearance.save();

        // Create transaction history
        await createTransactionHistory({
            userId,
            transactionId: savedClearance._id,
            residentName: ownerName,
            requestedDocument: "Business Clearance",
            dateRequested: new Date(),
            barangay,
            action: "created",
            status: STATUS_TYPES.PENDING,
        });

        // Create and send notification to secretaries
        const staffNotification = createNotification(
            "New Business Clearance Request",
            `${ownerName} has requested a business clearance for ${businessName}`,
            "request",
            savedClearance._id,
            "BusinessClearance"
        );

        await sendNotificationToBarangaySecretaries(barangay, staffNotification);

        res.status(201).json({
            success: true,
            message: "Business clearance request created successfully",
            data: savedClearance,
        });
    } catch (error) {
        console.error("Error creating business clearance:", error);
        res.status(500).json({ message: "Error creating business clearance" });
    }
};

export const getUserBusinessClearances = async (req, res, next) => {
    try {
        const businessClearances = await BusinessClearance.find({ userId: req.user.id });
        res.status(200).json({
            success: true,
            data: businessClearances,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBusinessClearances = async (req, res, next) => {
    try {
        const businessClearances = await BusinessClearance.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: businessClearances,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBusinessClearanceStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { name: secretaryName, barangay } = req.user;

        // Validate user role
        if (!["secretary", "chairman"].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to verify business clearance requests",
            });
        }

        const businessClearance = await BusinessClearance.findOne({
            _id: id,
            barangay,
        });

        if (!businessClearance) {
            return res.status(404).json({
                success: false,
                message: "Business clearance not found",
            });
        }

        const currentDate = new Date();

        // Update status-related fields
        businessClearance.status = status;
        businessClearance.isVerified = [
            STATUS_TYPES.APPROVED,
            STATUS_TYPES.FOR_PICKUP,
            STATUS_TYPES.COMPLETED,
        ].includes(status);

        // Update date fields based on status
        if (status === STATUS_TYPES.APPROVED) {
            businessClearance.dateApproved = currentDate;
            businessClearance.dateOfIssuance = currentDate;
        } else if (status === STATUS_TYPES.COMPLETED) {
            businessClearance.dateCompleted = currentDate;
        }

        await businessClearance.save();

        // Notify the requestor
        const user = await User.findById(businessClearance.userId);
        if (user) {
            const notification = createNotification(
                "Business Clearance Status Update",
                `Your business clearance request has been ${status.toLowerCase()} by ${secretaryName}`,
                "status_update",
                businessClearance._id,
                "BusinessClearance"
            );

            user.notifications.push(notification);
            user.unreadNotifications += 1;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: `Business clearance ${status.toLowerCase()} successfully`,
            data: businessClearance,
        });
    } catch (error) {
        console.error("Error updating business clearance:", error);
        next(error);
    }
};
