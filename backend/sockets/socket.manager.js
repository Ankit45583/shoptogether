import socketAuth from "./middleware/socket.auth.js";
import chatHandler from "./handlers/chat.handler.js";
import roomHandler from "./handlers/room.handler.js";
import presenceHandler from "./handlers/presence.handler.js";

const initializeSocket = (io) => {
  // ─── Auth Middleware ───────────────────────────────────
  io.use(socketAuth);

  // ─── Connection ───────────────────────────────────────
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.username}`);

    // Register handlers
    chatHandler(io, socket);
    roomHandler(io, socket);
    presenceHandler(io, socket);

    // ─── Disconnect ─────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.user.username}`);
    });
  });
};

export default initializeSocket;