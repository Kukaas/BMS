import User from "../models/user.model.js";
import {
    sendVerificationConfirmationEmail,
    sendDeactivationEmail,
    sendActivationEmail,
} from "../utils/emails.js";

export const getUsersByBarangay = async (req, res, next) => {
    try {
        const { role, barangay } = req.user;

        // Check if user has permission to access this data
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        // Find users from the same barangay, including inactive ones
        const users = await User.find({
            barangay,
            // Exclude admin users from results
            role: { $nin: ["admin"] },
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// Get a single user by ID
export const getUserById = async (req, res, next) => {
    try {
        const { role, barangay } = req.user;
        const { userId } = req.params;

        // Check if user has permission
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        const user = await User.findOne({
            _id: userId,
            barangay, // Ensure user belongs to same barangay
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// Add this method to the existing user.controller.js
export const verifyUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role, barangay } = req.user;

        // Check if user has permission
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        const user = await User.findOne({
            _id: userId,
            barangay,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Always send verification email when requested
        try {
            const emailSent = await sendVerificationConfirmationEmail(user);

            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send verification email",
                });
            }
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Error sending verification email",
            });
        }

        // Update verification status
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const rejectUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role, barangay } = req.user;

        // Check if user has permission
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        const user = await User.findOne({
            _id: userId,
            barangay,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Set user as rejected
        user.isVerified = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User rejected successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// Add this new controller method
export const deactivateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body; // Get reason from request body
        const { role, barangay } = req.user;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Deactivation reason is required",
            });
        }

        // Check if user has permission
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        const user = await User.findOne({
            _id: userId,
            barangay,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Don't allow deactivation of admin/chairman/secretary accounts
        if (user.role === "admin" || user.role === "chairman" || user.role === "secretary") {
            return res.status(403).json({
                success: false,
                message: "Cannot deactivate admin or staff accounts",
            });
        }

        // Set user as inactive
        user.isActive = false;
        await user.save();

        // Send deactivation email
        try {
            const emailSent = await sendDeactivationEmail(user, reason);
            if (!emailSent) {
                console.log("Failed to send deactivation email");
            }
        } catch (emailError) {
            console.log("Error sending deactivation email:", emailError);
        }

        res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const activateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role, barangay } = req.user;

        // Check if user has permission
        if (role !== "secretary" && role !== "chairman") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not authorized.",
            });
        }

        const user = await User.findOne({
            _id: userId,
            barangay,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Don't allow activation of admin/chairman/secretary accounts
        if (user.role === "admin" || user.role === "chairman" || user.role === "secretary") {
            return res.status(403).json({
                success: false,
                message: "Cannot modify admin or staff accounts",
            });
        }

        // Set user as active
        user.isActive = true;
        await user.save();

        // Send activation email
        try {
            const emailSent = await sendActivationEmail(user);
            if (!emailSent) {
                console.log("Failed to send activation email");
            }
        } catch (emailError) {
            console.log("Error sending activation email:", emailError);
        }

        res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
