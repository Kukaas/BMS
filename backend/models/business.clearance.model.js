import mongoose from "mongoose";

const STATUS_TYPES = {
    PENDING: "Pending",
    APPROVED: "Approved",
    FOR_PICKUP: "For Pickup",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
};

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
        municipality: {
            type: String,
            required: true,
        },
        province: {
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
            enum: Object.values(STATUS_TYPES),
            default: STATUS_TYPES.PENDING,
        },
        dateApproved: {
            type: Date,
            default: null,
        },
        dateCompleted: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        dateOfIssuance: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const BusinessClearance = mongoose.model("BusinessClearance", businessClearanceSchema);

export { STATUS_TYPES };
export default BusinessClearance;
