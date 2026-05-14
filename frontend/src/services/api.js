import axios from "axios";

// In dev, always use same-origin `/api` so Vite can proxy to the backend. A full URL like
// `http://localhost:5000/api` breaks when you open the app from another device (phone/LAN).
const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV && !error.response) {
      console.warn(
        "[api] Request failed before a response (often: API not running, MongoDB down, or wrong URL).",
        "Start backend from the `backend` folder (port 5000) and ensure MongoDB is up.",
        error.config?.url ? `→ ${error.config.baseURL || ""}${error.config.url}` : ""
      );
    }
    return Promise.reject(error);
  }
);

export default api;
