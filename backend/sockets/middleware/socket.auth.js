import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import logger from "../../utils/logger.js";

/* ==========================================
   SOCKET AUTHENTICATION MIDDLEWARE
========================================== */

const socketAuth = async (socket, next) => {
  try {
    // Token nikalo handshake se (frontend bhej raha hai auth.token me)
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      logger.warn(`Socket auth failed: No token | ${socket.id}`);
      return next(new Error("Authentication required"));
    }

    // Verify JWT (same secret as REST API)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user (same as protect middleware)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      logger.warn(`Socket auth failed: User not found | ${socket.id}`);
      return next(new Error("User not found"));
    }

    if (!user.isActive) {
      logger.warn(`Socket auth failed: User deactivated | ${socket.id}`);
      return next(new Error("Account is deactivated"));
    }

    // Attach user to socket — ye sab handlers me available hoga
    socket.user = user;

    logger.info(`✅ Socket authenticated: ${user.username} | ${socket.id}`);
    next();
  } catch (error) {
    logger.error(`Socket auth error: ${error.message}`);

    if (error.name === "TokenExpiredError") {
      return next(new Error("Token expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new Error("Invalid token"));
    }

    next(new Error("Authentication failed"));
  }
};

export default socketAuth;