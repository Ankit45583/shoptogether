import api from "../lib/axios";

/* ==========================================
   MESSAGE API
========================================== */

// Get messages of a room
export const getRoomMessages = async (roomId, page = 1, limit = 50) => {
  const response = await api.get(
    `/rooms/${roomId}/messages?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Send message (REST fallback - socket use karenge mostly)
export const sendMessage = async (roomId, messageData) => {
  const response = await api.post(`/rooms/${roomId}/messages`, messageData);
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/rooms/messages/${messageId}`);
  return response.data;
};

// Add reaction
export const addReaction = async (messageId, emoji) => {
  const response = await api.post(
    `/rooms/messages/${messageId}/reaction`,
    { emoji }
  );
  return response.data;
};

// Remove reaction
export const removeReaction = async (messageId) => {
  const response = await api.delete(`/rooms/messages/${messageId}/reaction`);
  return response.data;
};