import express from "express";
import {
  createCoordinator,
  getCoordinators,
  getCoordinatorById,
  updateCoordinator,
  deleteCoordinator,
  getCoordinatorStats
} from "../controllers/coordinatorController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Coordinator (with photo)
router.post("/", upload.single("photo"), createCoordinator);

// Get all coordinators
router.get("/", getCoordinators);

// Get single coordinator
router.get("/:id", getCoordinatorById);

// Update coordinator (with optional photo)
router.put("/:id", upload.single("photo"), updateCoordinator);

// Delete coordinator
router.delete("/:id", deleteCoordinator);

// Get coordinator stats (member count)
router.get("/:id/stats", getCoordinatorStats);

export default router;