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
 *   - Announcing session expiry (via a DOM event) when refresh itself fails
 *
 * Individual services must NOT handle any of the above. They focus purely on
 * business-level operations (what to call, what to send, what to return).
 *
 * IMPORTANT — no unilateral navigation:
 * This module never calls `window.location.href` itself. A shared HTTP
 * client redirecting the whole page on any 401, from any screen, races
 * against — and silently destroys — component-level error handling (e.g. a
 * multi-step form that wants to show "session expired, try again" inline
 * instead of being yanked back to "/"). Instead, on unrecoverable session
 * expiry this module dispatches a `SESSION_EXPIRED_EVENT` on `window` and
 * rejects the promise as normal. Callers decide what to do:
 *   - A component with its own error UI (e.g. ProfileSetup) can just handle
 *     the rejected promise and ignore the event entirely.
 *   - A top-level auth listener (e.g. in your app shell / router) can listen
 *     for the event and redirect *only* on routes that have no inline
 *     handling of their own.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authClient, REFRESH_ENDPOINT } from "./authClient";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error(
    "[apiClient] VITE_API_URL is not defined. " +
      "Add it to your .env file: VITE_API_URL=https://your-backend-com",
  );
}

// ---------------------------------------------------------------------------
// Session-expiry event
//
// Dispatched on `window` whenever a token refresh fails with a genuine
// "session is gone" response (401/403). Nothing in this module decides what
// the UI should do about that — it just announces the fact. Listen for it
// wherever you want app-wide behavior:
//
//   window.addEventListener(SESSION_EXPIRED_EVENT, () => {
//     if (!isOnScreenWithOwnErrorHandling()) {
//       window.location.href = "/";
//     }
//   });
// ---------------------------------------------------------------------------

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

const announceSessionExpired = (): void => {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};

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
    //    Propagate the error so the caller's own error handling can fire.

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
      // requests so each caller's own error handling (inline UI, toast,
      // form state, etc.) can take over.
      processQueue(refreshError as AxiosError);

      // Only announce "session expired" for genuine auth failures (401/403),
      // not transient network errors — a dropped connection shouldn't be
      // treated the same as an invalid/expired refresh token.
      const isSessionExpired =
        axios.isAxiosError(refreshError) &&
        (refreshError.response?.status === 401 ||
          refreshError.response?.status === 403);

      if (isSessionExpired) {
        // No navigation here. Dispatch the event and let the app decide —
        // a component mid-flow (e.g. a multi-step onboarding form) may want
        // to show its own "session expired, try again" state instead of
        // being hard-redirected out from under the user.
        announceSessionExpired();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
