import api from "../lib/axios";

/* ==========================================
   ROOM API
========================================== */

// Create a new room
export const createRoom = async (roomData) => {
  const response = await api.post("/rooms/create", roomData);
  return response.data;
};

// Join a room with code
export const joinRoom = async (code) => {
  const response = await api.post("/rooms/join", { code });
  return response.data;
};

// Get my rooms
export const getMyRooms = async () => {
  const response = await api.get("/rooms/my-rooms");
  return response.data;
};

// Get public rooms (with pagination)
export const getPublicRooms = async (page = 1, limit = 20) => {
  const response = await api.get(`/rooms/public?page=${page}&limit=${limit}`);
  return response.data;
};

// Get room by ID
export const getRoomById = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};

// Update room (host only)
export const updateRoom = async (roomId, updateData) => {
  const response = await api.put(`/rooms/${roomId}`, updateData);
  return response.data;
};

// Leave room
export const leaveRoom = async (roomId) => {
  const response = await api.post(`/rooms/${roomId}/leave`);
  return response.data;
};

// Remove member from room (host only)
export const removeMember = async (roomId, userId) => {
  const response = await api.post(`/rooms/${roomId}/remove-member`, { userId });
  return response.data;
};

// Close room (host only)
export const closeRoom = async (roomId) => {
  const response = await api.post(`/rooms/${roomId}/close`);
  return response.data;
};
export const getSharedProducts = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}/shared-products`);
  // Backend returns: { statusCode, success, message: { products }, data: "..." }
  // We need to extract from message field
  const data = response.data?.message || response.data?.data || response.data;
  return { data };
};
