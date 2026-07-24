/**
 * profileService.ts
 *
 * Responsible for profile business operations only:
 *   - Fetching the list of available departments for the onboarding step
 *   - Saving the completed onboarding profile to the backend
 *
 * HTTP transport, cookie handling, and error recovery are entirely delegated
 * to `apiClient`. This service has no knowledge of tokens, cookies, or retry
 * logic.
 */

import { apiClient } from "../lib/axios/apiClient";
import type { ProfileSetupPayload } from "../types/ProfileSetup";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Used when the departments endpoint is unavailable (e.g. backend is cold-
 * starting on Render's free tier). Keeps the onboarding flow functional even
 * without a live connection.
 */
const FALLBACK_DEPARTMENTS: readonly string[] = [
  "Computer Science",
  "Cybersecurity",
  "Data Science",
  "Software Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business Administration",
  "Economics",
  "Mass Communication",
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The shape the backend expects for the onboarding POST body.
 * Named fields match the API contract — keep in sync with the backend schema.
 */
interface OnboardingPayload {
  department: string;
  currentLevel: string;
  goals: string[];
}

interface DepartmentsResponse {
  departments?: string[];
  data?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalises an arbitrary API response shape into a flat `string[]`.
 * The backend may return the list at the top level, under `departments`, or
 * under `data` — all three shapes are handled here.
 */
const normalizeDepartments = (
  data: string[] | DepartmentsResponse,
): string[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.departments)) return data.departments;
  if (Array.isArray(data.data)) return data.data;
  return [...FALLBACK_DEPARTMENTS];
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const profileService = {
  /**
   * Fetches the list of departments from the onboarding endpoint.
   *
   * Falls back to `FALLBACK_DEPARTMENTS` if the network request fails so that
   * onboarding remains usable while the backend is unreachable (e.g. cold
   * start on a free hosting tier). A console warning is emitted so developers
   * are aware the fallback path was taken.
   */
  fetchDepartments: async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[] | DepartmentsResponse>(
        "/api/onboarding",
      );
      return normalizeDepartments(data);
    } catch {
      console.warn(
        "[profileService] fetchDepartments: API unavailable — using fallback department list.",
      );
      return [...FALLBACK_DEPARTMENTS];
    }
  },

  /**
   * Persists the user's completed onboarding profile to the backend.
   *
   * The payload is sent as JSON. If the backend requires `multipart/form-data`
   * for the profile photo, extend this method to build a `FormData` object and
   * update the `Content-Type` header accordingly.
   *
   * Errors are propagated to the caller so the UI can handle the failure state
   * (e.g. display a toast and keep the user on the current step).
   */
  saveProfile: async (payload: ProfileSetupPayload): Promise<void> => {
    // `payload.level` is the client-side field name (defined in ProfileSetupPayload).
    // The backend schema expects the key `currentLevel` — the mapping happens here.
    const body: OnboardingPayload = {
      department: payload.department,
      currentLevel: payload.level,
      goals: payload.goals,
    };

    await apiClient.post("/api/onboarding", body);
  },
};
