import { Server } from "socket.io";
import initializeSocket from "./socket.manager.js";

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  initializeSocket(io);

  return io;
};

export default createSocketServer;