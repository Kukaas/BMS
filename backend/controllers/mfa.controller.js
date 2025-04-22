import OTPVerification from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendMFACode } from "../utils/emails.js";

// Enable MFA for a user
export const enableMFA = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate and send verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP
        await OTPVerification.deleteMany({ userId: user._id }); // Clear any existing codes
        const newOTP = new OTPVerification({
            userId: user._id,
            otp: verificationCode,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + 5 * 60000), // 5 minutes expiry
        });
        await newOTP.save();

        // Send email with code
        const emailSent = await sendMFACode(user, verificationCode);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification code",
            });
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });
    } catch (error) {
        console.error("MFA Enable Error:", error);
        res.status(500).json({
            success: false,
            message: "Error enabling MFA",
        });
    }
};

// Verify MFA code and complete setup
export const verifyAndEnableMFA = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        const otpVerification = await OTPVerification.findOne({ userId });
        if (!otpVerification) {
            return res.status(400).json({
                success: false,
                message: "No verification code found or code has expired",
            });
        }

        if (otpVerification.otp !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
        }

        if (otpVerification.expiresAt < new Date()) {
            await OTPVerification.deleteOne({ userId });
            return res.status(400).json({
                success: false,
                message: "Verification code has expired",
            });
        }

        // Enable MFA for the user
        await User.findByIdAndUpdate(userId, {
            mfaEnabled: true,
            mfaSecret: Math.random().toString(36).substring(2, 15),
        });

        // Clean up used OTP
        await OTPVerification.deleteOne({ userId });

        res.status(200).json({
            success: true,
            message: "MFA enabled successfully",
        });
    } catch (error) {
        console.error("MFA Verification Error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying MFA code",
        });
    }
};

// Initiate MFA disable process by sending verification code
export const initiateDisableMFA = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate and send verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP
        await OTPVerification.deleteMany({ userId: user._id }); // Clear any existing codes
        const newOTP = new OTPVerification({
            userId: user._id,
            otp: verificationCode,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + 5 * 60000), // 5 minutes expiry
        });
        await newOTP.save();

        // Send email with code
        const emailSent = await sendMFACode(user, verificationCode);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification code",
            });
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });
    } catch (error) {
        console.error("MFA Disable Initiation Error:", error);
        res.status(500).json({
            success: false,
            message: "Error initiating MFA disable process",
        });
    }
};

// Disable MFA for a user after verification
export const disableMFA = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify the code
        const otpVerification = await OTPVerification.findOne({ userId });
        if (!otpVerification) {
            return res.status(400).json({
                success: false,
                message: "No verification code found or code has expired",
            });
        }

        if (otpVerification.otp !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
        }

        if (otpVerification.expiresAt < new Date()) {
            await OTPVerification.deleteOne({ userId });
            return res.status(400).json({
                success: false,
                message: "Verification code has expired",
            });
        }

        // Clean up used OTP
        await OTPVerification.deleteOne({ userId });

        // Disable MFA
        user.mfaEnabled = false;
        user.mfaSecret = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "MFA disabled successfully",
        });
    } catch (error) {
        console.error("MFA Disable Error:", error);
        res.status(500).json({
            success: false,
            message: "Error disabling MFA",
        });
    }
};

// Send MFA code for login
export const sendLoginMFACode = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user || !user.mfaEnabled) {
            return res.status(400).json({
                success: false,
                message: "Invalid request or MFA not enabled",
            });
        }

        // Generate and send verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP
        await OTPVerification.deleteMany({ userId: user._id });
        const newOTP = new OTPVerification({
            userId: user._id,
            otp: verificationCode,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + 5 * 60000),
        });
        await newOTP.save();

        // Send email with code
        const emailSent = await sendMFACode(user, verificationCode);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification code",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login verification code sent successfully",
        });
    } catch (error) {
        console.error("Login MFA Error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending login verification code",
        });
    }
};
