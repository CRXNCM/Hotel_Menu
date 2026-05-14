/**
 * Menu images are stored as `/uploads/...` on the API host. In dev, Vite proxies
 * `/uploads` to the backend; in production (e.g. Vercel) we prefix the API origin.
 */
export function resolveMediaUrl(path) {
  if (!path || typeof path !== "string") return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/uploads")) return path;
  if (import.meta.env.DEV) return path;

  const apiBase = import.meta.env.VITE_API_URL || "";
  if (!apiBase.startsWith("http")) return path;

  const origin = new URL(apiBase).origin;
  return `${origin}${path}`;
}
