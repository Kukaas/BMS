import express from "express";
import {
    createCaptainAccount,
    createSecretaryAccount,
    createSuperAdminAccount,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Create secretary account route
// POST /api/admin/create-secretary-account
router.post("/create-secretary-account", createSecretaryAccount);

// Create captain account route
// POST /api/admin/create-captain-account
router.post("/create-chairman-account", createCaptainAccount);

// Create super admin account route
// POST /api/admin/create-super-admin-account
router.post("/create-super-admin-account", createSuperAdminAccount);

export default router;
