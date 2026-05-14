import axios from "axios";

/**
 * Expected env:
 * VITE_API_URL = https://your-backend.onrender.com/api
 */
const API_BASE = import.meta.env.VITE_API_URL;

// Fail fast if env is missing (helps avoid silent 404s)
if (!API_BASE) {
  console.error("❌ VITE_API_URL is not defined in environment variables");
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach admin token automatically (if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global error handler (useful for debugging production issues)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.warn(
        "❌ Network error: backend not reachable or CORS/network issue",
        error.message
      );
    } else {
      console.warn(
        `❌ API error: ${error.response.status} ${error.config?.url}`
      );
    }

    return Promise.reject(error);
  }
);

export default api;