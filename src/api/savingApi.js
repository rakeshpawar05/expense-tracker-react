import axiosInstance from "./Axios";

export const createSaving = async (saving) =>
  await axiosInstance.post("/savings", saving);

export const getSavings = async (params) =>
  await axiosInstance.get("/savings", { params });

export const updateSaving = async (id, saving) =>
  await axiosInstance.put(`/savings/${id}`, saving);

export const deleteSaving = async (id) =>
  await axiosInstance.delete(`/savings/${id}`);
