import axiosInstance from "./Axios";

// core authentication and user helpers
export const loginApi = async (AuthRequest) =>
  await axiosInstance.post("/auth/login", AuthRequest);

export const registerApi = async (UserDetails) =>
  await axiosInstance.post(`/auth/register`, UserDetails);

export const getFullUser = async (userId) =>
  await axiosInstance.get(`/users/${userId}`);

export const isServiceActive = async () =>
  await axiosInstance.get("/auth/isActive");