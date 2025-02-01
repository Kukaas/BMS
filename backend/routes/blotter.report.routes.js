import express from "express";
import {
    createBlotterReport,
    getAllBlotterReports,
    getBlotterReport,
    updateBlotterReport,
    deleteBlotterReport,
    getEvidenceFile,
} from "../controllers/blotter.report.controller.js";

const router = express.Router();

// Routes without verifyToken middleware
router.post("/report", createBlotterReport);
router.get("/", getAllBlotterReports);
router.get("/:id", getBlotterReport);
router.get("/:reportId/evidence/:fileIndex", getEvidenceFile);
router.put("/:id", updateBlotterReport);
router.delete("/:id", deleteBlotterReport);

export default router;
