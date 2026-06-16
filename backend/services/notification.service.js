import Notification from "../models/Notification.model.js";
import logger from "../utils/logger.js";

/**
 * Creates a notification and optionally emits it via socket.
 * @param {Object} options
 * @param {string} options.recipient - User ID of the recipient
 * @param {string} [options.sender] - User ID of the sender
 * @param {string} options.type - Notification type from NOTIFICATION_TYPES
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} [options.data] - Additional data { roomId, productId, messageId }
 * @param {Object} [options.io] - Socket.io instance for real-time delivery
 * @returns {Promise<Notification>}
 */
export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  data = {},
  io,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      data,
    });

    const populated = await Notification.findById(notification._id)
      .populate("sender", "name username avatar")
      .lean();

    if (io) {
      io.to(`user:${recipient.toString()}`).emit("notification:new", populated);
    }

    return populated;
  } catch (error) {
    logger.error("Failed to create notification:", error.message);
    // Non-fatal — don't throw, just log
    return null;
  }
};
