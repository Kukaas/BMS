import mongoose from "mongoose";

const barangayClearanceSchema = new mongoose.Schema(
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
        purpose: {
            type: String,
            required: true,
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
            enum: ["Pending", "Approved", "Completed", "Rejected"],
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

const BarangayClearance = mongoose.model("BarangayClearance", barangayClearanceSchema);

export default BarangayClearance;
