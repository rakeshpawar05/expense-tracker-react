import axiosInstance from "./Axios";

// wrapper for the backend dashboard/complete endpoint
export const getDashboardData = async ({ userId, monthName }) => {
  return await axiosInstance.get("/dashboard/complete", { params: { userId, monthName } });
};
