import express from "express";
import { downloadOrderedMemberPhotos } from "../controllers/photoDownloadController.js";

const router = express.Router();

router.post(
  "/:eventId/category/:category",
  downloadOrderedMemberPhotos
);

export default router;