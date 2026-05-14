import axios from "axios";

/**
 * Backend mounts routes under `/api` (e.g. GET /api/menu, GET /api/categories).
 * If VITE_API_URL is only the origin (no `/api`), requests become `/menu` and return 404.
 */
function normalizeApiBase(raw) {
  const v = String(raw ?? "").trim();
  if (!v) return "/api";
  const noTrail = v.replace(/\/+$/, "");
  if (/\/api$/i.test(noTrail)) return noTrail;
  if (noTrail === "api") return "/api";
  return `${noTrail}/api`;
}

const baseURL = normalizeApiBase(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.warn(
        "[api] No response (network/CORS/backend down):",
        error.message,
        error.config?.baseURL && error.config?.url
          ? `→ ${error.config.baseURL.replace(/\/$/, "")}${error.config.url}`
          : ""
      );
    } else if (error.response.status === 404) {
      console.warn(
        "[api] 404 — check VITE_API_URL ends with /api and backend is running.",
        error.config?.baseURL && error.config?.url
          ? `→ ${error.config.baseURL.replace(/\/$/, "")}${error.config.url}`
          : ""
      );
    } else {
      console.warn(`[api] ${error.response.status}`, error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;
