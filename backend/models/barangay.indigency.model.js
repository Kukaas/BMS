import mongoose from "mongoose";

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
        email: {
            type: String,
            required: true,
        },
        barangay: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
            required: true,
        },
        dateOfIssuance: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "For Pickup", "Completed", "Rejected"],
            default: "Pending",
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

export default BarangayIndigency;
