import express from "express";
import {
    getTreasurerDashboardData,
    getTransactionHistory,
} from "../controllers/treasurer.controller.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Middleware to verify treasurer role
const verifyTreasurer = (req, res, next) => {
    if (req.user && req.user.role === "treasurer") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied. Treasurer role required.",
        });
    }
};

// Get treasurer dashboard data - protected route for treasurers only
router.get("/dashboard", verifyToken, verifyTreasurer, getTreasurerDashboardData);

// Get transaction history with date filtering
router.get("/transactions", verifyToken, verifyTreasurer, getTransactionHistory);

export default router;
