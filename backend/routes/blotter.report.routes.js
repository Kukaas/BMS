import express from "express";
import {
    createBlotterReport,
    getAllBlotterReports,
    getBlotterReport,
    updateBlotterReport,
    deleteBlotterReport,
    getEvidenceFile,
    getBarangayBlotterReports,
} from "../controllers/blotter.report.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Protected routes
router.post("/report", createBlotterReport);
router.get("/", getAllBlotterReports);
router.get("/barangay", getBarangayBlotterReports);
router.get("/:id", getBlotterReport);
router.get("/:reportId/evidence/:fileIndex", getEvidenceFile);
router.put("/:id", updateBlotterReport);
router.delete("/:id", deleteBlotterReport);

export default router;
