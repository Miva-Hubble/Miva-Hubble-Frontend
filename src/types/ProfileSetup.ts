export type PreferredMode = "identified" | "anonymous";
export type Gender = "male" | "female";

export interface ProfileSetupData {
  currentLevel: string;
  department: string;
  goals: string[];
  preferredMode: PreferredMode;
  username: string;
  gender: Gender | "";
}

export interface ProfileSetupPayload {
  level: string;
  department: string;
  goals: string[];
  preferredMode: PreferredMode;
  username: string;
  gender: Gender;
}
