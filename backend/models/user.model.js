import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    type: String,
    read: {
        type: Boolean,
        default: false
    },
    relatedDocId: mongoose.Schema.Types.ObjectId,
    docModel: {
        type: String,
        enum: [
            'BarangayClearance',
            'BarangayIndigency',
            'BusinessClearance',
            'Cedula',
            'IncidentReport',
            'BlotterReport'
        ],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        barangay: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        notifications: [notificationSchema],
        unreadNotifications: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
