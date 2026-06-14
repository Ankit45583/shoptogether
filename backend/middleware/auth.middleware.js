import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ─── Token Header Se Lo ──────────────────────────────────
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ─── Ya Cookie Se Lo ────────────────────────────────────
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // ─── Token Nahi Mila ────────────────────────────────────
  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  // ─── Token Verify Karo ──────────────────────────────────
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  // ─── User Dhundo ────────────────────────────────────────
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(401, "Account is deactivated");
  }

  // ─── User Request Me Daalo ──────────────────────────────
  req.user = user;

  next();
});

export default protect;