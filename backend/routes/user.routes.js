import express from "express";
import {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getSavedProducts,
  getRoomHistory,
  deleteAccount,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes protected
router.use(protect);

router.get("/profile/:username", getUserProfile);
router.put("/profile", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.put("/change-password", changePassword);
router.get("/saved-products", getSavedProducts);
router.get("/room-history", getRoomHistory);
router.delete("/account", deleteAccount);

export default router;