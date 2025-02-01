import express from "express";
import {
    createIncidentReport,
    getAllIncidentReports,
    updateIncidentStatus,
    getIncidentReport,
    deleteIncidentReport,
    getEvidence,
} from "../controllers/incident.report.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Get all incident reports
router.get("/", verifyToken, getAllIncidentReports);

// Get single incident report
router.get("/:id", verifyToken, getIncidentReport);

// Create incident report
router.post("/", verifyToken, createIncidentReport);

// Update incident report status
router.patch("/:id/status", verifyToken, updateIncidentStatus);

// Delete incident report
router.delete("/:id", verifyToken, deleteIncidentReport);

// Add route for getting evidence
router.get("/:id/evidence/:fileIndex", verifyToken, getEvidence);

export default router;
