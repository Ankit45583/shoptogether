import Room from "../models/Room.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isRoomHost = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only room host can perform this action");
  }

  req.room = room;
  next();
});

export const isRoomMember = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isMember = room.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  req.room = room;
  next();
});