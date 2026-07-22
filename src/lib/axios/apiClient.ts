/**
 * apiClient.ts
 *
 * The single, authenticated Axios instance for all application API calls.
 *
 * Responsibilities of this module (and this module alone):
 *   - Attaching credentials (HttpOnly cookie sent automatically by the browser)
 *   - Detecting 401 Unauthorized responses
 *   - Refreshing the access token via the isolated `authClient`
 *   - Retrying the original failed request after a successful refresh
 *   - Queuing concurrent requests that arrive during an in-flight refresh
 *   - Logging the user out (redirecting to "/") when the refresh itself fails
 *
 * Individual services must NOT handle any of the above. They focus purely on
 * business-level operations (what to call, what to send, what to return).
 */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { authClient, REFRESH_ENDPOINT } from "./authClient";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error(
    "[apiClient] VITE_API_URL is not defined. " +
    "Add it to your .env file: VITE_API_URL=https://your-backend-com"
  );
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Browser sends HttpOnly access-token cookie automatically.
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Refresh-queue state
//
// `isRefreshing`:  Guards against multiple simultaneous refresh calls.
//                  If Request A triggers a refresh, Requests B, C, D that
//                  also 401 while the refresh is in-flight are parked in
//                  `failedQueue` and replayed once the refresh settles.
//
// `failedQueue`:   Each entry holds a Promise resolver pair. After the refresh
//                  succeeds (or fails), `processQueue` resolves or rejects
//                  every parked promise, which then retries (or aborts) the
//                  original request.
// ---------------------------------------------------------------------------

let isRefreshing = false;

type QueueEntry = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: QueueEntry[] = [];

/**
 * Drains the failed-request queue after a refresh attempt.
 *
 * @param error - Pass `null` on success; pass the AxiosError on failure.
 */
const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve();
    }
  });

  failedQueue = [];
};

// ---------------------------------------------------------------------------
// Request interceptor
//
// With HttpOnly cookies the browser attaches the access token automatically.
// No manual header manipulation is needed here. The interceptor is included
// as the correct extension point for future concerns (e.g. request IDs,
// per-request timeouts, analytics tagging).
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: unknown) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor — 401 detection, token refresh, and retry
// ---------------------------------------------------------------------------

/**
 * Extend InternalAxiosRequestConfig to carry our retry sentinel so TypeScript
 * does not complain about an unknown property on the config object.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  // ── Success path ──────────────────────────────────────────────────────────
  (response) => response,

  // ── Error path ────────────────────────────────────────────────────────────
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    // ── Early exits ───────────────────────────────────────────────────────
    //
    // 1. If the error is not 401, propagate immediately — the service layer
    //    or React Query should handle 4xx/5xx business errors.
    //
    // 2. If `_retry` is already set, this request has already been replayed
    //    once after a refresh. Retrying again would risk an infinite loop.
    //    Propagate the error so the logout path can fire.

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // ── Queue concurrent 401s ─────────────────────────────────────────────
    //
    // If a refresh is already in-flight, park this request in `failedQueue`.
    // When `processQueue(null)` is called, the promise below resolves and the
    // request is retried against the (now refreshed) session.

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        originalRequest._retry = true; // prevent re-entry for queued requests
        return apiClient(originalRequest);
      });
    }

    // ── Initiate token refresh ────────────────────────────────────────────

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Uses the isolated `authClient` so that a 401 from the refresh
      // endpoint does NOT re-enter this interceptor.
      await authClient.post(REFRESH_ENDPOINT);

      // Refresh succeeded — unblock every queued request.
      processQueue(null);

      // Replay the original request with the newly set access-token cookie.
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed (invalid/expired refresh token) — reject all queued
      // requests and force the user back to the login page.
      processQueue(refreshError as AxiosError);

      // Only redirect to login if the session is genuinely expired (401 or 403)
      // to avoid logging out users on transient network errors.
      const isSessionExpired =
        axios.isAxiosError(refreshError) &&
        (refreshError.response?.status === 401 ||
          refreshError.response?.status === 403);

      if (isSessionExpired) {
        // Hard redirect clears in-memory state and forces a clean re-auth.
        window.location.href = "/";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
