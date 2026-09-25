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
import type { ProfileSetupData } from "../types/ProfileSetup";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const profileService = {
  /**
   * GET /api/users/check-username (3.1) — auth required. Returns whether
   * the given username is available, excluding the requester's own current
   * username from the "taken" check server-side.
   */
  checkUsername: async (username: string): Promise<boolean> => {
    const res = await apiClient.get("/api/users/check-username", {
      params: { username },
    });
    return res.data.available;
  },

  /**
   * Persists the user's completed onboarding profile to the backend.
   */
  saveProfile: async (data: ProfileSetupData) => {
    // Send the final JSON payload to complete onboarding.
    // Confirmed 2026-09-10: backend's onboardingSchema (onboarding.schema.ts)
    // accepts gender/username and completeOnboarding persists both — no gap here.
    const finalPayload = {
      level: data.currentLevel,
      department: data.department,
      goals: data.goals,
      preferredMode: data.preferredMode,
      gender: data.gender,
      username: data.username,
    };

    const completeRes = await apiClient.post("/api/onboarding", finalPayload);
    
    return completeRes.data;
  },

  /**
   * TODO: No backend endpoint exists yet for this (see chat note — flagged,
   * not fabricated). Blocks /claim-identity (Phase 8) from actually
   * persisting for legacy accounts until the backend adds
   * PATCH /api/user/identity (or equivalent).
   */
  claimIdentity: async (data: { username: string; gender: string }) => {
    const res = await apiClient.patch("/api/user/identity", data);
    return res.data;
  },

  /**
   * PATCH /api/user/username (3.2) — auth required. Changes the user's
   * username post-onboarding.
   */
  updateUsername: async (username: string) => {
    const res = await apiClient.patch("/api/user/username", { username });
    return res.data;
  },

  /**
   * PATCH /api/user/department — auth required. Changes the user's
   * department post-onboarding. Server enforces a 60-day cooldown
   * (departmentChangedAt) and responds 409 with a human-readable `message`
   * if the cooldown is still active — see getDepartmentCooldownStatus
   * (src/lib/date/departmentCooldown.ts) for the client-side pre-check that
   * avoids hitting this endpoint needlessly, though the backend is always
   * the real enforcement point regardless of what the client checked.
   */
  updateDepartment: async (department: string) => {
    const res = await apiClient.patch("/api/user/department", { department });
    return res.data;
  },
};