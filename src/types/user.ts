export interface UserOnboarding {
  level: string;
  department: string;
  goals: string[];
  preferredMode: string;
  completedAt: string | null;
  departmentChangedAt: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  name: string;
  gender: 'male' | 'female' | null;
  picture: string | null;
  email_verified: boolean;
  last_login_with: string | null;
  createdAt: string;
  isOnboarded: boolean;
  onboarding?: UserOnboarding | null;
}
