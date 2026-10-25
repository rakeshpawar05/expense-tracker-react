import apiClient from './client';

export const getSubscriptionsApi = async ({ userId, yearMonth }) => {
  return await apiClient.get('/subscriptions', {
    params: { userId, yearMonth },
  });
};

export const createSubscriptionApi = async (subscriptionData) => {
  return await apiClient.post('/subscriptions', subscriptionData);
};

export const updateSubscriptionApi = async (id, subscriptionData) => {
  return await apiClient.put(`/subscriptions/${id}`, subscriptionData);
};

export const deleteSubscriptionApi = async (id, userId) => {
  return await apiClient.delete(`/subscriptions/${id}`, {
    params: { userId },
  });
};

export const toggleSubscriptionStatusApi = async (id, userId) => {
  return await apiClient.patch(`/subscriptions/${id}/toggle-status`, null, {
    params: { userId },
  });
};

export const logSubscriptionExpenseApi = async (id, { userId, yearMonth }) => {
  return await apiClient.post(`/subscriptions/${id}/log`, null, {
    params: { userId, yearMonth },
  });
};
