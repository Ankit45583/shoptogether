import api from "./axios";

const extractData = (response) => {
  return response.data?.message || response.data?.data || response.data;
};

/* Get user profile */
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/profile/${username}`);
  return { data: extractData(response) };
};

/* Get saved products */
export const getSavedProducts = async () => {
  const response = await api.get("/users/saved-products");
  return { data: extractData(response) };
};

/* Get room history */
export const getRoomHistory = async () => {
  const response = await api.get("/users/room-history");
  return { data: extractData(response) };
};