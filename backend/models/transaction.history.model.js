import mongoose from "mongoose";

const transactionHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        residentName: {
            type: String,
            required: true,
        },
        requestedDocument: {
            type: String,
            required: true,
        },
        dateRequested: {
            type: Date,
            required: true,
        },
        dateApproved: {
            type: Date,
        },
        dateCompleted: {
            type: Date,
        },
        barangay: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Completed", "Rejected"],
            required: true,
        },
        approvedBy: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("TransactionHistory", transactionHistorySchema);
