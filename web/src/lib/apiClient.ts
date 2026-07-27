/**
 * Centralized fetch wrapper.
 *
 * - Attaches the Bearer JWT to every request.
 * - On 401, transparently refreshes the session and retries the
 *   original request once.
 * - Concurrent 401s share a single in-flight refresh (the refresh
 *   token rotates on each use, so firing multiple refreshes at once
 *   would invalidate each other and cause cascading failures).
 * - If the refresh itself fails, the session is cleared and the
 *   user is redirected to login.
 */

import { getJwt, getRefreshToken, setSession, clearSession } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Shared in-flight refresh promise. When null, no refresh is running.
let refreshPromise: Promise<string | null> | null = null;

/**
 * Calls POST /api/auth/refresh with the stored refresh token.
 * On success, saves the new jwt + refreshToken and returns the new jwt.
 * On failure, clears the session and returns null.
 *
 * Wrapped so that concurrent callers all await the SAME promise
 * instead of each triggering their own refresh call.
 */
async function refreshSession(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearSession();
        return null;
      }

      const data = await response.json();
      // The refresh token rotates on every use — both values must
      // be overwritten, or the next refresh attempt will fail.
      setSession(data.jwt, data.refreshToken);
      return data.jwt as string;
    } catch {
      clearSession();
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    // Reset so future 401s (after this one resolves) can trigger a new refresh.
    refreshPromise = null;
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Set to true to skip attaching the Bearer token (e.g. public endpoints). */
  skipAuth?: boolean;
}

/**
 * Fetch wrapper for all calls to the Strapi API.
 * Usage: apiFetch('/api/movies/search?query=inception')
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  const buildHeaders = (): HeadersInit => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };
    if (!skipAuth) {
      const jwt = getJwt();
      if (jwt) {
        h.Authorization = `Bearer ${jwt}`;
      }
    }
    return h;
  };

  const doFetch = () =>
    fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(),
    });

  let response = await doFetch();

  if (response.status === 401 && !skipAuth) {
    const newJwt = await refreshSession();

    if (!newJwt) {
      // Refresh failed: bail out to login. Using a hard redirect
      // because this file is plain TS, not a React component —
      // it has no access to React Router's navigate().
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    // Retry the original request once, with the fresh token.
    response = await doFetch();
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.error?.message || `Request failed: ${response.status}`,
    );
  }

  // Some endpoints (e.g. DELETE /movies/:tmdbId/entry) may return
  // an empty body; guard against JSON parse errors on empty responses.
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
