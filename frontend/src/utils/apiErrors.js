/**
 * Build the full URL axios would request (for logs / support).
 */
export function buildRequestUrl(config) {
  if (!config) return "";
  const base = String(config.baseURL || "").replace(/\/+$/, "");
  const path = String(config.url || "");
  if (!path) return base || "";
  const pathClean = path.startsWith("/") ? path : `/${path}`;
  if (!base) return pathClean;
  return `${base}${pathClean}`;
}

/**
 * Human-readable summary + technical detail block for UI / console.
 */
export function describeApiError(error) {
  const config = error?.config;
  const reqUrl = buildRequestUrl(config);
  const method = (config?.method || "get").toUpperCase();
  const code = error?.code || "";

  if (!error?.response) {
    const isTimeout = code === "ECONNABORTED" || String(error?.message || "").toLowerCase().includes("timeout");
    const detail = [
      `${method} ${reqUrl || "(unknown URL)"}`,
      code && `Axios code: ${code}`,
      error?.message && `Message: ${error.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      message: isTimeout
        ? "The request timed out. The server may be slow or unreachable."
        : "Could not reach the API. Check that the backend is running, VITE_API_URL includes /api, and your network connection.",
      detail,
    };
  }

  const { status, statusText, data } = error.response;
  let serverMsg = "";
  if (typeof data === "string") serverMsg = data.trim();
  else if (data && typeof data.message === "string") serverMsg = data.message.trim();
  else if (data && typeof data === "object") {
    try {
      serverMsg = JSON.stringify(data);
    } catch {
      serverMsg = "";
    }
  }

  const detail = [
    `${method} ${reqUrl || "(unknown URL)"}`,
    `HTTP ${status} ${statusText || ""}`,
    serverMsg && `Response: ${serverMsg}`,
  ]
    .filter(Boolean)
    .join("\n");

  let message = serverMsg || statusText || `Request failed (${status})`;
  if (status === 404) {
    message =
      serverMsg ||
      "Not found (404). Check that the API base URL ends with /api and the route exists on the server.";
  } else if (status === 403) {
    message = serverMsg || "Forbidden (403). If this is production, add your site URL to CORS_ORIGIN on the backend.";
  } else if (status === 401) {
    message = serverMsg || "Unauthorized (401). Sign in again or check your credentials.";
  } else if (status >= 500) {
    message = serverMsg || "Server error. Please try again later.";
  }

  return { message: String(message), detail };
}

export function logApiError(scope, error) {
  const { message, detail } = describeApiError(error);
  console.error(`[api:${scope}] ${message}`);
  if (detail) console.error(`[api:${scope}] detail:\n${detail}`);
  if (error?.response?.data !== undefined) {
    console.error(`[api:${scope}] response.data:`, error.response.data);
  }
}
