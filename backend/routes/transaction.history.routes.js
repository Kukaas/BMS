import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
    createTransactionHistory,
    getAllTransactionHistory,
} from "../controllers/transaction.history.controller.js";

const router = express.Router();

// Create new transaction history
router.post("/", verifyToken, createTransactionHistory);

// Get all transaction history
router.get("/", verifyToken, getAllTransactionHistory);

export default router;
