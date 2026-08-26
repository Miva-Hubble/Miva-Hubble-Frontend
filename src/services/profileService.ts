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
   * Persists the user's completed onboarding profile to the backend.
   *
   *
   * Errors are propagated to the caller so the UI can handle the failure state
   * (e.g. display a toast and keep the user on the current step).
   */
    saveProfile: async (data: ProfileSetupData) => {
      let profilePicturePath = null;
  
      // Upload the image to Multer/Supabase (if the user didn't skip it)
      if (data.profilePhoto) {
        const formData = new FormData();
        
        formData.append("file", data.profilePhoto);
  
        const uploadRes = await apiClient.post("/api/onboarding/profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        // Extract the Supabase public URL from the backend response.
        profilePicturePath = uploadRes.data.profilePicturePath;
      }
  
      // Send the final JSON payload to complete onboarding
      const finalPayload = {
        level: data.level,
        department: data.department,
        goals: data.goals,
        preferredMode: data.preferredMode,
        // Only attach the URL key if an image was actually uploaded
        ...(profilePicturePath && { profilePicturePath }), 
      };
  
      const completeRes = await apiClient.post("/api/onboarding/complete", finalPayload);
      
      return completeRes.data;
    },
  };