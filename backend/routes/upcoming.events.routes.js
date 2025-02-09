import express from "express";
import { createUpcomingEvent, getUpcomingEventsByBarangay } from "../controllers/upcoming.events.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new upcoming event
router.post("/create-upcoming-event", verifyToken, createUpcomingEvent);

// Get upcoming events by barangay
router.get("/get-upcoming-events/:barangay", verifyToken, getUpcomingEventsByBarangay);



export default router;



