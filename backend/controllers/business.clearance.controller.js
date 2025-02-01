import BusinessClearance from "../models/business.clearance.model.js";

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
        await businessClearance.save();

        res.status(200).json({
            success: true,
            message: "Business clearance status updated successfully",
            data: businessClearance,
        });
    } catch (error) {
        next(error);
    }
};
