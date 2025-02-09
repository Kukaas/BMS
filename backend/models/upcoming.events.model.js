import mongoose from "mongoose";

const upcomingEventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    barangay: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const UpcomingEvents = mongoose.model("UpcomingEvents", upcomingEventsSchema);

export default UpcomingEvents;



