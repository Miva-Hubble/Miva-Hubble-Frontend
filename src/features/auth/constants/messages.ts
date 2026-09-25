/**
 * messages.ts
 *
 * Copy shown under the Google auth button while the OAuth redirect is in
 * flight. Kept separate from GoogleAuthButton so the wording can be tweaked
 * without touching component logic.
 */

export const GOOGLE_AUTH_LOADING_MESSAGES = [
  "Connecting to Google…",
  "Verifying your university account…",
  "Almost there, hang tight…",
  "Setting up your Hubble space…",
] as const;
