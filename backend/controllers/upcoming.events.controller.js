import UpcomingEvents from "../models/upcoming.events.model.js";

export const createUpcomingEvent = async (req, res, next) => {
    try {
        const { title, description, date, time, barangay, location, createdBy } = req.body;

        const upcomingEvent = new UpcomingEvents({
            title,
            description,
            date,
            time,
            barangay,
            location,
            createdBy,
        });

        await upcomingEvent.save();

        res.status(201).json({
            success: true,
            message: "Upcoming event created successfully",
            upcomingEvent,
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingEventsByBarangay = async (req, res, next) => {
    try {
        const { barangay } = req.params;
        const currentDate = new Date();

        // Find events that haven't occurred yet
        const upcomingEvents = await UpcomingEvents.find({
            barangay,
            date: { $gte: currentDate }
        }).sort({ date: 1 }); // Sort by date ascending

        res.status(200).json({
            success: true,
            message: "Upcoming events fetched successfully",
            upcomingEvents,
        });

    } catch (error) {
        next(error);
    }
}











