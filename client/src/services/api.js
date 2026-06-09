import axios from "axios";
import { notifySiteUpdate } from "../utils/liveUpdates";

function normalizeApiBaseUrl(value) {
  const raw = String(value || "").trim().replace(/\/+$/, "");

  if (!raw) {
    return import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
  }

  if (/\/api$/i.test(raw)) {
    return raw;
  }

  return `${raw}/api`;
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  withCredentials: true,
});

function shouldNotifyPublicRefresh(config = {}) {
  const method = String(config.method || "get").toLowerCase();
  const url = String(config.url || "");

  if (!["post", "put", "patch", "delete"].includes(method)) {
    return false;
  }

  return [/^\/?content\b/i, /^\/?facilities\b/i].some((pattern) =>
    pattern.test(url)
  );
}

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
  (response) => {
    if (shouldNotifyPublicRefresh(response.config)) {
      notifySiteUpdate("public-content");
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  }
);

export default api;
