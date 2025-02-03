import BlotterReport from "../models/blotter.report.model.js";
import { createNotification } from "../utils/notifications.js";
import User from "../models/user.model.js";

// Create a new blotter report
export const createBlotterReport = async (req, res, next) => {
    try {
        const { evidenceFile, ...otherData } = req.body;

        // Create report object with all required fields
        const blotterReport = new BlotterReport({
            ...otherData,
            // Store the evidence file directly
            evidenceFile: evidenceFile
                ? {
                      filename: evidenceFile.filename,
                      contentType: evidenceFile.contentType,
                      data: evidenceFile.data,
                  }
                : null,
            userId: req.user.id,
            // Ensure date is properly formatted
            incidentDate: new Date(otherData.incidentDate),
        });

        // Save the report
        const savedReport = await blotterReport.save();

        // Create notifications
        const userNotification = createNotification(
            "Blotter Report Created",
            "Your blotter report has been submitted successfully.",
            "report",
            savedReport._id,
            "BlotterReport"
        );

        // Update user's notifications
        await User.findByIdAndUpdate(req.user.id, {
            $push: { notifications: userNotification },
            $inc: { unreadNotifications: 1 },
        });

        res.status(201).json({
            success: true,
            message: "Blotter report created successfully",
            report: savedReport,
        });
    } catch (error) {
        console.error("Error creating blotter report:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create blotter report",
            error: error.message,
            details: error.errors
                ? Object.keys(error.errors).map((key) => ({
                      field: key,
                      message: error.errors[key].message,
                  }))
                : null,
        });
    }
};

// Get all blotter reports
export const getAllBlotterReports = async (req, res, next) => {
    try {
        const reports = await BlotterReport.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name email");
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};

// Get a specific blotter report
export const getBlotterReport = async (req, res, next) => {
    try {
        const report = await BlotterReport.findById(req.params.id).populate("userId", "name email");

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

// Get evidence file
export const getEvidenceFile = async (req, res, next) => {
    try {
        const { reportId, fileIndex } = req.params;

        const report = await BlotterReport.findById(reportId);
        if (!report || !report.evidenceFiles[fileIndex]) {
            return res.status(404).json({ message: "File not found" });
        }

        const file = report.evidenceFiles[fileIndex];
        res.set("Content-Type", file.contentType);
        res.send(file.data);
    } catch (error) {
        next(error);
    }
};

// Update a blotter report
export const updateBlotterReport = async (req, res, next) => {
    try {
        const report = await BlotterReport.findById(req.params.id);
        const { name: secretaryName } = req.user;

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Allow updates if user is admin, secretary, chairman, or report owner
        const isAuthorized =
            req.user.role === "admin" ||
            req.user.role === "secretary" ||
            req.user.role === "chairman" ||
            report.userId.toString() === req.user.id;

        if (!isAuthorized) {
            return res
                .status(403)
                .json({ message: "You are not authorized to update this report" });
        }

        const updatedReport = await BlotterReport.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        // Create status update notification if status was changed
        if (req.body.status && req.body.status !== report.status) {
            const statusNotification = createNotification(
                "Blotter Report Status Update",
                `Your blotter report status has been updated to ${req.body.status} by ${secretaryName}.`,
                "status_update",
                report._id,
                "BlotterReport"
            );

            // Update reporter's notifications
            await User.findByIdAndUpdate(report.userId, {
                $push: { notifications: statusNotification },
                $inc: { unreadNotifications: 1 },
            });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        next(error);
    }
};

// Delete a blotter report
export const deleteBlotterReport = async (req, res, next) => {
    try {
        const report = await BlotterReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Only allow deletion if user is admin or report owner
        if (req.user.role !== "admin" && report.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own reports" });
        }

        await BlotterReport.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Report has been deleted" });
    } catch (error) {
        next(error);
    }
};

// Add this new controller function
export const getBarangayBlotterReports = async (req, res, next) => {
    try {
        // Check if user is secretary or chairman
        if (!["secretary", "chairman"].includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Only secretaries and chairmen can access barangay reports",
            });
        }

        const reports = await BlotterReport.find()
            .populate({
                path: "userId",
                match: { barangay: req.user.barangay },
                select: "name email barangay",
            })
            .sort({ createdAt: -1 });

        // Filter out reports where userId is null (meaning they don't match the barangay)
        const barangayReports = reports.filter((report) => report.userId !== null);

        res.status(200).json(barangayReports);
    } catch (error) {
        console.error("Error fetching barangay blotter reports:", error);
        res.status(500).json({
            message: "Failed to fetch barangay blotter reports",
            error: error.message,
        });
    }
};

// Get Blotter Reports
export const getBlotterReports = async (req, res) => {
    try {
        const reports = await BlotterReport.find().sort({ createdAt: -1 });

        // Make sure to include evidenceFiles in the response
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching blotter reports:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add this new controller function
export const getUserBlotterReports = async (req, res, next) => {
    try {
        // Get reports for the authenticated user
        const reports = await BlotterReport.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        console.error("Error fetching user blotter reports:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user blotter reports",
            error: error.message
        });
    }
};
