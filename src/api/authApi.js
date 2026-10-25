import apiClient from './client';

export const loginApi = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

export const registerApi = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

export const isServiceActiveApi = async () => {
  return await apiClient.get('/auth/isActive');
};
