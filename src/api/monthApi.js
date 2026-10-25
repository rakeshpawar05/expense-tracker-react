import apiClient from './client';

export const getMonthNamesApi = async (userId) => {
  return await apiClient.get('/months/getNames', { params: { userId } });
};

export const getMonthsApi = async (userId, yearMonth) => {
  return await apiClient.get('/months', { params: { userId, yearMonth } });
};

export const createMonthApi = async (monthData) => {
  return await apiClient.post('/months', monthData);
};

export const updateMonthApi = async (id, monthData) => {
  return await apiClient.put(`/months/${id}`, monthData);
};

export const deleteMonthApi = async (id) => {
  return await apiClient.delete(`/months/${id}`);
};
