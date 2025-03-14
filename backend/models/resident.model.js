import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        middleName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        purok: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        fathersName: {
            type: String,
            trim: true,
            default: null,
        },
        mothersName: {
            type: String,
            trim: true,
            default: null,
        },
        barangay: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Resident", residentSchema);
