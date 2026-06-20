import api from "./axios";

/* Helper: Get data from either path (handles ApiResponse quirk) */
const extractData = (response) => {
  // response.data is the axios body
  // body.message contains actual data { products, pagination }
  // body.data contains "Products fetched successfully" string
  return response.data?.message || response.data?.data || response.data;
};

export const getAllProducts = async (params = {}) => {
  const { page = 1, limit = 50, category, search, sort = "newest" } = params;

  const query = new URLSearchParams({ page, limit, sort });

  if (category && category !== "All" && category.toLowerCase() !== "all") {
    query.append("category", category.toLowerCase());
  }

  if (search) {
    query.append("search", search);
  }

  const response = await api.get(`/products?${query.toString()}`);
  return { data: extractData(response) };
};

export const getTrendingProducts = async () => {
  const response = await api.get("/products/trending");
  return { data: extractData(response) };
};

export const getRoomProducts = async (roomId) => {
  const response = await api.get(`/products/room/${roomId}`);
  return { data: extractData(response) };
};

export const shareProductToRoom = async (productId, roomId) => {
  const response = await api.post(`/products/${productId}/share/${roomId}`);
  return { data: extractData(response) };
};