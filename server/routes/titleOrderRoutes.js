import express from "express";
import {
  getTitleOrder,
  saveTitleOrder,
} from "../controllers/titleOrderController.js";

const router = express.Router();

router.get(
  "/:eventId/category/:category/title/:title",
  getTitleOrder
);

router.put(
  "/:eventId/category/:category/title/:title",
  saveTitleOrder
);

export default router;