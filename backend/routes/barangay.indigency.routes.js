import express from "express";
import { createBarangayIndigency } from "../controllers/barangay.indigency.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Create a barangay indigency request
// POST /api/barangay-indigency/request
router.post("/request", verifyToken, createBarangayIndigency);

export default router;
