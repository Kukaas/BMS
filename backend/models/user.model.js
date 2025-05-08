import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    type: String,
    read: {
        type: Boolean,
        default: false,
    },
    relatedDocId: mongoose.Schema.Types.ObjectId,
    docModel: {
        type: String,
        enum: [
            "BarangayClearance",
            "BarangayIndigency",
            "BusinessClearance",
            "Cedula",
            "IncidentReport",
            "BlotterReport",
            "2FA",
        ],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            required: true,
        },
        purok: {
            type: String,
            required: true,
        },
        validId: {
            front: {
                filename: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
                contentType: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
                data: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
            },
            back: {
                filename: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
                contentType: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
                data: {
                    type: String,
                    required: function () {
                        return this.role === "user";
                    },
                },
            },
        },
        contactNumber: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
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
        mfaEnabled: {
            type: Boolean,
            default: false,
        },
        mfaSecret: {
            type: String,
            default: null,
            select: false, // Don't include in regular queries
        },
        notifications: [notificationSchema],
        unreadNotifications: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
