import BarangayClearance from "../models/barangay.clearance.model.js";

export const createBarangayClearance = async (req, res, next) => {
    try {
        const { name, email, barangay, purpose, contactNumber } = req.body;

        // Validate required fields
        if (!name || !email || !barangay || !purpose || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const barangayClearance = new BarangayClearance({
            name,
            email,
            barangay,
            purpose,
            contactNumber,
        });

        await barangayClearance.save();

        res.status(201).json({
            success: true,
            message: "Barangay clearance request created successfully",
            data: barangayClearance,
        });
    } catch (error) {
        next(error);
    }
};

export const approveBarangayClearance = async (req, res, next) => {
    try {
        const { id } = req.params;

        const barangayClearance = await BarangayClearance.findById(id);

        if (!barangayClearance) {
            return res.status(404).json({
                success: false,
                message: "Barangay clearance not found",
            });
        }

        const date = new Date();

        barangayClearance.isVerified = true;
        barangayClearance.dateOfIssuance = date;

        await barangayClearance.save();

        res.status(200).json({
            success: true,
            data: barangayClearance,
        });
    } catch (error) {
        next(error);
    }
};
