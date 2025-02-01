import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import UserVerification from "../models/user.verification.model.js";

export const sendVerificationEmail = async (user, res) => {
    const userId = user._id;
    const uniqueString = crypto.randomBytes(15).toString("hex");
    const hashedString = await bcrypt.hash(uniqueString, 10);

    const verification = new UserVerification({
        userId,
        uniqueString: hashedString,
        createdAt: new Date(),
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    try {
        const savedVerification = await verification.save();
        const url = `http://localhost:5000/api/auth/verify/${uniqueString}/${userId}`;

        const mailOptions = {
            from: {
                name: "GASAN BMS",
                address: process.env.AUTH_EMAIL,
            },
            to: user.email,
            subject: "Account Verification - GASAN BMS",
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #166534; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">GASAN BMS</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb;">
                        <h2 style="color: #166534; margin-bottom: 20px;">Email Verification</h2>
                        <p>Hello ${user.name},</p>
                        <p>Thank you for registering on our Barangay Management System. Please verify your account to continue:</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${url}" 
                               style="display: inline-block; background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Verify Your Account
                            </a>
                        </div>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                            <p style="margin: 0; color: #475569; font-size: 14px;">
                                This verification link will expire in 24 hours. If you did not register on our website, 
                                please ignore this email or contact your barangay office immediately.
                            </p>
                        </div>
                        <p style="margin-top: 30px;">Best regards,<br>GASAN BMS Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            `,
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            },
        });

        await transporter.sendMail(mailOptions);
        return res.status(201).json({ message: "Verification email sent successfully." });
    } catch (error) {
        console.error("Error sending verification email:", error);
        try {
            await UserVerification.deleteOne({ userId, uniqueString: hashedString });
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
        return res.status(500).json({ message: "Failed to send verification email." });
    }
};

export const sendOTPVerificationEmail = async (user, otp, res, token) => {
    try {
        const mailOptions = {
            from: {
                name: "GASAN BMS",
                address: process.env.AUTH_EMAIL,
            },
            to: user.email,
            subject: "Password Reset OTP - GASAN BMS",
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #166534; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">GASAN BMS</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb;">
                        <h2 style="color: #166534; margin-bottom: 20px;">Password Reset OTP</h2>
                        <p>Hello ${user.name},</p>
                        <p>Your One-Time Password (OTP) for password reset is:</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; display: inline-block; min-width: 150px;">
                                ${otp}
                            </div>
                        </div>
                        <div style="margin: 30px 0; padding: 20px; background-color: #fee2e2; border-radius: 8px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                This OTP will expire in 5 minutes.
                            </p>
                        </div>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                            <p style="margin: 0; color: #475569; font-size: 14px;">
                                If you did not request this OTP, please ignore this email or contact your barangay office immediately.
                            </p>
                        </div>
                        <p style="margin-top: 30px;">Best regards,<br>GASAN BMS Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            `,
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            },
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ message: "An error occurred while sending email" });
            } else {
                res.status(200).json({ message: "OTP sent successfully", token });
            }
        });
    } catch (error) {
        console.error("Error sending OTP verification email:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

export const sendVerificationConfirmationEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: "GASAN BMS",
                address: process.env.AUTH_EMAIL,
            },
            to: user.email,
            subject: "Account Verified - GASAN BMS",
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #166534; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">GASAN BMS</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb;">
                        <h2 style="color: #166534; margin-bottom: 20px;">Account Verified Successfully!</h2>
                        <p>Dear ${user.name},</p>
                        <p>Your account has been successfully verified by the barangay administrator. You now have full access to all features of the Barangay Management System.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${process.env.CLIENT_URL}/sign-in" 
                               style="display: inline-block; background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Login to Your Account
                            </a>
                        </div>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                            <p style="margin: 0; color: #475569; font-size: 14px;">
                                If you have any questions or concerns, please don't hesitate to contact your barangay office.
                            </p>
                        </div>
                        <p style="margin-top: 30px;">Best regards,<br>GASAN BMS Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            `,
        };

        await transporter.verify();
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
};

export const sendDeactivationEmail = async (user, reason) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: "GASAN BMS",
                address: process.env.AUTH_EMAIL,
            },
            to: user.email,
            subject: "Account Deactivated - GASAN BMS",
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #991b1b; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">GASAN BMS</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb;">
                        <h2>Account Deactivated</h2>
                        <p>Dear ${user.name},</p>
                        <p>Your account has been deactivated by the barangay administrator.</p>
                        <p><strong>Reason for deactivation:</strong></p>
                        <p style="padding: 10px; background-color: #fee2e2; border-radius: 4px;">${reason}</p>
                        <p>If you believe this is a mistake or would like to reactivate your account, please contact your barangay office.</p>
                        <p>Best regards,<br>GASAN BMS Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            `,
        };

        await transporter.verify();
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
};

export const sendActivationEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: "GASAN BMS",
                address: process.env.AUTH_EMAIL,
            },
            to: user.email,
            subject: "Account Activated - GASAN BMS",
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #166534; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">GASAN BMS</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb;">
                        <h2>Account Activated Successfully!</h2>
                        <p>Dear ${user.name},</p>
                        <p>Your account has been reactivated by the barangay administrator. You can now log in to your account.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${process.env.CLIENT_URL}/sign-in" 
                               style="background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                                Login to Your Account
                            </a>
                        </div>
                        <p>Best regards,<br>GASAN BMS Team</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            `,
        };

        await transporter.verify();
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
};
