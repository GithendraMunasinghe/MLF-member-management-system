import express from "express";
import upload from "../middleware/uploadMiddleware.js";
// Import the functions from your new controller
import { 
  createMember, 
  getMembers, 
  getMemberById,
  getMembersCount, 
  searchMemberByRegNo,
  getDraftMembers,
  updateMember,
  deleteMember,    
  searchMembers
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all members
router.get("/", getMembers);

// Get total members count
router.get("/count", getMembersCount);

// Search members by Registration Number or name
router.get("/search", searchMembers);

// Search members by Registration Number
router.get("/search/:regNo", searchMemberByRegNo);

// Get all draft members
router.get("/drafts/all", protect, getDraftMembers);

// Get a member by ID
router.get("/:id", getMemberById);


// Create a new member (with image)
router.post("/", protect, upload.single("photo"), createMember);

// Update member (with image)
router.put("/:id", protect, upload.single("photo"), updateMember);

// Delete a member by ID
router.delete("/:id", protect, deleteMember);

export default router;