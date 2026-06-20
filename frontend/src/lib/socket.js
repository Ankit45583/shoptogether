import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

/* ==========================================
   CONNECT TO SOCKET
========================================== */

export const connectSocket = () => {
  // Token nikalo auth storage se
  const authStorage = localStorage.getItem("auth-storage");
  let token = null;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      token = parsed?.state?.token;
    } catch (e) {
      console.error("Failed to parse auth storage");
    }
  }

  if (!token) {
    console.warn("No token found, cannot connect socket");
    return null;
  }

  // Agar already connected hai to wahi return karo
  if (socket?.connected) {
    return socket;
  }

  // New connection
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection events
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return socket;
};

/* ==========================================
   GET CURRENT SOCKET
========================================== */

export const getSocket = () => socket;

/* ==========================================
   DISCONNECT
========================================== */

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};