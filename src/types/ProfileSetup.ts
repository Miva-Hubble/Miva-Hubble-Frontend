export interface ProfileSetupData {
  department: string;
  currentLevel: string;
  goals: string[];
  profilePhoto: File | null;
}

export interface ProfileSetupPayload {
  department: string;
  currentLevel: string;
  goals: string[];
  profilePhoto: File | null;
}
