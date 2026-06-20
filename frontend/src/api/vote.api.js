import api from "./axios";

const extractData = (response) => {
  return response.data?.message || response.data?.data || response.data;
};

export const castVote = async ({ productId, roomId, type }) => {
  const response = await api.post("/votes", { productId, roomId, type });
  return { data: extractData(response) };
};

export const getRoomVotes = async (roomId) => {
  const response = await api.get(`/votes/room/${roomId}`);
  return { data: extractData(response) };
};

export const getVoteSummary = async (roomId) => {
  const response = await api.get(`/votes/room/${roomId}/summary`);
  return { data: extractData(response) };
};