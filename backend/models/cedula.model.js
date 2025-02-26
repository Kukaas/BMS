import mongoose from "mongoose";
import { STATUS_TYPES } from "./barangay.clearance.model.js";

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

const Cedula = mongoose.model("Cedula", cedulaSchema);
export default Cedula;
