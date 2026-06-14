import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";

const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    if (!user.isActive) {
      return next(new Error("Account deactivated"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};

export default socketAuth;