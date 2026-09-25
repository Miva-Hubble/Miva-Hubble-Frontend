/**
 * authService.ts
 *
 * Responsible for authentication business operations only:
 *   - Initiating the Google OAuth redirect
 *   - Triggering a server-side logout
 *
 * HTTP transport, cookie handling, and error recovery are entirely delegated
 * to `apiClient`. This service has no knowledge of tokens, cookies, or retry
 * logic.
 */

import axios from "axios";
import { apiClient } from "../lib/axios/apiClient";
import { authClient } from "../lib/axios/authClient";
import type { User } from "../types/user";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InitiateAuthResponse {
  success: boolean;
  authUrl: string;
}

interface GetCurrentUserResponse {
  success: boolean;
  user: User;
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const authService = {
  /**
   * Fetches the Google OAuth redirect URL from the backend and navigates
   * the browser to it. The backend response must contain `{ success, authUrl }`.
   *
   * Bypasses the auth interceptors by using the public `authClient`.
   * Errors are propagated to the caller — do not swallow them here so that
   * the UI can display a meaningful error state.
   */
  /**
   * Validates the current session cookie and returns the authenticated user.
   * Throws `UnauthorizedError` when the session is missing or invalid.
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const { data } = await apiClient.get<GetCurrentUserResponse>(
        "/api/user/me",
      );

      if (data.success && data.user) {
        return data.user;
      }

      throw new UnauthorizedError("Failed to fetch authenticated user.");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        throw new UnauthorizedError(
          error.response.data?.error ?? "Unauthorized",
        );
      }

      throw error;
    }
  },

  initiateAuth: async (): Promise<void> => {
    const { data } = await authClient.get<InitiateAuthResponse>(
      "/api/auth/google",
    );

    if (data.success && data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      // Backend returned 200 but the payload is malformed — treat as an
      // operational error so the UI can respond appropriately.
      throw new Error("Authentication failed: no redirect URL received.");
    }
  },

  /**
   * Instructs the backend to invalidate the current session (clear the
   * HttpOnly refresh-token cookie), then redirects to the landing page.
   *
   * The redirect happens in the finally block so it always fires regardless
   * of whether the server-side logout request succeeds — ensuring the user
   * is never left in a stuck state on the client.
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      window.location.href = "/";
    }
  },
};