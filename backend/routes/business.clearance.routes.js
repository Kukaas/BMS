import express from "express";
import {
    createBusinessClearance,
    getUserBusinessClearances,
    getAllBusinessClearances,
    updateBusinessClearanceStatus,
} from "../controllers/business.clearance.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Create a business clearance request
// POST /api/business-clearance/request
router.post("/request", verifyToken, createBusinessClearance);

// Get user's business clearance requests
// GET /api/business-clearance/user
router.get("/user", verifyToken, getUserBusinessClearances);

// Get all business clearance requests (admin only)
// GET /api/business-clearance/all
router.get("/all", verifyToken, getAllBusinessClearances);

// Update business clearance status (admin only)
// PUT /api/business-clearance/status/:id
router.put("/status/:id", verifyToken, updateBusinessClearanceStatus);

export default router;
