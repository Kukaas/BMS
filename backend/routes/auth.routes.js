import express from "express";
import {
    login,
    logout,
    resetPassword,
    sendOTP,
    signUp,
    verifiedEmail,
    verifyEmail,
    verifyOTP,
    verifyToken as verifyTokenController,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Sign up route
// POST /api/auth/signup
router.post("/signup", signUp);

// Login route
// POST /api/auth/login
router.post("/login", login);

// Logout route
// GET /api/auth/logout
router.post("/logout", logout);

// Verify route
// GET /api/auth/verify/:uniqueString/:userId
router.get("/verify/:uniqueString/:userId", verifyEmail);

// Verified email route
// GET /api/auth/verifiedEmail
router.get("/verifiedEmail", verifiedEmail);

// Forgot password route
// POST /api/auth/forgot-password
router.post("/forgot-password", sendOTP);

// Verify OTP route
// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOTP);

// Reset password route
// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// Verify token route
router.get("/verify", verifyToken, verifyTokenController);

export default router;
