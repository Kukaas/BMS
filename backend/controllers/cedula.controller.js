import Cedula from "../models/cedula.model.js";

export const createCedula = async (req, res, next) => {
    try {
        const newCedula = new Cedula({
            ...req.body,
            userId: req.user.id,
        });
        await newCedula.save();
        res.status(201).json({
            success: true,
            message: "Cedula request created successfully",
            data: newCedula,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserCedulas = async (req, res, next) => {
    try {
        const cedulas = await Cedula.find({ userId: req.user.id });
        res.status(200).json({
            success: true,
            data: cedulas,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCedulas = async (req, res, next) => {
    try {
        const cedulas = await Cedula.find().populate("userId", "name email");
        res.status(200).json({
            success: true,
            data: cedulas,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCedulaStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const cedula = await Cedula.findById(id);
        if (!cedula) {
            return next(errorHandler(404, "Cedula request not found"));
        }

        cedula.status = status;
        await cedula.save();

        res.status(200).json({
            success: true,
            message: "Cedula status updated successfully",
            data: cedula,
        });
    } catch (error) {
        next(error);
    }
};
