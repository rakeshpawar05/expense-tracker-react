import apiClient from './client';

export const getDashboardComplete = async (userId, yearMonth) => {
  return await apiClient.get('/dashboard/complete', {
    params: { userId, yearMonth },
  });
};
