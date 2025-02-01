import mongoose from "mongoose";

const businessClearanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        barangay: {
            type: String,
            required: true,
        },
        businessType: {
            type: String,
            required: true,
        },
        businessNature: {
            type: String,
            enum: ["Single Proprietorship", "Partnership", "Corporation"],
            required: true,
        },
        ownerAddress: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dtiSecRegistration: {
            type: String,
            required: true,
        },
        mayorsPermit: String,
        leaseContract: String,
        barangayClearance: {
            type: String,
            required: true,
        },
        fireSafetyCertificate: String,
        sanitaryPermit: String,
        validId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

// Create and export the model in one line with default export
export default mongoose.model("BusinessClearance", businessClearanceSchema);
