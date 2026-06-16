import express from "express";
import {
  getGroupCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/:roomId", getGroupCart);
router.post("/:roomId", addToCart);
router.delete("/:roomId", clearCart);
router.delete("/:roomId/item/:productId", removeFromCart);
router.patch("/:roomId/item/:productId", updateCartItem);

export default router;
