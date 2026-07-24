export type PreferredMode = "anonymous" | "identified";

export interface ProfileSetupData {
  department: string;
  currentLevel: string;
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
