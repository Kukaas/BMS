import IncidentReport from "../models/incident.report.model.js";

export const createIncidentReport = async (req, res, next) => {
    try {
        const {
            category,
            subCategory,
            date,
            time,
            location,
            description,
            reporterName,
            reporterContact,
        } = req.body;

        // Create new incident report
        const incidentReport = new IncidentReport({
            category,
            subCategory,
            date,
            time,
            location,
            description,
            reporterName,
            reporterContact,
            barangay: req.user.barangay,
        });

        await incidentReport.save();

        res.status(201).json({
            success: true,
            message: "Incident report submitted successfully",
            data: incidentReport,
        });
    } catch (error) {
        console.error("Error creating incident report:", error);
        next(error);
    }
};

export const getAllIncidentReports = async (req, res, next) => {
    try {
        const { barangay } = req.user;

        const reports = await IncidentReport.find({ barangay }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        next(error);
    }
};

export const getIncidentReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { barangay } = req.user;

        const report = await IncidentReport.findOne({
            _id: id,
            barangay,
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incident report not found",
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

export const updateIncidentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { barangay } = req.user;

        // Validate status
        const validStatuses = ["New", "In Progress", "Resolved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const report = await IncidentReport.findOneAndUpdate(
            { _id: id, barangay },
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incident report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Incident status updated successfully",
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteIncidentReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { barangay } = req.user;

        const report = await IncidentReport.findOneAndDelete({ _id: id, barangay });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incident report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Incident report deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Add a function to get evidence file by ID
export const getEvidence = async (req, res, next) => {
    try {
        const { id, fileIndex } = req.params;
        const { barangay } = req.user;

        const report = await IncidentReport.findOne({
            _id: id,
            barangay,
        });

        if (!report || !report.evidence[fileIndex]) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        const file = report.evidence[fileIndex];

        // Send base64 image with proper content type
        res.set({
            "Content-Type": file.contentType,
            "Cache-Control": "no-cache", // Disable caching for debugging
        });

        try {
            const imageBuffer = Buffer.from(file.data, "base64");
            res.send(imageBuffer);
        } catch (error) {
            console.error("Error converting base64 to buffer:", error);
            res.status(500).json({
                success: false,
                message: "Error processing image",
            });
        }
    } catch (error) {
        console.error("Error getting evidence:", error);
        next(error);
    }
};
