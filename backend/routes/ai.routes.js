import express from "express";
import {
  getAIRecommendations,
  analyzeRoomMood,
  getRoomSummary,
  getPastRecommendations,
} from "../controllers/ai.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/recommendations/:roomId", getAIRecommendations);
router.get("/mood/:roomId", analyzeRoomMood);
router.get("/summary/:roomId", getRoomSummary);
router.get("/history/:roomId", getPastRecommendations);

export default router;
