/**
 * authClient.ts
 *
 * A dedicated Axios instance exclusively for token-refresh requests.
 *
 * WHY a separate instance?
 * If the refresh request itself receives a 401, we must NOT let the
 * response interceptor on `apiClient` attempt to refresh again — that
 * would cause an infinite refresh loop. This isolated instance has no
 * response interceptor, so a failed refresh simply propagates the error
 * up to the caller, which then handles the logout path.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error(
    "[authClient] VITE_API_URL is not defined. " +
    "Add it to your .env file: VITE_API_URL=https://your-backend-com"
  );
}

export const REFRESH_ENDPOINT = "/api/auth/refresh";

export const authClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Browser sends HttpOnly refresh-token cookie automatically
});

