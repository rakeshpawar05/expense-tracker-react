import axiosInstance from "./Axios";

// User API calls
// export const login = async (credentials) => {
//   console.log("calling...")
//   const response = await axiosInstance.post("/auth/login", credentials);
//   console.log("token "+ response.data)
//   return response.data; // Contains token and other data
// };

export const loginApi = async (AuthRequest) => await axiosInstance.post("/auth/login", AuthRequest);

export const getAmountApi = async (monthId) => await axiosInstance.get(`/months/${monthId}/amount`)

export const registerApi = async (UserDetails) => await axiosInstance.post(`/auth/register`, UserDetails)

export const getMonthNamesApi = async (userId) => await axiosInstance.get(`/months/${userId}/getNames`)

export const getMonthsApi = async (userId) => await axiosInstance.get(`/months`, {params:{userId: userId}});

export const getMonthByName = async(monthName) => await axiosInstance.get(`/months/name`, {params:{monthName: monthName}})

export const getTop5Expenses = async(monthName) => await axiosInstance.get(`/expenses/top5`, {params:{monthName: monthName}})

export const createMonthApi = async(month) => await axiosInstance.post("/months", month);

export const updateMonthApi = async(id, month) => await axiosInstance.put(`/months/${id}`, month)

export const deleteMonthApi = async (id) => await axiosInstance.delete(`/months/${id}`);

export const createExpenseApi = async(expense) => await axiosInstance.post("/expenses", expense);

export const getExpenseApi = async(params) => await axiosInstance.get("/expenses", {params: params})

export const updateExpenseApi = async(id, expense) => await axiosInstance.put(`/expenses/${id}`, expense)

export const deleteExpenseApi = async (id) => await axiosInstance.delete(`/expenses/${id}`);

export const getCategoriesApi = async(monthName) => await axiosInstance.get("/categories", {params:{monthName: monthName}});