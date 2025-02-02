import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    getAllDocumentRequests,
    getUserDocumentRequests,
    getDocumentRequestById,
    createBarangayClearance,
    createBarangayIndigency,
    createBusinessClearance,
    createCedula,
    updateBarangayClearanceStatus,
    updateBarangayIndigencyStatus,
    updateBusinessClearanceStatus,
    updateCedulaStatus
    // Import other handlers as needed
} from "../controllers/document.request.controller.js";

const router = express.Router();

// Get all document requests
router.get("/", verifyToken, getAllDocumentRequests);

// Get user's document requests
router.get("/my-requests", verifyToken, getUserDocumentRequests);

// Get specific document request by ID and type
router.get("/:type/:id", verifyToken, getDocumentRequestById);

// Create document requests
router.post("/barangay-clearance", verifyToken, createBarangayClearance);
router.post("/barangay-indigency", verifyToken, createBarangayIndigency);
router.post("/business-clearance", verifyToken, createBusinessClearance);
router.post("/cedula", verifyToken, createCedula);

// Update document status
router.patch("/barangay-clearance/:id/status", verifyToken, updateBarangayClearanceStatus);
router.patch("/barangay-indigency/:id/status", verifyToken, updateBarangayIndigencyStatus);
router.patch("/business-clearance/:id/status", verifyToken, updateBusinessClearanceStatus);
router.patch("/cedula/:id/status", verifyToken, updateCedulaStatus);
// Add other routes as needed

// Add health check route
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Document request service is running"
    });
});

export default router;
