import Cedula from "../models/cedula.model.js";
import { createNotification } from "../utils/notifications.js";
import User from "../models/user.model.js";
import { createLog } from "./log.controller.js";

export const createCedula = async (req, res, next) => {
    try {
        const newCedula = new Cedula({
            ...req.body,
            userId: req.user.id,
            status: "Pending",
        });

        await createLog(
            req.user.id,
            "Cedula Request",
            "Cedula",
            `${req.body.name} has requested a cedula`
        );

        await newCedula.save();

        // Create notifications for both user and staff
        const userNotification = createNotification(
            "Cedula Request Created",
            "Your cedula request has been submitted successfully.",
            "request",
            newCedula._id,
            "Cedula"
        );

        const staffNotification = createNotification(
            "New Cedula Request",
            `A new cedula request has been submitted by ${req.body.name}.`,
            "request",
            newCedula._id,
            "Cedula"
        );

        // Update user's notifications
        await User.findByIdAndUpdate(req.user.id, {
            $push: { notifications: userNotification },
            $inc: { unreadNotifications: 1 },
        });

        // Notify barangay staff
        const barangayStaff = await User.find({
            barangay: req.user.barangay,
            role: { $in: ["secretary", "chairman"] },
        });

        for (const staff of barangayStaff) {
            staff.notifications.push(staffNotification);
            staff.unreadNotifications += 1;
            await staff.save();
        }

        res.status(201).json({
            success: true,
            message: "Cedula request created successfully",
            data: newCedula,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserCedulas = async (req, res, next) => {
    try {
        const cedulas = await Cedula.find({ userId: req.user.id });
        res.status(200).json({
            success: true,
            data: cedulas,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCedulas = async (req, res, next) => {
    try {
        const cedulas = await Cedula.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: cedulas,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCedulaStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const { name: secretaryName } = req.user;

    try {
        // Validate status
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const cedula = await Cedula.findById(id);
        if (!cedula) {
            return res.status(404).json({
                success: false,
                message: "Cedula request not found"
            });
        }

        cedula.status = status;
        cedula.isVerified = status === "Approved";
        if (status === "Approved") {
            cedula.dateOfIssuance = new Date();
        }

        await cedula.save();

        // Create status update notification with secretary info
        const statusNotification = createNotification(
            "Cedula Request Status Update",
            `Your cedula request has been ${status.toLowerCase()} by ${secretaryName}.`,
            "status_update",
            cedula._id,
            "Cedula"
        );

        // Update requestor's notifications
        if (cedula.userId) {
            await User.findByIdAndUpdate(cedula.userId, {
                $push: { notifications: statusNotification },
                $inc: { unreadNotifications: 1 }
            });
        }

        res.status(200).json({
            success: true,
            message: "Cedula status updated successfully",
            data: cedula,
        });
    } catch (error) {
        next(error);
    }
};
