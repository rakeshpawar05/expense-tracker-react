import axiosInstance from "./Axios";

export const createExpense = async (expense) =>
  await axiosInstance.post("/expenses", expense);

// Standard expense list with optional filters
export const getExpenses = async (params) =>
  await axiosInstance.get("/expenses", { params });

export const getTop5Expenses = async (userId, yearMonth) =>
  await axiosInstance.get(`/expenses/top5`, { params: { userId, yearMonth } });

export const updateExpense = async (id, expense) =>
  await axiosInstance.put(`/expenses/${id}`, expense);

export const deleteExpense = async (id) =>
  await axiosInstance.delete(`/expenses/${id}`);
