import apiClient from './client';

export const getEventsApi = async (userId) => {
  return await apiClient.get('/events', { params: { userId } });
};

export const createEventApi = async (eventData) => {
  return await apiClient.post('/events', eventData);
};

export const updateEventApi = async (id, eventData) => {
  return await apiClient.put(`/events/${id}`, eventData);
};

export const deleteEventApi = async (id) => {
  return await apiClient.delete(`/events/${id}`);
};
