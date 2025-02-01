import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { createBarangayClearance } from "../controllers/barangay.clearance.controller.js";

const router = express.Router();

// Create a barangay clearance request
// POST /api/barangay-clearance/request
router.post("/request", verifyToken, createBarangayClearance);

export default router;
