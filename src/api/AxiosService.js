import axiosInstance from "./Axios";

// User API calls
// export const login = async (credentials) => {
//   console.log("calling...")
//   const response = await axiosInstance.post("/auth/login", credentials);
//   console.log("token "+ response.data)
//   return response.data; // Contains token and other data
// };

export const login = async (AuthRequest) => await axiosInstance.post("/auth/login", AuthRequest);

export const getAmount = async (monthId) => await axiosInstance.get(`/months/${monthId}/amount`)

export const registerApi = async (UserDetails) => await axiosInstance.post(`/auth/register`, UserDetails)