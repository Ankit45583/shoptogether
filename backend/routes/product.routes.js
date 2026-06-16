import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProduct,
  getTrendingProducts,
  getRoomProducts,
  shareProductToRoom,
} from "../controllers/product.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/trending", getTrendingProducts);
router.get("/room/:roomId", protect, getRoomProducts);
router.get("/:productId", getProductById);

router.post("/", protect, createProduct);
router.put("/:productId", protect, updateProduct);
router.delete("/:productId", protect, deleteProduct);
router.post("/:productId/save", protect, saveProduct);
router.post("/:productId/share/:roomId", protect, shareProductToRoom);

export default router;
