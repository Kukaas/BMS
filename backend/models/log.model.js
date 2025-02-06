import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: [
            "User Activity",
            "Resident Record",
            "Barangay Indigency",
            "Barangay Clearance",
            "Business Clearance",
            "Cedula",
            "Incident Report",
            "Blotter Report",
            "Audit",
        ],
        required: true,
    },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
