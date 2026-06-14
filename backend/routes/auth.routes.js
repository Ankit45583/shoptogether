import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/refresh-token", refreshAccessToken);

export default router;