import express from "express";
import verifyToken from "../utils/verifyToken.js";
import {
    createBarangayClearance,
    getBarangayClearanceForPrint,
} from "../controllers/barangay.clearance.controller.js";

const router = express.Router();

// Create a barangay clearance request
// POST /api/barangay-clearance/request
router.post("/request", verifyToken, createBarangayClearance);

// Get barangay clearance for printing
router.get("/:id/print", verifyToken, getBarangayClearanceForPrint);

export default router;
