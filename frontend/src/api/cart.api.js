import api from "./axios";

const extractData = (response) => {
  return response.data?.message || response.data?.data || response.data;
};

export const getGroupCart = async (roomId) => {
  const response = await api.get(`/cart/${roomId}`);
  return { data: extractData(response) };
};

export const addToGroupCart = async (roomId, { productId, quantity = 1, note }) => {
  const response = await api.post(`/cart/${roomId}`, {
    productId,
    quantity,
    ...(note && { note }),
  });
  return { data: extractData(response) };
};

export const removeFromGroupCart = async (roomId, productId) => {
  const response = await api.delete(`/cart/${roomId}/item/${productId}`);
  return { data: extractData(response) };
};

export const clearGroupCart = async (roomId) => {
  const response = await api.delete(`/cart/${roomId}`);
  return { data: extractData(response) };
};