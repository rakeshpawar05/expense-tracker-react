import apiClient from './client';

export const searchExpenses = async (params) => {
  return await apiClient.get('/expenses', { params });
};

export const getExpenseFeedPaginated = async (params) => {
  return await apiClient.get('/expenses/feed/paginated', { params });
};

export const getTop5Expenses = async (userId, yearMonth) => {
  return await apiClient.get('/expenses/top5', {
    params: { userId, yearMonth },
  });
};

export const createExpense = async (expenseData) => {
  return await apiClient.post('/expenses', expenseData);
};

export const updateExpense = async (id, expenseData) => {
  return await apiClient.put(`/expenses/${id}`, expenseData);
};

export const deleteExpense = async (id) => {
  return await apiClient.delete(`/expenses/${id}`);
};
