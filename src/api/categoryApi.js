import axiosInstance from "./Axios";

export const createCategory = async (category) =>
  await axiosInstance.post("/categories", category);

export const getCategories = async (userId, monthName) =>
  await axiosInstance.get("/categories", { params: { monthName, userId } });

export const deleteCategory = async (id) =>
  await axiosInstance.delete(`/categories/${id}`);
