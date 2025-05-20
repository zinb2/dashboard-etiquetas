import { clientEnv } from "./env"

/**
 * Creates an absolute URL from a relative path
 * @param path - The relative path (e.g., "/api/auth/login")
 * @returns The absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  // Remove leading slash if present in both base and path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const baseUrl = clientEnv.APP_URL?.endsWith("/") ? clientEnv.APP_URL.slice(0, -1) : clientEnv.APP_URL

  return `${baseUrl}${normalizedPath}`
}
