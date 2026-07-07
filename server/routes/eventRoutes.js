import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStats,
  getEventMembersByCategory,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", upload.single("logo"), createEvent);
router.get("/", getEvents);

// IMPORTANT: keep this before "/:id"
router.get(
  "/:eventId/category/:category/members",
  getEventMembersByCategory
);

router.get("/:id", getEventById);
router.put("/:id", upload.single("logo"), updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/stats", getEventStats);

export default router;