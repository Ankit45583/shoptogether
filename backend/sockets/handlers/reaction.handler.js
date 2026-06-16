import Room from "../../models/Room.model.js";
import { REACTION_EVENTS } from "../events/reaction.events.js";
import logger from "../../utils/logger.js";

// Simple emoji whitelist to prevent abuse
const ALLOWED_EMOJIS = new Set([
  "❤️", "🔥", "😍", "👍", "👎", "😂", "🎉", "😮", "😢", "💯",
  "✅", "❌", "🛒", "💸", "💰", "🤩", "😎", "🙌", "👏", "⭐",
  "💎", "🚀", "💡", "🎁", "🛍️", "😊", "🥳", "😤", "🤔", "💪",
]);

const reactionHandler = (io, socket) => {
  socket.on(REACTION_EVENTS.SEND, async ({ roomId, emoji }) => {
    try {
      if (!roomId || !emoji) {
        return socket.emit("error", { message: "roomId and emoji are required" });
      }

      const room = await Room.findById(roomId).lean();
      if (!room) return socket.emit("error", { message: "Room not found" });

      const isMember = room.members.some(
        (m) => m.user.toString() === socket.user._id.toString()
      );
      if (!isMember) return socket.emit("error", { message: "Not a room member" });

      // Sanitize emoji — allow any single grapheme or known emoji
      const sanitizedEmoji = String(emoji).trim().slice(0, 8);

      io.to(roomId).emit(REACTION_EVENTS.NEW, {
        roomId,
        emoji: sanitizedEmoji,
        sentBy: {
          _id: socket.user._id,
          name: socket.user.name,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      logger.error("reaction:send socket error:", err.message);
      socket.emit("error", { message: "Failed to send reaction" });
    }
  });
};

export default reactionHandler;
