import api from "./axiosConfig";

export const createReservation = async (gardenerId, reservationData) => {
  const response = await api.post(`/reservations?gardenerId=${gardenerId}`, reservationData);
  return response.data;
};

export const updateReservationStatus = async (reservationId, ownerId, status) => {
  const response = await api.put(`/reservations/${reservationId}/status?ownerId=${ownerId}&status=${status}`);
  return response.data;
};

export const getReservationsByGardener = async (gardenerId) => {
  const response = await api.get(`/reservations/gardener/${gardenerId}`);
  return response.data;
};

export const getReservationRequestsForOwner = async (ownerId) => {
  const response = await api.get(`/reservations/owner/${ownerId}/requests`);
  return response.data;
};
