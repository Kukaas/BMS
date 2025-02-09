import express from "express";
import { getAllUsersByBarangay, getTotalReportsByBarangay, getAllRequestsByBarangay, getPendingRequestsByBarangay, getAllUsers, getTotalReports, getTotalRequests, getPendingRequests, getUserTotalReports, getUserTotalRequests, getUserPendingRequests } from "../controllers/dashboard.controller.js";


const router = express.Router();

// Get all users by barangay
router.get("/users/:barangay", getAllUsersByBarangay);


// Get total reports by barangay
router.get("/reports/:barangay", getTotalReportsByBarangay);

// Get total completed requests by barangay
router.get("/all-requests/:barangay", getAllRequestsByBarangay);

// Get pending requests by barangay
router.get("/pending-requests/:barangay", getPendingRequestsByBarangay);

// Get all users
router.get("/users", getAllUsers);

// Get total reports
router.get("/reports", getTotalReports);

// Get total requests
router.get("/requests", getTotalRequests);

// Get pending requests
router.get("/pending-requests", getPendingRequests);

// Get user total reports
router.get("/user-reports/:userId", getUserTotalReports);

// Get user total requests
router.get("/user-requests/:userId", getUserTotalRequests);

// Get user pending requests
router.get("/user-pending-requests/:userId", getUserPendingRequests);






export default router;

