import api from "./axiosConfig";

export const createGarden = async (gardenData, ownerId) => {
  const params = new URLSearchParams();
  params.append("ownerId", ownerId);
  const response = await api.post(`/garden?${params.toString()}`, gardenData);
  return response.data;
};

export const getGardenById = async (id) => {
  const response = await api.get(`/garden/${id}`);
  return response.data;
};

export const getGardensByOwner = async (ownerId) => {
  const response = await api.get(`/garden/owner/${ownerId}`);
  return response.data;
};

export const searchGardens = async (city, minArea = 0) => {
  const response = await api.get(`/garden/search?city=${city || ''}&minArea=${minArea}`);
  return response.data;
};

export const updateGarden = async (id, gardenData) => {
  const response = await api.put(`/garden/${id}`, gardenData);
  return response.data;
};

export const updateGardenStatus = async (id, status) => {
  const response = await api.put(`/garden/${id}/status?status=${status}`);
  return response.data;
};

export const deleteGarden = async (id) => {
  const response = await api.delete(`/garden/${id}`);
  return response.data;
};
