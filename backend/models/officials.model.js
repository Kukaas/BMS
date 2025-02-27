import mongoose from "mongoose";

const officialsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
            enum: ["Chairman", "SK Chairman", "Kagawad", "Secretary", "Treasurer"],
        },
        contactNumber: {
            type: String,
            required: true,
        },
        image: {
            filename: String,
            contentType: String,
            data: String, // Store base64 data URL
        },
        barangay: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Officials = mongoose.model("Officials", officialsSchema);

export default Officials;



