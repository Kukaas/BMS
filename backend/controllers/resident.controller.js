import Resident from "../models/resident.model.js";

// Create new resident
export const createResident = async (req, res) => {
    try {
        const residentData = {
            ...req.body,
            barangay: req.params.barangay,
            createdBy: req.user.id,
        };

        const resident = new Resident(residentData);
        await resident.save();

        res.status(201).json({
            success: true,
            message: "Resident created successfully",
            data: resident,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all residents for specified barangay
export const getResidents = async (req, res) => {
    try {
        const residents = await Resident.find({ barangay: req.params.barangay }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: residents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get single resident
export const getResident = async (req, res) => {
    try {
        const resident = await Resident.findOne({
            _id: req.params.id,
            barangay: req.params.barangay,
        });

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: "Resident not found",
            });
        }

        res.status(200).json({
            success: true,
            data: resident,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update resident
export const updateResident = async (req, res) => {
    try {
        const resident = await Resident.findById(req.params.id);

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: "Resident not found",
            });
        }

        // Check if user has permission to update this resident
        if (resident.barangay !== req.body.barangay) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this resident",
            });
        }

        const updatedResident = await Resident.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...req.body,
                    updatedBy: req.user.id,
                },
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Resident updated successfully",
            data: updatedResident,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete resident
export const deleteResident = async (req, res) => {
    try {
        const resident = await Resident.findById(req.params.id);

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: "Resident not found",
            });
        }

        await resident.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resident deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
