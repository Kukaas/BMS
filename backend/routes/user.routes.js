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
    changePassword,
    updateProfile,
    getBarangayChairman,
    deleteUser,
} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Log when routes are being set up
console.log("Setting up user routes...");

// GET routes for specific paths (no parameters)
router.get("/residents", verifyToken, getResidentsByBarangay);
router.get("/barangay", verifyToken, getUsersByBarangay);
router.get("/", verifyToken, getUsers);

// PATCH routes for specific actions
router.patch("/:userId/verify", verifyToken, (req, res, next) => {
    console.log("Verify route hit:", req.params);
    verifyUser(req, res, next);
});

router.patch("/:userId/reject", verifyToken, (req, res, next) => {
    console.log("Reject route hit:", req.params);
    rejectUser(req, res, next);
});

router.patch("/:userId/deactivate", verifyToken, (req, res, next) => {
    console.log("Deactivate route hit:", req.params);
    deactivateUser(req, res, next);
});

router.patch("/:userId/activate", verifyToken, (req, res, next) => {
    console.log("Activate route hit:", req.params);
    activateUser(req, res, next);
});

router.patch("/:userId/change-password", verifyToken, changePassword);

// Add this new route
router.patch("/:userId/update-profile", verifyToken, updateProfile);

// Add this new route for deleting a user
router.delete("/:userId", verifyToken, (req, res, next) => {
    console.log("Delete route hit:", req.params);
    deleteUser(req, res, next);
});

// Add this new route before the parameterized routes
router.get("/chairman/current", verifyToken, getBarangayChairman);

// Generic parameterized route should be last
router.get("/:userId", verifyToken, getUserById);

export default router;
