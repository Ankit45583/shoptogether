import Room from "../models/Room.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateRoomCode from "../utils/generateRoomCode.js";
import {
  createRoomValidator,
  updateRoomValidator,
  joinRoomValidator,
} from "../validators/room.validator.js";
import { LIMITS } from "../config/constants.js";

// ─── Create Room ──────────────────────────────────────────
export const createRoom = asyncHandler(async (req, res) => {
  const { error, value } = createRoomValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Check rooms limit
  const userRooms = await Room.countDocuments({
    host: req.user._id,
    status: "active",
  });

  if (userRooms >= LIMITS.MAX_ROOMS_CREATED) {
    throw new ApiError(400, `You can only create ${LIMITS.MAX_ROOMS_CREATED} active rooms`);
  }

  // Generate unique code
  let code;
  let codeExists = true;

  while (codeExists) {
    code = generateRoomCode();
    codeExists = await Room.findOne({ code });
  }

  // Create room
  const room = await Room.create({
    ...value,
    code,
    host: req.user._id,
    members: [
      {
        user: req.user._id,
        role: "host",
      },
    ],
  });

  // Add to user roomsCreated
  await User.findByIdAndUpdate(req.user._id, {
    $push: { roomsCreated: room._id },
  });

  // Populate host info
  await room.populate("host", "name username avatar");
  await room.populate("members.user", "name username avatar");

  const response = new ApiResponse(201, "Room created successfully", {
    room,
  });

  res.status(201).json(response);
});

// ─── Join Room ────────────────────────────────────────────
export const joinRoom = asyncHandler(async (req, res) => {
  const { error, value } = joinRoomValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { code } = value;

  const room = await Room.findOne({ code });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.status === "closed") {
    throw new ApiError(400, "This room is closed");
  }

  // Already member check
  const isMember = room.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    throw new ApiError(400, "You are already in this room");
  }

  // Max members check
  if (room.members.length >= room.maxMembers) {
    throw new ApiError(400, "Room is full");
  }

  // Add member
  room.members.push({
    user: req.user._id,
    role: "member",
  });

  await room.save();

  // Add to user roomsJoined
  await User.findByIdAndUpdate(req.user._id, {
    $push: { roomsJoined: room._id },
  });

  // Populate
  await room.populate("host", "name username avatar");
  await room.populate("members.user", "name username avatar");

  const response = new ApiResponse(200, "Joined room successfully", {
    room,
  });

  res.status(200).json(response);
});

// ─── Get Room By Id ───────────────────────────────────────
export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.roomId)
    .populate("host", "name username avatar")
    .populate("members.user", "name username avatar")
    .populate("sharedProducts");

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const response = new ApiResponse(200, "Room fetched", {
    room,
  });

  res.status(200).json(response);
});

// ─── Get My Rooms ─────────────────────────────────────────
export const getMyRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    "members.user": req.user._id,
    status: "active",
  })
    .populate("host", "name username avatar")
    .sort({ updatedAt: -1 });

  const response = new ApiResponse(200, "Rooms fetched", {
    rooms,
    count: rooms.length,
  });

  res.status(200).json(response);
});

// ─── Get Public Rooms ─────────────────────────────────────
export const getPublicRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const rooms = await Room.find({
    type: "public",
    status: "active",
  })
    .populate("host", "name username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Room.countDocuments({
    type: "public",
    status: "active",
  });

  const response = new ApiResponse(200, "Public rooms fetched", {
    rooms,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });

  res.status(200).json(response);
});

// ─── Update Room ──────────────────────────────────────────
export const updateRoom = asyncHandler(async (req, res) => {
  const { error, value } = updateRoomValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const room = await Room.findOneAndUpdate(
    {
      _id: req.params.roomId,
      host: req.user._id,
    },
    { $set: value },
    { new: true, runValidators: true }
  )
    .populate("host", "name username avatar")
    .populate("members.user", "name username avatar");

  if (!room) {
    throw new ApiError(404, "Room not found or unauthorized");
  }

  const response = new ApiResponse(200, "Room updated successfully", {
    room,
  });

  res.status(200).json(response);
});

// ─── Leave Room ───────────────────────────────────────────
export const leaveRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Host cannot leave
  if (room.host.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Host cannot leave. Close the room instead.");
  }

  // Remove member
  room.members = room.members.filter(
    (m) => m.user.toString() !== req.user._id.toString()
  );

  await room.save();

  // Remove from user roomsJoined
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { roomsJoined: room._id },
  });

  const response = new ApiResponse(200, "Left room successfully");

  res.status(200).json(response);
});

// ─── Remove Member ────────────────────────────────────────
export const removeMember = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only host can remove members");
  }

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot remove yourself");
  }

  room.members = room.members.filter(
    (m) => m.user.toString() !== userId
  );

  await room.save();

  await User.findByIdAndUpdate(userId, {
    $pull: { roomsJoined: room._id },
  });

  const response = new ApiResponse(200, "Member removed successfully");

  res.status(200).json(response);
});

// ─── Close Room ───────────────────────────────────────────
export const closeRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({
    _id: req.params.roomId,
    host: req.user._id,
  });

  if (!room) {
    throw new ApiError(404, "Room not found or unauthorized");
  }

  room.status = "closed";
  await room.save();

  const response = new ApiResponse(200, "Room closed successfully");

  res.status(200).json(response);
});
/* ==========================================
   GET SHARED PRODUCTS OF ROOM
========================================== */
export const getSharedProducts = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId)
    .populate({
      path: "sharedProducts",
      populate: {
        path: "addedBy",
        select: "name username avatar",
      },
    })
    .lean();

  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) throw new ApiError(403, "You are not a member of this room");

  return res.status(200).json(
    new ApiResponse(200, { products: room.sharedProducts || [] }, "Shared products fetched")
  );
});