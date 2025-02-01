import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    createCedula,
    getUserCedulas,
    getAllCedulas,
    updateCedulaStatus,
} from "../controllers/cedula.controller.js";

const router = express.Router();

// Create a new cedula request
router.post("/request", verifyToken, createCedula);

// Get user's cedula requests
router.get("/user", verifyToken, getUserCedulas);

// Get all cedula requests (admin only)
router.get("/all", verifyToken, getAllCedulas);

// Update cedula status (admin only)
router.put("/status/:id", verifyToken, updateCedulaStatus);

export default router;
