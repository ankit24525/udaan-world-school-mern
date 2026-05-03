import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ no fallback needed in production
  withCredentials: true,
});

// 🔐 Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  }
);

export default api;