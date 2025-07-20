import axiosInstance from "./Axios";

// User API calls
// export const login = async (credentials) => {
//   console.log("calling...")
//   const response = await axiosInstance.post("/auth/login", credentials);
//   console.log("token "+ response.data)
//   return response.data; // Contains token and other data
// };

export const loginApi = async (AuthRequest) => await axiosInstance.post("/auth/login", AuthRequest);

// export const getAmountApi = async (monthId) => await axiosInstance.get(`/months/${monthId}/amount`)

export const registerApi = async (UserDetails) => await axiosInstance.post(`/auth/register`, UserDetails)

export const getFullUser = async(userId) => await axiosInstance.get(`/users/${userId}`) 

export const getMonthNamesApi = async (userId) => await axiosInstance.get(`/months/getNames`, {params:{userId: userId}})

export const getMonthsApi = async (userId) => await axiosInstance.get(`/months`, {params:{userId: userId}});

// export const getMonthByName = async(monthName) => await axiosInstance.get(`/months/name`, {params:{monthName: monthName}})

export const getTop5Expenses = async(userId, monthName) => await axiosInstance.get(`/expenses/top5`, {params:{monthName: monthName, userId: userId}})

export const createMonthApi = async(month) => await axiosInstance.post("/months", month);

export const updateMonthApi = async(id, month) => await axiosInstance.put(`/months/${id}`, month)

export const deleteMonthApi = async (id) => await axiosInstance.delete(`/months/${id}`);

export const createExpenseApi = async(expense) => await axiosInstance.post("/expenses", expense);

export const getExpenseApi = async(params) => await axiosInstance.get("/expenses", {params: params})

export const updateExpenseApi = async(id, expense) => await axiosInstance.put(`/expenses/${id}`, expense)

export const deleteExpenseApi = async (id) => await axiosInstance.delete(`/expenses/${id}`);

export const createCategoryApi = async(category) => await axiosInstance.post("/categories", category);

export const getCategoriesApi = async(userId, monthName) => await axiosInstance.get("/categories", {params:{monthName: monthName, userId: userId}});

export const deleteCategoryApi = async(id) => await axiosInstance.delete(`/categories/${id}`);

export const createEventApi = async(event) => await axiosInstance.post("/events", event);

export const getEventsApi = async(userId) => await axiosInstance.get("/events", {params:{userId: userId}});

export const deleteEventApi = async(id) => await axiosInstance.delete(`/events/${id}`);

export const isServiceActive = async() => await axiosInstance.get("/auth/isActive");

export const createSavingApi = async(saving) => await axiosInstance.post("/savings", saving);

export const getSavingApi = async(params) => await axiosInstance.get("/savings", {params: params})

export const updateSavingApi = async(id, saving) => await axiosInstance.put(`/savings/${id}`, saving)

export const deleteSavingApi = async (id) => await axiosInstance.delete(`/savings/${id}`);