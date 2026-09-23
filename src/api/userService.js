import api from "./axiosConfig";

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};
