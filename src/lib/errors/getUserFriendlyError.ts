/**
 * getUserFriendlyError.ts
 *
 * Translates technical errors (Axios errors, network failures, unexpected
 * exceptions) into short, human-readable messages that are safe to show
 * directly in the UI.
 *
 * This module has ONE job: classify `unknown` -> `string`. It knows nothing
 * about React, component state, or where the message will be rendered. That
 * separation is what lets every feature in the app (auth, resources, ask,
 * etc.) reuse the same classification logic instead of re-inventing it.
 *
 * Raw errors should still be logged for developers — see `logTechnicalError`
 * below — the user-friendly string returned here is for end users only.
 */

import axios from "axios";

// ---------------------------------------------------------------------------
// Status-code -> message map
// ---------------------------------------------------------------------------

/**
 * Maps an HTTP status code to a human-readable explanation.
 * `serverMessage` is the backend's own `message` field, when present — some
 * statuses (400, 409) prefer the backend's specific explanation over a
 * generic one, since it's often more actionable for the user.
 */
const getMessageForStatus = (
  status: number,
  serverMessage?: string,
): string => {
  switch (status) {
    case 400:
      return serverMessage || "Please check your information and try again.";

    case 401:
      return "Your session has expired. Please sign in again.";

    case 403:
      return "You don't have permission to perform this action.";

    case 404:
      return "The requested resource could not be found.";

    case 409:
      return serverMessage || "This information already exists.";

    case 422:
      return serverMessage || "Some of the information provided isn't valid.";

    case 429:
      return "You're doing that too quickly. Please wait a moment and try again.";

    case 500:
    case 502:
    case 503:
    case 504:
      return "Our server is having trouble right now. Please try again shortly.";

    default:
      return "Something went wrong. Please try again.";
  }
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts any caught error into a message safe to display to a user.
 *
 * Handles three cases:
 *   1. Axios error with a response  -> classified by HTTP status code.
 *   2. Axios error with no response -> network/connectivity failure.
 *   3. Anything else                -> generic fallback message.
 *
 * Never throws, never returns technical details (stack traces, status
 * codes, "AxiosError", etc.) — this is the boundary between "what the
 * system knows" and "what the user is told".
 */
export const getUserFriendlyError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return "Something unexpected happened. Please try again.";
  }

  if (!error.response) {
    return "We couldn't connect to the server. Check your internet connection and try again.";
  }

  const serverMessage =
    typeof error.response.data?.message === "string"
      ? error.response.data.message
      : undefined;

  return getMessageForStatus(error.response.status, serverMessage);
};

/**
 * Logs the raw, technical error for developers (console today, an error-
 * tracking service like Sentry tomorrow) without ever surfacing it to the
 * user. Call this alongside `getUserFriendlyError`, not instead of it.
 *
 * @param context - Short tag identifying where the error occurred, e.g.
 *                  "[ProfileSetup]" or "[UploadResource]".
 */
export const logTechnicalError = (context: string, error: unknown): void => {
  console.error(`${context}`, error);
};
