import axios from "axios";

/**
 * Production base must end with `/api` because routes live at `/api/menu`, etc.
 * If `VITE_API_URL` is set without `/api` (common mistake), append it.
 */
function normalizeProductionApiBase(raw) {
  if (raw == null || typeof raw !== "string") return "/api";
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (trimmed === "" || trimmed === "/api") return "/api";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

// In dev, always use same-origin `/api` so Vite can proxy to the backend. A full URL like
// `http://localhost:5000/api` breaks when you open the app from another device (phone/LAN).
const baseURL = import.meta.env.DEV ? "/api" : normalizeProductionApiBase(import.meta.env.VITE_API_URL);

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
