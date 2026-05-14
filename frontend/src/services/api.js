import axios from "axios";
import { describeApiError, logApiError } from "../utils/apiErrors";

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
    logApiError("response", error);

    const enriched = error;
    try {
      const { message, detail } = describeApiError(error);
      enriched.userMessage = message;
      enriched.userDetail = detail;
    } catch {
      /* ignore */
    }

    return Promise.reject(enriched);
  }
);

export default api;
