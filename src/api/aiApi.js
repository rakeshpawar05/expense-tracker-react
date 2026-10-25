import apiClient from './client';

export const sendAiChat = async (userId, message) => {
  return await apiClient.post('/ai/chat', { userId, message });
};

export const getMonthlyAiInsight = async (userId, yearMonth) => {
  return await apiClient.get('/ai/monthly-insight', {
    params: { userId, yearMonth },
  });
};

export const parseExpenseTextApi = async ({ userId, text, defaultDate, yearMonth }) => {
  return await apiClient.post('/ai/parse-expense', {
    userId,
    text,
    defaultDate,
    yearMonth,
  });
};

export const getCategoryAiInsight = async ({ userId, categoryId, categoryName, yearMonth }) => {
  return await apiClient.get('/ai/category-insight', {
    params: { userId, categoryId, categoryName, yearMonth },
  });
};

export const getEventAiInsight = async ({ userId, eventId, eventName }) => {
  return await apiClient.get('/ai/event-insight', {
    params: { userId, eventId, eventName },
  });
};

export const getMonthDeltaAiInsight = async ({ userId, yearMonth, compareYearMonth }) => {
  return await apiClient.get('/ai/month-delta', {
    params: { userId, yearMonth, compareYearMonth },
  });
};
