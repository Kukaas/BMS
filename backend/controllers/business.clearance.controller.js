import BusinessClearance from "../models/business.clearance.model.js";
import { createNotification } from "../utils/notifications.js";
import User from "../models/user.model.js";

export const createBusinessClearance = async (req, res, next) => {
    try {
        const {
            ownerName,
            businessName,
            barangay,
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

        const businessClearanceRequest = new BusinessClearance({
            userId: req.user.id,
            ownerName,
            businessName,
            barangay,
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

        await businessClearanceRequest.save();

        // Create notifications
        const userNotification = createNotification(
            "Business Clearance Request Created",
            `Your business clearance request for ${businessName} has been submitted successfully.`,
            "request",
            businessClearanceRequest._id,
            "BusinessClearance"
        );

        const staffNotification = createNotification(
            "New Business Clearance Request",
            `A new business clearance request has been submitted by ${ownerName} for ${businessName}.`,
            "request",
            businessClearanceRequest._id,
            "BusinessClearance"
        );

        // Update user's notifications
        await User.findByIdAndUpdate(req.user.id, {
            $push: { notifications: userNotification },
            $inc: { unreadNotifications: 1 }
        });

        // Notify barangay staff
        const barangayStaff = await User.find({
            barangay,
            role: { $in: ["secretary", "chairman"] }
        });

        for (const staff of barangayStaff) {
            staff.notifications.push(staffNotification);
            staff.unreadNotifications += 1;
            await staff.save();
        }

        res.status(201).json({
            success: true,
            message: "Business clearance request submitted successfully",
            data: businessClearanceRequest,
        });
    } catch (error) {
        next(error);
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
        const { name: secretaryName } = req.user;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const businessClearance = await BusinessClearance.findById(id);

        if (!businessClearance) {
            return res.status(404).json({
                success: false,
                message: "Business clearance request not found",
            });
        }

        businessClearance.status = status;
        businessClearance.isVerified = status === "Approved";
        await businessClearance.save();

        // Create status update notification with secretary info
        const statusNotification = createNotification(
            "Business Clearance Status Update",
            `Your business clearance request for ${businessClearance.businessName} has been ${status.toLowerCase()} by ${secretaryName}`,
            "status_update",
            businessClearance._id,
            "BusinessClearance"
        );

        // Update requestor's notifications
        if (businessClearance.userId) {
            await User.findByIdAndUpdate(businessClearance.userId, {
                $push: { notifications: statusNotification },
                $inc: { unreadNotifications: 1 }
            });
        }

        res.status(200).json({
            success: true,
            message: "Business clearance status updated successfully",
            data: businessClearance,
        });
    } catch (error) {
        next(error);
    }
};
