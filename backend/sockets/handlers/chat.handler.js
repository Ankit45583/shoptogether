import Message from "../../models/Message.model.js";
import Room from "../../models/Room.model.js";
import { CHAT_EVENTS } from "../events/chat.events.js";

const chatHandler = (io, socket) => {
  // ─── Send Message ─────────────────────────────────────
  socket.on(CHAT_EVENTS.SEND_MESSAGE, async (data) => {
    try {
      const { roomId, content, type, product } = data;

      // Room check
      const room = await Room.findById(roomId);

      if (!room || room.status === "closed") {
        socket.emit("error", { message: "Room not found or closed" });
        return;
      }

      // Member check
      const isMember = room.members.some(
        (m) => m.user.toString() === socket.user._id.toString()
      );

      if (!isMember) {
        socket.emit("error", { message: "Not a room member" });
        return;
      }

      // Save message
      const message = await Message.create({
        room: roomId,
        sender: socket.user._id,
        content,
        type: type || "text",
        product: product || null,
      });

      await message.populate("sender", "name username avatar");
      await message.populate("product");

      // Broadcast to room
      io.to(roomId).emit(CHAT_EVENTS.NEW_MESSAGE, {
        message,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ─── Typing Start ─────────────────────────────────────
  socket.on(CHAT_EVENTS.TYPING_START, (data) => {
    const { roomId } = data;

    socket.to(roomId).emit(CHAT_EVENTS.USER_TYPING, {
      userId: socket.user._id,
      name: socket.user.name,
      username: socket.user.username,
      isTyping: true,
    });
  });

  // ─── Typing Stop ──────────────────────────────────────
  socket.on(CHAT_EVENTS.TYPING_STOP, (data) => {
    const { roomId } = data;

    socket.to(roomId).emit(CHAT_EVENTS.USER_TYPING, {
      userId: socket.user._id,
      name: socket.user.name,
      username: socket.user.username,
      isTyping: false,
    });
  });

  // ─── Delete Message ───────────────────────────────────
  socket.on(CHAT_EVENTS.DELETE_MESSAGE, async (data) => {
    try {
      const { roomId, messageId } = data;

      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      if (message.sender.toString() !== socket.user._id.toString()) {
        socket.emit("error", { message: "Cannot delete others message" });
        return;
      }

      message.isDeleted = true;
      message.content = "This message was deleted";
      await message.save();

      io.to(roomId).emit(CHAT_EVENTS.MESSAGE_DELETED, {
        messageId,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to delete message" });
    }
  });

  // ─── Add Reaction ─────────────────────────────────────
  socket.on(CHAT_EVENTS.ADD_REACTION, async (data) => {
    try {
      const { roomId, messageId, emoji } = data;

      const message = await Message.findById(messageId);

      if (!message) return;

      const existingReaction = message.reactions.find(
        (r) => r.user.toString() === socket.user._id.toString()
      );

      if (existingReaction) {
        existingReaction.emoji = emoji;
      } else {
        message.reactions.push({
          user: socket.user._id,
          emoji,
        });
      }

      await message.save();
      await message.populate("reactions.user", "name username avatar");

      io.to(roomId).emit(CHAT_EVENTS.REACTION_UPDATED, {
        messageId,
        reactions: message.reactions,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to add reaction" });
    }
  });
};

export default chatHandler;