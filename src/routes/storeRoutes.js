import express from "express";
import {
  createStore,
  getStoreProducts,
} from "../controllers/storeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createStore);
router.get("/:storeId/products", getStoreProducts);

export default router;
