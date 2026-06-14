import express from "express";
import {
  getRoomMessages,
  sendMessage,
  deleteMessage,
  addReaction,
  removeReaction,
} from "../controllers/message.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/:roomId/messages", getRoomMessages);
router.post("/:roomId/messages", sendMessage);
router.delete("/messages/:messageId", deleteMessage);
router.post("/messages/:messageId/reaction", addReaction);
router.delete("/messages/:messageId/reaction", removeReaction);

export default router;