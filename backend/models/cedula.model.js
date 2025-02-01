import mongoose from "mongoose";

const cedulaSchema = new mongoose.Schema(
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
        dateOfBirth: {
            type: String,
            required: true,
        },
        placeOfBirth: {
            type: String,
            required: true,
        },
        barangay: {
            type: String,
            required: true,
        },
        civilStatus: {
            type: String,
            enum: ["Single", "Married", "Widowed", "Separated"],
            required: true,
        },
        occupation: {
            type: String,
            required: true,
        },
        employerName: String,
        employerAddress: String,
        tax: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Completed", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Cedula = mongoose.model("Cedula", cedulaSchema);
export default Cedula;
