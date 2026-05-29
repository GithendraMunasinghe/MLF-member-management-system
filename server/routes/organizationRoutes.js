import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getOrganizationStats
} from "../controllers/organizationController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Organization (with logo)
router.post("/", upload.single("logo"), createOrganization);

// Get all organizations (with member count)
router.get("/", getOrganizations);

// Get single organization (with member count)
router.get("/:id", getOrganizationById);

// Update organization (with optional logo)
router.put("/:id", upload.single("logo"), updateOrganization);

// Delete organization
router.delete("/:id", deleteOrganization);

// Get organization stats (member count)
router.get("/:id/stats", getOrganizationStats);


export default router;