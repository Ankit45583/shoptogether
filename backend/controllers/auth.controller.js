
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";

// ─── Cookie Options ───────────────────────────────────────
const accessTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ─── Register ─────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  // Validate
  const { error, value } = registerValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { name, username, email, password } = value;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, "Email already registered");
    }
    throw new ApiError(409, "Username already taken");
  }

  // Create user
  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set cookies
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Response
  const response = new ApiResponse(201, "Account created successfully", {
    user: user.toSafeObject(),
    accessToken,
  });

  res.status(201).json(response);
});

// ─── Login ────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  // Validate
  const { error, value } = loginValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = value;

  // Find user with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check active
  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set cookies
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Response
  const response = new ApiResponse(200, "Login successful", {
    user: user.toSafeObject(),
    accessToken,
  });

  res.status(200).json(response);
});

// ─── Logout ───────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const response = new ApiResponse(200, "Logged out successfully");

  res.status(200).json(response);
});

// ─── Get Current User ─────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const response = new ApiResponse(200, "User fetched successfully", {
    user: user.toSafeObject(),
  });

  res.status(200).json(response);
});

// ─── Refresh Token ────────────────────────────────────────
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  // Verify refresh token
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // Find user
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id);

  // Set new cookie
  res.cookie("accessToken", accessToken, accessTokenOptions);

  const response = new ApiResponse(200, "Token refreshed", {
    accessToken,
  });

  res.status(200).json(response);
});