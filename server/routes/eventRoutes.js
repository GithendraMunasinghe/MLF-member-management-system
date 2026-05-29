import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStats
} from "../controllers/eventController.js";

const router = express.Router();

//router.post("/", createEvent);
router.post("/", upload.single("logo"), createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", upload.single("logo"), updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/stats", getEventStats);

export default router;