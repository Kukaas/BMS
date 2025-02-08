import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    createTransactionHistory,
    getAllTransactionHistory,
    getBarangayTransactionHistory,
} from "../controllers/transaction.history.controller.js";

const router = express.Router();

// Create new transaction history
router.post("/", verifyToken, createTransactionHistory);

// Get all transaction history
router.get("/", verifyToken, getAllTransactionHistory);

// Get transaction history by barangay
router.get("/:barangay", verifyToken, getBarangayTransactionHistory);

export default router;
