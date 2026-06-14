import Message from "../models/Message.model.js";
import Room from "../models/Room.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Get Room Messages ────────────────────────────────────
export const getRoomMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Room exist karta hai check
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Member hai check
  const isMember = room.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  const messages = await Message.find({
    room: roomId,
    isDeleted: false,
  })
    .populate("sender", "name username avatar")
    .populate("product")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments({
    room: roomId,
    isDeleted: false,
  });

  const response = new ApiResponse(200, "Messages fetched", {
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });

  res.status(200).json(response);
});

// ─── Send Message (REST fallback) ────────────────────────
export const sendMessage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { content, type, product } = req.body;

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.status === "closed") {
    throw new ApiError(400, "Room is closed");
  }

  const isMember = room.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  const message = await Message.create({
    room: roomId,
    sender: req.user._id,
    content,
    type: type || "text",
    product: product || null,
  });

  await message.populate("sender", "name username avatar");

  const response = new ApiResponse(201, "Message sent", {
    message,
  });

  res.status(201).json(response);
});

// ─── Delete Message ───────────────────────────────────────
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  message.isDeleted = true;
  message.content = "This message was deleted";
  await message.save();

  const response = new ApiResponse(200, "Message deleted");

  res.status(200).json(response);
});

// ─── Add Reaction ─────────────────────────────────────────
export const addReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Already reacted check
  const existingReaction = message.reactions.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReaction) {
    // Update existing reaction
    existingReaction.emoji = emoji;
  } else {
    // Add new reaction
    message.reactions.push({
      user: req.user._id,
      emoji,
    });
  }

  await message.save();
  await message.populate("reactions.user", "name username avatar");

  const response = new ApiResponse(200, "Reaction added", {
    reactions: message.reactions,
  });

  res.status(200).json(response);
});

// ─── Remove Reaction ──────────────────────────────────────
export const removeReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  message.reactions = message.reactions.filter(
    (r) => r.user.toString() !== req.user._id.toString()
  );

  await message.save();

  const response = new ApiResponse(200, "Reaction removed");

  res.status(200).json(response);
});