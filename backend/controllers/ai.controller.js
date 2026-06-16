import Room from "../models/Room.model.js";
import Message from "../models/Message.model.js";
import AIRecommendation from "../models/AIRecommendation.model.js";
import GroupCart from "../models/GroupCart.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateRecommendations,
  analyzeGroupChat,
  generateGroupSummary,
} from "../services/ai.service.js";
import { createNotification } from "../services/notification.service.js";
import { NOTIFICATION_TYPES } from "../config/constants.js";
import { getRoomVotes } from "./vote.controller.js";
import Vote from "../models/Vote.model.js";

const checkRoomMembership = async (roomId, userId) => {
  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");
  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (!isMember) throw new ApiError(403, "You are not a member of this room");
  return room;
};

const getRecentMessages = async (roomId, limit = 50) => {
  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "name")
    .lean();

  return messages
    .reverse()
    .map((m) => `${m.sender?.name || "User"}: ${m.content || ""}`);
};

const getRoomVotesSummary = async (roomId) => {
  const votes = await Vote.find({ room: roomId })
    .populate("product", "name price category")
    .lean();

  const map = {};
  for (const v of votes) {
    const pid = v.product?._id?.toString();
    if (!pid) continue;
    if (!map[pid]) map[pid] = { product: v.product, up: 0, down: 0 };
    if (v.type === "upvote") map[pid].up++;
    else map[pid].down++;
  }

  return Object.values(map).map((p) => ({
    name: p.product?.name,
    category: p.product?.category,
    price: p.product?.price,
    upvotes: p.up,
    downvotes: p.down,
    approval: p.up + p.down > 0 ? Math.round((p.up / (p.up + p.down)) * 100) : 0,
  }));
};

export const getAIRecommendations = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const io = req.app.get("io");

  const room = await checkRoomMembership(roomId, req.user._id);

  // Emit thinking state
  if (io) io.to(roomId).emit("ai:thinking", { roomId, thinking: true });

  const startTime = Date.now();
  const [messages, votes] = await Promise.all([
    getRecentMessages(roomId, 50),
    getRoomVotesSummary(roomId),
  ]);

  const { recommendations, tokensUsed, processingTime } = await generateRecommendations({
    messages,
    votes,
    preferences: {},
    budget: {},
  });

  const saved = await AIRecommendation.create({
    room: roomId,
    type: "product_recommendation",
    input: { messages: messages.slice(0, 20), votes },
    output: { recommendations },
    tokensUsed: tokensUsed || 0,
    processingTime: processingTime || Date.now() - startTime,
  });

  if (io) {
    io.to(roomId).emit("ai:thinking", { roomId, thinking: false });
    io.to(roomId).emit("ai:recommendation", {
      roomId,
      recommendations,
      generatedAt: saved.createdAt,
    });
  }

  // Notify all room members
  for (const member of room.members) {
    if (member.user.toString() !== req.user._id.toString()) {
      createNotification({
        recipient: member.user,
        sender: req.user._id,
        type: NOTIFICATION_TYPES.AI_SUGGESTION,
        title: "🤖 New AI Recommendations",
        message: `AI has generated ${recommendations.length} product recommendations for ${room.name}`,
        data: { roomId },
        io,
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { recommendations, id: saved._id }, "AI recommendations generated")
  );
});

export const analyzeRoomMood = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  await checkRoomMembership(roomId, req.user._id);

  const messages = await getRecentMessages(roomId, 30);
  const result = await analyzeGroupChat(messages);

  await AIRecommendation.create({
    room: roomId,
    type: "mood_analysis",
    input: { messages: messages.slice(0, 20) },
    output: {
      detectedMood: result.mood,
      preferredCategories: result.categories,
      budgetRange: result.budgetRange,
      tags: Object.values(result.preferences || {}),
    },
    tokensUsed: result.tokensUsed || 0,
    processingTime: result.processingTime || 0,
  });

  return res.status(200).json(
    new ApiResponse(200, {
      mood: result.mood,
      categories: result.categories,
      budgetRange: result.budgetRange,
      preferences: result.preferences,
    }, "Room mood analyzed")
  );
});

export const getRoomSummary = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await checkRoomMembership(roomId, req.user._id);

  const [messages, votes, cart] = await Promise.all([
    getRecentMessages(roomId, 30),
    getRoomVotesSummary(roomId),
    GroupCart.findOne({ room: roomId })
      .populate("items.product", "name price")
      .lean(),
  ]);

  const cartItems = cart?.items || [];
  const members = room.members || [];

  const { summary, tokensUsed, processingTime } = await generateGroupSummary({
    roomName: room.name,
    messages,
    votes,
    cartItems,
    members,
  });

  await AIRecommendation.create({
    room: roomId,
    type: "preference_summary",
    input: { messages: messages.slice(0, 20), votes },
    output: { summary },
    tokensUsed: tokensUsed || 0,
    processingTime: processingTime || 0,
  });

  return res.status(200).json(new ApiResponse(200, { summary }, "Room summary generated"));
});

export const getPastRecommendations = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  await checkRoomMembership(roomId, req.user._id);

  const recommendations = await AIRecommendation.find({ room: roomId })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { recommendations }, "Past recommendations fetched")
  );
});
