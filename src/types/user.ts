export interface UserOnboarding {
  level: string;
  department: string;
  goals: string[];
  preferredMode: string;
  completedAt: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  picture: string | null;
  profilePicturePath: string | null;
  email_verified: boolean;
  last_login_with: string | null;
  createdAt: string;
  isOnboarded: boolean;
  onboarding?: UserOnboarding | null;
}
