import express from "express";
import verifyToken from "../utils/verifyToken.js";
import {
    createBarangayClearance,
    approveBarangayClearance,
    getBarangayClearanceForPrint,
} from "../controllers/barangay.clearance.controller.js";

const router = express.Router();

// Create a barangay clearance request
router.post("/request", verifyToken, createBarangayClearance);

// Update status (including approval with OR number)
router.patch("/:id/status", verifyToken, approveBarangayClearance);

// Get barangay clearance for printing
router.get("/:id/print", verifyToken, getBarangayClearanceForPrint);

export default router;
