import axiosInstance from "./Axios";

// export names aligned with Api suffix to match previous AxiosService usage
export const getMonthNamesApi = async (userId) =>
  await axiosInstance.get(`/months/getNames`, { params: { userId } });

export const getMonthsApi = async (userId) =>
  await axiosInstance.get(`/months`, { params: { userId } });

export const createMonthApi = async (month) =>
  await axiosInstance.post("/months", month);

export const updateMonthApi = async (id, month) =>
  await axiosInstance.put(`/months/${id}`, month);

export const deleteMonthApi = async (id) =>
  await axiosInstance.delete(`/months/${id}`);
