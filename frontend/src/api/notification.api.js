import api from "./axios";

const extractData = (response) => {
  return response.data?.message || response.data?.data || response.data;
};

/* Get all notifications */
export const getNotifications = async (params = {}) => {
  const { page = 1, limit = 20, unreadOnly = false } = params;
  const query = new URLSearchParams({ page, limit });
  if (unreadOnly) query.append("unreadOnly", "true");
  
  const response = await api.get(`/notifications?${query}`);
  return { data: extractData(response) };
};

/* Get unread count */
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return { data: extractData(response) };
};

/* Mark single as read */
export const markAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return { data: extractData(response) };
};

/* Mark all as read */
export const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return { data: extractData(response) };
};

/* Delete notification */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return { data: extractData(response) };
};