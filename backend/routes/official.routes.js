import express from "express";
import {
    createOfficial,
    getOfficials,
    getOfficialsByBarangay
} from "../controllers/officials.controller.js";

const router = express.Router();

// Create new official
router.post("/add-official", createOfficial);

// Get all active officials
router.get("/get-officials", getOfficials);

// Get officials by barangay
router.get("/get-officials/:barangay", getOfficialsByBarangay);

export default router;
