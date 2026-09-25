/**
 * feed.ts
 *
 * View model for GET /api/feed. Every section is nullable/optional by
 * design — the backend may legitimately omit a section (dailyGoal,
 * topMasters, currentQuest, communityImpact currently have no backing
 * data model at all; see schema.prisma). The frontend must render an
 * honest "not available" state for a missing section rather than
 * inventing zeros or placeholder numbers.
 */

export interface FeedUser {
  id: string;
  name: string;
  level: string;
  department: string;
}

export interface DailyGoal {
  percentage: number;
  streak: number;
}

export interface QuickSearch {
  categories: string[];
}

export interface TopMasterItem {
  id: string;
  name: string;
  xp: number;
  streak?: number;
  active?: boolean;
}

export interface TopMasters {
  items: TopMasterItem[];
}

export interface CurrentQuest {
  title: string;
  description: string;
  xpReward: number;
}

export interface CategoryItem {
  id: string;
  title: string;
  description?: string;
  count?: number;
  rating?: number;
}

export interface Categories {
  items: CategoryItem[];
}

export interface TrendingItem {
  id: string;
  title: string;
  context?: string;
  downloads?: number;
  rating?: number;
  reviews?: number;
  fileType?: string;
}

export interface Trending {
  items: TrendingItem[];
}

export interface CommunityImpact {
  activeLearners: number;
  resources: number;
  successRate: number;
  monthlyLikes: number;
}

export interface FeedResponse {
  user: FeedUser | null;
  dailyGoal: DailyGoal | null;
  quickSearch: QuickSearch | null;
  topMasters: TopMasters | null;
  currentQuest: CurrentQuest | null;
  categories: Categories | null;
  trending: Trending | null;
  communityImpact: CommunityImpact | null;
}
