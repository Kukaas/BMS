import express from "express";
import {
    getUsersByBarangay,
    getUserById,
    verifyUser,
    rejectUser,
    deactivateUser,
    activateUser,
    getResidentsByBarangay,
    getUsers,
} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Place specific routes before parameterized routes
// GET /api/users/residents
router.get("/residents", verifyToken, getResidentsByBarangay);

// GET /api/users/barangay
router.get("/barangay", verifyToken, getUsersByBarangay);

// Parameterized routes should come after specific routes
// GET /api/users/:userId
router.get("/:userId", verifyToken, getUserById);

// GET /api/users/all
router.get("/", verifyToken, getUsers);

// PATCH routes
router.patch("/:userId/verify", verifyToken, verifyUser);
router.patch("/:userId/reject", verifyToken, rejectUser);
router.patch("/:userId/deactivate", verifyToken, deactivateUser);
router.patch("/:userId/activate", verifyToken, activateUser);


export default router;
