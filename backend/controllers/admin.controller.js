import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/emails.js";

export const createSecretaryAccount = async (req, res, next) => {
    try {
        const { name, email, password, barangay } = req.body;

        if (!name || !email || !password || !barangay) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields!",
            });
        }

        // Check if user email already exists
        const emailExist = await User.findOne({
            email,
        });

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        // Check if user name already exists
        const nameExist = await User.findOne({
            name,
        });

        if (nameExist) {
            return res.status(401).json({
                success: false,
                message: "Name already exists!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            barangay,
            password: hashedPassword,
            role: "secretary",
        });

        await newUser.save().then((result) => {
            sendVerificationEmail(result, res);
        });
    } catch (error) {
        next(error);
    }
};

export const createCaptainAccount = async (req, res, next) => {
    try {
        const { name, email, password, barangay } = req.body;

        if (!name || !email || !password || !barangay) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields!",
            });
        }

        // Check if user email already exists
        const emailExist = await User.findOne({
            email,
        });

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!",
            });
        }

        // Check if user name already exists
        const nameExist = await User.findOne({
            name,
        });

        if (nameExist) {
            return res.status(401).json({
                success: false,
                message: "Name already exists!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            barangay,
            password: hashedPassword,
            role: "chairman",
        });

        await newUser.save().then((result) => {
            sendVerificationEmail(result, res);
        });
    } catch (error) {
        next(error);
    }
};
