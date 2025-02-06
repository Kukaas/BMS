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

        email: {
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
        contactNumber: {
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
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const BarangayClearance = mongoose.model("BarangayClearance", barangayClearanceSchema);

export default BarangayClearance;
