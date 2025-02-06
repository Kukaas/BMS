import Log from "../models/log.model.js";

export const createLog = async (userId, action, type, details = "") => {
    try {
        const log = new Log({
            userId,
            action,
            type,
            details,
        });
        await log.save();
    } catch (error) {
        console.error("Error creating log:", error);
    }
};

export const getLogs = async (req, res, next) => {
    try {
        const logs = await Log.find().populate("userId", "name email").sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};
