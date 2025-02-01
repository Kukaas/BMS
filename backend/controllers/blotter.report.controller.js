import BlotterReport from "../models/blotter.report.model.js";

// Create a new blotter report
export const createBlotterReport = async (req, res, next) => {
    try {
        const { evidence, ...otherData } = req.body;

        // Process evidence files in chunks if they exist
        let evidenceFiles = [];
        if (evidence && Array.isArray(evidence)) {
            evidenceFiles = evidence.map((file) => ({
                filename: file.filename,
                contentType: file.contentType,
                data: Buffer.from(file.data, "base64"),
            }));
        }

        // Create report object with all required fields
        const blotterReport = new BlotterReport({
            ...otherData,
            evidenceFiles,
            // Ensure date is properly formatted
            incidentDate: new Date(otherData.incidentDate),
        });

        // Set timeout for the save operation
        const saveTimeout = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Save operation timed out"));
            }, 30000); // 30 second timeout
        });

        // Save with timeout
        const savedReport = await Promise.race([blotterReport.save(), saveTimeout]);

        res.status(201).json({
            message: "Blotter report created successfully",
            report: savedReport,
        });
    } catch (error) {
        console.error("Error creating blotter report:", error);
        // Send a more detailed error message to the client
        res.status(500).json({
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

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Only allow updates if user is admin or report owner
        if (req.user.role !== "admin" && report.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own reports" });
        }

        const updatedReport = await BlotterReport.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

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
