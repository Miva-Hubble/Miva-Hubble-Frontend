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
   * TODO: Implement actual backend endpoint for username validation.
   * Assumes a GET /api/users/check-username?username=... endpoint.
   */
  checkUsername: async (username: string): Promise<boolean> => {
    // return apiClient.get(`/api/users/check-username?username=${username}`).then(res => res.data.isAvailable);
    return new Promise((resolve) => setTimeout(() => resolve(username.length > 2), 500));
  },

  /**
   * Persists the user's completed onboarding profile to the backend.
   */
  saveProfile: async (data: ProfileSetupData) => {
    // Send the final JSON payload to complete onboarding
    // TODO: Ensure backend /api/onboarding endpoint accepts gender and username
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
   * TODO: Implement actual backend endpoint for profile updates.
   * Assumes a PUT /api/profile endpoint.
   */
  updateProfile: async (data: { username: string; department: string }) => {
    const res = await apiClient.put("/api/profile", data);
    return res.data; // TODO: Return res.data
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }
};