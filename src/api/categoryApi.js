import apiClient from './client';

export const getCategoriesApi = async (userId, yearMonth) => {
  return await apiClient.get('/categories', { params: { userId, yearMonth } });
};

export const createCategoryApi = async (categoryData) => {
  return await apiClient.post('/categories', categoryData);
};

export const deleteCategoryApi = async (id) => {
  return await apiClient.delete(`/categories/${id}`);
};
