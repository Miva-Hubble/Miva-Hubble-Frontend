export type PreferredMode = "identified" | "anonymous";

export interface ProfileSetupData {
  currentLevel: string;
  department: string;
  goals: string[];
  preferredMode: PreferredMode;
  profilePhoto: File | null;
}

export interface ProfileSetupPayload {
  level: string;
  department: string;
  goals: string[];
  preferredMode: PreferredMode;
}
