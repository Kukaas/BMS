import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    createResident,
    getResidents,
    getResident,
    updateResident,
    deleteResident,
} from "../controllers/resident.controller.js";

const router = express.Router();

// All routes require token verification
router.use(verifyToken);

// Create new resident
router.post("/:barangay", createResident);

// Get all residents by barangay
router.get("/:barangay", getResidents);

// Get single resident
router.get("/:barangay/:id", getResident);

// Update resident
router.put("/:id", updateResident);

// Delete resident
router.delete("/:id", deleteResident);

export default router;
