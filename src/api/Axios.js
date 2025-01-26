import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Base URL for the backend
  headers: {
    "Content-Type": "application/json", // Specify JSON format
  }
});

// Interceptor to add JWT token to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;