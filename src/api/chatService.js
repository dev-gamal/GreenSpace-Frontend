import api from "./axiosConfig";

export const getChatHistory = async (user1Id, user2Id) => {
  const response = await api.get(`/chat/history?user1Id=${user1Id}&user2Id=${user2Id}`);
  return response.data;
};

export const getUnreadCount = async (userId) => {
  const response = await api.get(`/chat/unread-count?userId=${userId}`);
  return response.data;
};

export const markMessagesAsRead = async (senderId, recipientId) => {
  const response = await api.put(`/chat/mark-read?senderId=${senderId}&recipientId=${recipientId}`);
  return response.data;
};

export const getConversations = async (userId) => {
  const response = await api.get(`/chat/conversations?userId=${userId}`);
  return response.data;
};
