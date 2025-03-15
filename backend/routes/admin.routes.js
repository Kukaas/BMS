import express from "express";
import {
    createCaptainAccount,
    createSecretaryAccount,
    createSuperAdminAccount,
    createTreasurerAccount,
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

// Create treasurer account route
// POST /api/admin/create-treasurer-account
router.post("/create-treasurer-account", createTreasurerAccount);

export default router;
