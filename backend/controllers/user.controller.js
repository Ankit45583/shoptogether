import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/user.validator.js";
import { v2 as cloudinary } from "cloudinary";

// ─── Cloudinary Config ────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Get User Profile ─────────────────────────────────────
export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    "-password -passwordResetToken -passwordResetExpiry -__v"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const response = new ApiResponse(200, "User profile fetched", {
    user,
  });

  res.status(200).json(response);
});

// ─── Update Profile ───────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { error, value } = updateProfileValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { name, username, bio, preferences } = value;

  // Check username taken
  if (username) {
    const existingUser = await User.findOne({
      username,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...(name && { name }),
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(preferences && { preferences }),
      },
    },
    { new: true, runValidators: true }
  ).select("-password -passwordResetToken -passwordResetExpiry -__v");

  const response = new ApiResponse(200, "Profile updated successfully", {
    user: updatedUser,
  });

  res.status(200).json(response);
});

// ─── Upload Avatar ────────────────────────────────────────
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  // Upload to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "shoptogether/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { format: "webp" },
        ],
      },
      (error, result) => {
        if (error) reject(new ApiError(500, "Image upload failed"));
        else resolve(result);
      }
    );

    stream.end(req.file.buffer);
  });

  // Update user avatar
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadResult.secure_url },
    { new: true }
  ).select("-password -__v");

  const response = new ApiResponse(200, "Avatar uploaded successfully", {
    user,
    avatar: uploadResult.secure_url,
  });

  res.status(200).json(response);
});

// ─── Change Password ──────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { error, value } = changePasswordValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { currentPassword, newPassword } = value;

  // Get user with password
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  const response = new ApiResponse(200, "Password changed successfully");

  res.status(200).json(response);
});

// ─── Get Saved Products ───────────────────────────────────
export const getSavedProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("savedProducts")
    .select("savedProducts");

  const response = new ApiResponse(200, "Saved products fetched", {
    savedProducts: user.savedProducts,
  });

  res.status(200).json(response);
});

// ─── Get Room History ─────────────────────────────────────
export const getRoomHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "roomsJoined",
      select: "name code type status createdAt",
    })
    .populate({
      path: "roomsCreated",
      select: "name code type status createdAt",
    })
    .select("roomsJoined roomsCreated");

  const response = new ApiResponse(200, "Room history fetched", {
    roomsJoined: user.roomsJoined,
    roomsCreated: user.roomsCreated,
  });

  res.status(200).json(response);
});

// ─── Delete Account ───────────────────────────────────────
export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    isActive: false,
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  const response = new ApiResponse(200, "Account deleted successfully");

  res.status(200).json(response);
});