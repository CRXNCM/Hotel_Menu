import axios from "axios";
import { describeApiError, logApiError } from "../utils/apiErrors";

/**
 * Backend mounts routes under `/api` (e.g. GET /api/menu, POST /api/login).
 * - If VITE_API_URL is only the origin, `/api` is appended.
 * - Fixes common Vercel mistakes: pasting `VITE_API_URL=https://...` as the *value*,
 *   or `https:/host` (one slash).
 *
 * Axios: if `url` starts with `/`, it is resolved from the host root and *replaces*
 * the baseURL path — so base `https://host/api` + get(`/menu`) wrongly becomes
 * `https://host/menu`. We always end baseURL with `/` and strip a leading `/` from
 * `config.url` in a request interceptor so `/menu` → `menu` → `.../api/menu`.
 */
function normalizeApiBase(raw) {
  let v = String(raw ?? "")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^['"]|['"]$/g, "")
    .trim();

  // Whole .env line pasted as env value in Vercel: "VITE_API_URL=https://..."
  v = v.replace(/^VITE_API_URL\s*=\s*/i, "").trim();

  // "SOME_KEY=https://..." → take URL part only
  if (/^[A-Z0-9_]+\s*=\s*https?:\/\//i.test(v)) {
    const i = v.indexOf("=");
    if (i !== -1) v = v.slice(i + 1).trim();
  }

  // Typo: https:/host → https://host
  v = v.replace(/^https:\/(?!\/)/i, "https://");
  v = v.replace(/^http:\/(?!\/)/i, "http://");

  if (!v) return "/api";

  const noTrail = v.replace(/\/+$/, "");
  if (/\/api$/i.test(noTrail)) return noTrail;
  if (noTrail === "api") return "/api";
  if (/^https?:\/\//i.test(noTrail)) return `${noTrail}/api`;
  return `${noTrail}/api`;
}

/** Trailing slash so relative paths append (axios combineURLs). */
function baseUrlWithTrailingSlash(base) {
  const b = String(base || "").trim();
  if (!b) return "/api/";
  return b.endsWith("/") ? b : `${b}/`;
}

const baseURL = baseUrlWithTrailingSlash(normalizeApiBase(import.meta.env.VITE_API_URL));

if (typeof window !== "undefined" && import.meta.env.PROD) {
  const raw = String(import.meta.env.VITE_API_URL ?? "");
  if (/VITE_API_URL\s*=/i.test(raw) || /^https:\/(?!\/)/i.test(raw) || /^http:\/(?!\/)/i.test(raw)) {
    console.warn(
      "[api] VITE_API_URL looked misconfigured; normalized to:",
      baseURL,
      "— In Vercel, set the variable value to only the API root, e.g. https://your-service.onrender.com/api"
    );
  }
}

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof config.url === "string" && config.url.startsWith("/")) {
    config.url = config.url.slice(1);
  }
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
