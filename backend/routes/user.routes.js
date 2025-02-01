import express from "express";
import {
    getUsersByBarangay,
    getUserById,
    verifyUser,
    rejectUser,
    deactivateUser,
    activateUser,
} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Get all users from same barangay
// GET /api/users/barangay
router.get("/barangay", verifyToken, getUsersByBarangay);

// Get single user by ID (from same barangay)
// GET /api/users/:userId
router.get("/:userId", verifyToken, getUserById);

// Add this route to the existing routes
router.patch("/:userId/verify", verifyToken, verifyUser);

// Add this route alongside your existing routes
router.patch("/:userId/reject", verifyToken, rejectUser);

// Add this route alongside your existing routes
router.patch("/:userId/deactivate", verifyToken, deactivateUser);

// Add this route alongside your existing routes
router.patch("/:userId/activate", verifyToken, activateUser);

export default router;
