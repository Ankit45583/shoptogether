import chatHandler from "./handlers/chat.handler.js";
import roomHandler from "./handlers/room.handler.js";
import presenceHandler from "./handlers/presence.handler.js";
import voteHandler from "./handlers/vote.handler.js";
import cartHandler from "./handlers/cart.handler.js";
import reactionHandler from "./handlers/reaction.handler.js";
import aiHandler from "./handlers/ai.handler.js";
import logger from "../utils/logger.js";

const socketManager = (io) => {
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id} | User: ${socket.user?.username}`);

    // Register all handlers
    chatHandler(io, socket);
    roomHandler(io, socket);
    presenceHandler(io, socket);
    voteHandler(io, socket);
    cartHandler(io, socket);
    reactionHandler(io, socket);
    aiHandler(io, socket);

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });

    socket.on("error", (err) => {
      logger.error(`Socket error [${socket.id}]:`, err.message);
    });
  });
};

export default socketManager;
