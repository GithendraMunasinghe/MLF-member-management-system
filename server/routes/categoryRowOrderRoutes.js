import express from "express";
import {
  getCategoryRowOrder,
  saveCategoryRowOrder,
} from "../controllers/categoryRowOrderController.js";

const router = express.Router();

router.get(
  "/:eventId/category/:category",
  getCategoryRowOrder
);

router.put(
  "/:eventId/category/:category",
  saveCategoryRowOrder
);

export default router;