export interface ProfileSetupData {
  department: string;
  level: string;
  goals: string[];
  profilePhoto: File | null;
}

export interface ProfileSetupPayload {
  department: string;
  level: string;
  goals: string[];
  profilePhoto: File | null;
}
