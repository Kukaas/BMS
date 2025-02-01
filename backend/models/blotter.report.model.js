import mongoose from "mongoose";

const blotterReportSchema = new mongoose.Schema(
    {
        // Complainant Information
        complainantName: { type: String, required: true },
        complainantAge: { type: String, required: true },
        complainantGender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        complainantCivilStatus: {
            type: String,
            required: true,
            enum: ["Single", "Married", "Widowed", "Separated"],
        },
        complainantAddress: { type: String, required: true },
        complainantContact: { type: String, required: true },

        // Respondent Information
        respondentName: { type: String, required: true },
        respondentAddress: { type: String },
        respondentContact: { type: String },

        // Incident Details
        incidentDate: { type: Date, required: true },
        incidentTime: { type: String, required: true },
        incidentLocation: { type: String, required: true },
        incidentType: { type: String, required: true },
        narrative: { type: String, required: true },
        motive: { type: String },

        // Witnesses
        witnessName: { type: String },
        witnessContact: { type: String },

        // Evidence
        evidenceFiles: [
            {
                filename: String,
                contentType: String,
                data: Buffer,
            },
        ],

        // Action Requested
        actionRequested: {
            type: String,
            required: true,
            enum: ["Mediation", "Barangay Intervention", "Police/Court Action"],
        },

        // Status
        status: {
            type: String,
            enum: ["Pending", "Under Investigation", "Resolved", "Closed"],
            default: "Pending",
        },

        // Reference to user who created the report
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true }
);

const BlotterReport = mongoose.model("BlotterReport", blotterReportSchema);
export default BlotterReport;
