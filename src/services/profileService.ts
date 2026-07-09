import axios from "axios";
import type { ProfileSetupPayload } from "../types/ProfileSetup";

const BASE_URL = import.meta.env.VITE_API_URL;

// TODO: Update with correct API routes when backend is ready
const DEPARTMENTS_URL = `${BASE_URL}/api/departments`;
const PROFILE_SETUP_URL = `${BASE_URL}/api/profile/setup`;

const FALLBACK_DEPARTMENTS = [
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
];

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const profileService = {
  fetchDepartments: async (): Promise<string[]> => {
    try {
      const response = await axios.get(DEPARTMENTS_URL, {
        headers: getAuthHeaders(),
      });
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.departments)) return data.departments;
      if (Array.isArray(data?.data)) return data.data;

      return FALLBACK_DEPARTMENTS;
    } catch {
      console.warn(
        "Department API unavailable — using fallback list. Update DEPARTMENTS_URL in profileService.ts.",
      );
      return FALLBACK_DEPARTMENTS;
    }
  },

  saveProfile: async (payload: ProfileSetupPayload): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("department", payload.department);
      formData.append("currentLevel", payload.currentLevel);
      formData.append("goals", JSON.stringify(payload.goals));

      if (payload.profilePhoto) {
        formData.append("profilePhoto", payload.profilePhoto);
      }

      await axios.post(PROFILE_SETUP_URL, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Failed to save profile setup:", error);
      // Placeholder — don't block navigation until API is wired up
    }
  },
};
