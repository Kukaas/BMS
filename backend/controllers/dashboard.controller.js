import Users from "../models/user.model.js";
import BlotterReport from "../models/blotter.report.model.js";
import IncidentReport from "../models/incident.report.model.js";
import BarangayClearance from "../models/barangay.clearance.model.js";
import BusinessClearance from "../models/business.clearance.model.js";
import BarangayIndigency from "../models/barangay.indigency.model.js";
import Cedula from "../models/cedula.model.js";

export const getAllUsersByBarangay = async (req, res) => {
    try {
        const { barangay } = req.params;

        // Make sure barangay exists
        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay ID is required",
            });
        }

        // Remove the role filter to get all users
        const users = await Users.find({ barangay });

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

export const getTotalReportsByBarangay = async (req, res) => {
    try {
        const { barangay } = req.params;

        // Validate barangay
        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay ID is required",
            });
        }

        // Get total reports for each report type
        const blotterReports = await BlotterReport.countDocuments({ barangay });
        const incidentReports = await IncidentReport.countDocuments({ barangay });

        // Calculate total reports
        const totalReports = blotterReports + incidentReports;

        // Log for debugging
        console.log(`Barangay ${barangay} reports:`, {
            blotterReports,
            incidentReports,
            totalReports,
        });

        res.status(200).json({
            success: true,
            message: "Total reports fetched successfully",
            totalReports,
            breakdown: {
                blotterReports,
                incidentReports,
            },
        });
    } catch (error) {
        console.error("Error fetching total reports:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total reports",
            error: error.message,
        });
    }
};

export const getAllRequestsByBarangay = async (req, res) => {
    try {
        const { barangay } = req.params;

        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay ID is required",
            });
        }

        const barangayClearance = await BarangayClearance.find({ barangay });
        const businessClearance = await BusinessClearance.find({ barangay });
        const cedula = await Cedula.find({ barangay });

        const totalRequests = barangayClearance.length + businessClearance.length + cedula.length;

        res.status(200).json({
            success: true,
            message: "Total requests fetched successfully",
            totalRequests,
            breakdown: {
                barangayClearance,
                businessClearance,
                cedula,
            },
        });
    } catch (error) {
        console.error("Error fetching total requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total requests",
            error: error.message,
        });
    }
};

export const getPendingRequestsByBarangay = async (req, res) => {
    try {
        const { barangay } = req.params;

        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay ID is required",
            });
        }

        const barangayClearance = await BarangayClearance.find({ barangay, status: "Pending" });
        const businessClearance = await BusinessClearance.find({ barangay, status: "Pending" });
        const cedula = await Cedula.find({ barangay, status: "Pending" });

        const totalPendingRequests =
            barangayClearance.length + businessClearance.length + cedula.length;

        res.status(200).json({
            success: true,
            message: "Pending requests fetched successfully",
            totalPendingRequests,
            breakdown: {
                barangayClearance,
                businessClearance,
                cedula,
            },
        });
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pending requests",
            error: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

export const getTotalReports = async (req, res) => {
    try {
        const blotterReports = await BlotterReport.countDocuments();
        const incidentReports = await IncidentReport.countDocuments();

        const totalReports = blotterReports + incidentReports;

        res.status(200).json({
            success: true,
            message: "Total reports fetched successfully",
            totalReports,
            breakdown: {
                blotterReports,
                incidentReports,
            },
        });
    } catch (error) {
        console.error("Error fetching total reports:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total reports",
            error: error.message,
        });
    }
};

export const getTotalRequests = async (req, res) => {
    try {
        const barangayClearance = await BarangayClearance.countDocuments();
        const businessClearance = await BusinessClearance.countDocuments();
        const cedula = await Cedula.countDocuments();

        const totalRequests = barangayClearance + businessClearance + cedula;

        res.status(200).json({
            success: true,
            message: "Total requests fetched successfully",
            totalRequests,
            breakdown: {
                barangayClearance,
                businessClearance,
                cedula,
            },
        });
    } catch (error) {
        console.error("Error fetching total requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total requests",
            error: error.message,
        });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const barangayClearance = await BarangayClearance.countDocuments({ status: "Pending" });
        const businessClearance = await BusinessClearance.countDocuments({ status: "Pending" });
        const cedula = await Cedula.countDocuments({ status: "Pending" });

        const totalPendingRequests = barangayClearance + businessClearance + cedula;

        res.status(200).json({
            success: true,
            message: "Pending requests fetched successfully",
            totalPendingRequests,
            breakdown: {
                barangayClearance,
                businessClearance,
                cedula,
            },
        });
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pending requests",
            error: error.message,
        });
    }
};

export const getUserTotalReports = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const blotterReports = await BlotterReport.countDocuments({ userId });
        const incidentReports = await IncidentReport.countDocuments({ userId });

        const totalReports = blotterReports + incidentReports;

        res.status(200).json({
            success: true,
            message: "Total reports fetched successfully",
            totalReports,
        });
    } catch (error) {
        console.error("Error fetching total reports:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total reports",
            error: error.message,
        });
    }
};

export const getUserTotalRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const barangayClearance = await BarangayClearance.countDocuments({ userId });
        const businessClearance = await BusinessClearance.countDocuments({ userId });
        const barangayIndigency = await BarangayIndigency.countDocuments({ userId });
        const cedula = await Cedula.countDocuments({ userId });

        const totalRequests = barangayClearance + businessClearance + cedula + barangayIndigency;

        res.status(200).json({
            success: true,
            message: "Total requests fetched successfully",
            totalRequests,
        });
    } catch (error) {
        console.error("Error fetching total requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching total requests",
            error: error.message,
        });
    }
};

export const getUserPendingRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const barangayClearance = await BarangayClearance.countDocuments({
            userId,
            status: "Pending",
        });
        const businessClearance = await BusinessClearance.countDocuments({
            userId,
            status: "Pending",
        });
        const cedula = await Cedula.countDocuments({ userId, status: "Pending" });

        const totalPendingRequests = barangayClearance + businessClearance + cedula;

        res.status(200).json({
            success: true,
            message: "Pending requests fetched successfully",
            totalPendingRequests,
        });
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pending requests",
            error: error.message,
        });
    }
};
