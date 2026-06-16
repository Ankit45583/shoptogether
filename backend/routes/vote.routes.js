import express from "express";
import {
  castVote,
  getRoomVotes,
  getProductVotes,
  getVoteSummary,
} from "../controllers/vote.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", castVote);
router.get("/room/:roomId", getRoomVotes);
router.get("/room/:roomId/summary", getVoteSummary);
router.get("/product/:productId/room/:roomId", getProductVotes);

export default router;
