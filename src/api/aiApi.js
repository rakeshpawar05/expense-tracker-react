import apiClient from './client';

export const sendAiChat = async (userId, message) => {
  return await apiClient.post('/ai/chat', { userId, message });
};
