import Notification from "../models/Notification.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { PAGINATION } from "../config/constants.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    unreadOnly,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  const filter = { recipient: req.user._id };
  if (unreadOnly === "true") filter.isRead = false;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("sender", "name username avatar")
      .lean(),
    Notification.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      notifications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }, "Notifications fetched successfully")
  );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, "Notification not found");
  if (notification.recipient.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this notification");
  }

  notification.isRead = true;
  await notification.save();

  return res.status(200).json(new ApiResponse(200, { notification }, "Notification marked as read"));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, "All notifications marked as read"));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, "Notification not found");
  if (notification.recipient.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this notification");
  }

  await Notification.findByIdAndDelete(notificationId);

  return res.status(200).json(new ApiResponse(200, {}, "Notification deleted"));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(new ApiResponse(200, { count }, "Unread count fetched"));
});
