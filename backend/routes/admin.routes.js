import express from "express";
import { createCaptainAccount, createSecretaryAccount } from "../controllers/admin.controller.js";

const router = express.Router();

// Create secretary account route
// POST /api/admin/create-secretary-account
router.post("/create-secretary-account", createSecretaryAccount);

// Create captain account route
// POST /api/admin/create-captain-account
router.post("/create-chairman-account", createCaptainAccount);

export default router;
