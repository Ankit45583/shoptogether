import Room from "../../models/Room.model.js";
import Message from "../../models/Message.model.js";
import Vote from "../../models/Vote.model.js";
import AIRecommendation from "../../models/AIRecommendation.model.js";
import { generateRecommendations } from "../../services/ai.service.js";
import { AI_EVENTS } from "../events/ai.events.js";
import logger from "../../utils/logger.js";

const aiHandler = (io, socket) => {
  socket.on(AI_EVENTS.REQUEST_RECOMMENDATION, async ({ roomId }) => {
    try {
      if (!roomId) return socket.emit("error", { message: "roomId is required" });

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some(
        (m) => m.user.toString() === socket.user._id.toString()
      );
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      // Broadcast loading state to everyone in the room
      io.to(roomId).emit(AI_EVENTS.THINKING, { roomId, thinking: true });

      const startTime = Date.now();

      // Fetch recent messages
      const rawMessages = await Message.find({ room: roomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender", "name")
        .lean();

      const messages = rawMessages
        .reverse()
        .map((m) => `${m.sender?.name || "User"}: ${m.content || ""}`);

      // Fetch votes summary
      const votes = await Vote.find({ room: roomId })
        .populate("product", "name price category")
        .lean();

      const voteMap = {};
      for (const v of votes) {
        const pid = v.product?._id?.toString();
        if (!pid) continue;
        if (!voteMap[pid]) voteMap[pid] = { name: v.product.name, up: 0, down: 0 };
        if (v.type === "upvote") voteMap[pid].up++;
        else voteMap[pid].down++;
      }

      const { recommendations, tokensUsed, processingTime } = await generateRecommendations({
        messages,
        votes: Object.values(voteMap),
        preferences: {},
        budget: {},
      });

      const saved = await AIRecommendation.create({
        room: roomId,
        type: "product_recommendation",
        input: { messages: messages.slice(0, 20), votes: Object.values(voteMap) },
        output: { recommendations },
        tokensUsed: tokensUsed || 0,
        processingTime: processingTime || Date.now() - startTime,
      });

      io.to(roomId).emit(AI_EVENTS.THINKING, { roomId, thinking: false });
      io.to(roomId).emit(AI_EVENTS.RECOMMENDATION, {
        roomId,
        recommendations,
        generatedAt: saved.createdAt,
        requestedBy: {
          _id: socket.user._id,
          name: socket.user.name,
          username: socket.user.username,
        },
      });
    } catch (err) {
      logger.error("ai:request_recommendation socket error:", err.message);
      socket.emit(AI_EVENTS.THINKING, { roomId, thinking: false });
      socket.emit("error", { message: "AI recommendation failed. Please try again." });
    }
  });
};

export default aiHandler;
