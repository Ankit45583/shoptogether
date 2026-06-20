import express from "express";
import {
  createRoom,
  joinRoom,
  getRoomById,
  getMyRooms,
  getPublicRooms,
  updateRoom,
  leaveRoom,
  removeMember,
  closeRoom,
  getSharedProducts,   // ✨ NEW
} from "../controllers/room.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/my-rooms", getMyRooms);
router.get("/public", getPublicRooms);
router.get("/:roomId/shared-products", getSharedProducts);  // ✨ NEW
router.get("/:roomId", getRoomById);
router.put("/:roomId", updateRoom);
router.post("/:roomId/leave", leaveRoom);
router.post("/:roomId/remove-member", removeMember);
router.post("/:roomId/close", closeRoom);

export default router;