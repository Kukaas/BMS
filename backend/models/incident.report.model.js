import mongoose from "mongoose";

const incidentReportSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        subCategory: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 10,
        },
        reporterName: {
            type: String,
            required: true,
        },
        reporterContact: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["New", "In Progress", "Resolved"],
            default: "New",
        },
        barangay: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        evidenceFile: {
            filename: String,
            contentType: String,
            data: String, // Store base64 data URL
        },
    },
    { timestamps: true }
);

const IncidentReport = mongoose.model("IncidentReport", incidentReportSchema);

export default IncidentReport;
