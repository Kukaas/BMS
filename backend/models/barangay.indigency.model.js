import mongoose from "mongoose";

const STATUS_TYPES = {
    PENDING: "Pending",
    APPROVED: "Approved",
    FOR_PICKUP: "For Pickup",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
};

const BarangayIndigencySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        barangay: {
            type: String,
            required: true,
        },
        purok: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
            required: true,
            enum: [
                "Medical Assistance",
                "Financial Assistance",
                "Food Assistance",
                "Burial Assistance",
            ],
        },
        dateOfIssuance: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
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
    },
    { timestamps: true }
);

const BarangayIndigency = mongoose.model("BarangayIndigency", BarangayIndigencySchema);

export { STATUS_TYPES };
export default BarangayIndigency;
