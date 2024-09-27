import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { auth, isVendor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, isVendor, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", auth, isVendor, updateProduct);
router.delete("/:id", auth, isVendor, deleteProduct);

export default router;
