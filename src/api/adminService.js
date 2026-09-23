import api from "./axiosConfig";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAdminGardens = async (size = 100) => {
  const response = await api.get(`/admin/gardens?size=${size}`);
  return response.data;
};

export const getAdminProducts = async (size = 100) => {
  const response = await api.get(`/admin/products?size=${size}`);
  return response.data;
};

export const toggleUserBlock = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/toggle-block`);
  return response.data;
};

export const searchAdminUsers = async (query) => {
  const response = await api.get(`/admin/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getAdminUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateAdminGardenStatus = async (gardenId, status) => {
  const response = await api.put(`/admin/gardens/${gardenId}/status?status=${status}`);
  return response.data;
};
