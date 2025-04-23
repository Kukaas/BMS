import express from "express";
import {
    enableMFA,
    verifyAndEnableMFA,
    disableMFA,
    sendLoginMFACode,
    initiateDisableMFA,
} from "../controllers/mfa.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/enable", verifyToken, enableMFA);
router.post("/verify", verifyToken, verifyAndEnableMFA);
router.post("/initiate-disable", verifyToken, initiateDisableMFA);
router.post("/disable", verifyToken, disableMFA);
router.post("/send-login-code", sendLoginMFACode);

export default router;
