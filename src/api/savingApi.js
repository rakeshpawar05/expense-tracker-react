import apiClient from './client';

export const getSavingsApi = async (userId, yearMonth, categoryName, savingName) => {
  return await apiClient.get('/savings', {
    params: { userId, yearMonth, categoryName, savingName },
  });
};

export const getTop5SavingsApi = async (userId, yearMonth) => {
  return await apiClient.get('/savings/top5', {
    params: { userId, yearMonth },
  });
};

export const createSavingApi = async (savingData) => {
  return await apiClient.post('/savings', savingData);
};

export const updateSavingApi = async (id, savingData) => {
  return await apiClient.put(`/savings/${id}`, savingData);
};

export const deleteSavingApi = async (id) => {
  return await apiClient.delete(`/savings/${id}`);
};
