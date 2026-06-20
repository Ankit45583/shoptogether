import api from "./axios";

const extractData = (response) => {
  return response.data?.message || response.data?.data || response.data;
};

export const getAIRecommendations = async (roomId) => {
  const response = await api.post(`/ai/recommendations/${roomId}`);
  return { data: extractData(response) };
};

export const analyzeRoomMood = async (roomId) => {
  const response = await api.get(`/ai/mood/${roomId}`);
  return { data: extractData(response) };
};

export const getRoomSummary = async (roomId) => {
  const response = await api.get(`/ai/summary/${roomId}`);
  return { data: extractData(response) };
};

export const getPastRecommendations = async (roomId) => {
  const response = await api.get(`/ai/history/${roomId}`);
  return { data: extractData(response) };
};