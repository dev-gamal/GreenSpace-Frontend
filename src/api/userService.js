import api from "./axiosConfig";

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};
