import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/emails.js";

export const createSecretaryAccount = async (req, res, next) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            contactNumber,
            dateOfBirth,
            email,
            password,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !password ||
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            isVerified: true, // Auto-verify admin accounts
            isActive: true,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: "Secretary account created successfully!",
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
            password,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !password ||
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            isVerified: true, // Auto-verify admin accounts
            isActive: true,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: "Chairman account created successfully!",
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
            password,
            barangay,
            purok,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !contactNumber ||
            !dateOfBirth ||
            !email ||
            !password ||
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            isVerified: true, // Auto-verify admin accounts
            isActive: true,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: "Super Admin account created successfully!",
            data: savedUser,
        });
    } catch (error) {
        next(error);
    }
};
