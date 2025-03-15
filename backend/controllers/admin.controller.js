import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/emails.js";

// Function to generate secure random password
const generateSecurePassword = () => {
    const length = 15;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

export const createSecretaryAccount = async (req, res, next) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !barangay ||
            !purok
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields!",
            });
        }

        // Check if user email already exists
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        const generatedPassword = generateSecurePassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        const newUser = new User({
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
            password: hashedPassword,
            role: "secretary",
            isVerified: false,
            isActive: true,
        });

        const savedUser = await newUser.save();

        // Send verification email with password
        await sendVerificationEmail(savedUser, res, generatedPassword);

        return res.status(201).json({
            success: true,
            message: "Secretary account created successfully! Please check email for verification.",
            data: savedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const createCaptainAccount = async (req, res, next) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !barangay ||
            !purok
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields!",
            });
        }

        // Check if user email already exists
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        const generatedPassword = generateSecurePassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        const newUser = new User({
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
            password: hashedPassword,
            role: "chairman",
            isVerified: false,
            isActive: true,
        });

        const savedUser = await newUser.save();

        // Send verification email with password
        await sendVerificationEmail(savedUser, res, generatedPassword);

        return res.status(201).json({
            success: true,
            message: "Chairman account created successfully! Please check email for verification.",
            data: savedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const createSuperAdminAccount = async (req, res, next) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !barangay ||
            !purok
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields!",
            });
        }

        // Check if user email already exists
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        const generatedPassword = generateSecurePassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        const newUser = new User({
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            barangay,
            purok,
            password: hashedPassword,
            role: "superAdmin",
            isVerified: false,
            isActive: true,
        });

        const savedUser = await newUser.save();

        // Send verification email with password
        await sendVerificationEmail(savedUser, res, generatedPassword);

        return res.status(201).json({
            success: true,
            message:
                "Super Admin account created successfully! Please check email for verification.",
            data: savedUser,
        });
    } catch (error) {
        next(error);
    }
};
