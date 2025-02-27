import express from "express";
import {
    createBarangayIndigency,
    printBarangayIndigency,
} from "../controllers/barangay.indigency.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Create a barangay indigency request
// POST /api/barangay-indigency/request
router.post("/request", verifyToken, createBarangayIndigency);

// Print barangay indigency
router.get("/:id/print", verifyToken, printBarangayIndigency);

export default router;
