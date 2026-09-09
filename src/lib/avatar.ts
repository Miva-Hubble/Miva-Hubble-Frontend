export const AVATAR_RANKS = ['Novice', 'Amateur', 'Pro', 'Master', 'Ultimate'] as const;
export type AvatarRank = typeof AVATAR_RANKS[number];
export type Gender = 'male' | 'female' | 'other';

const MALE_SEEDS = ["Felix", "Jude", "Jack", "Aidan", "Oliver"];
const FEMALE_SEEDS = ["Aneka", "Jocelyn", "Avery", "Jessica", "Liliana"];
const OTHER_SEEDS = ["Riley", "Taylor", "Jordan", "Casey", "Avery"];

/**
 * Returns a 3D-styled avatar URL from DiceBear based on the user's gender and rank.
 */
export function getAvatarUrl(gender?: Gender | string | null, rank: string = 'Novice'): string {
  const rankIndex = AVATAR_RANKS.indexOf(rank as AvatarRank);
  const safeIndex = rankIndex >= 0 ? rankIndex : 0;
  
  let seed = MALE_SEEDS[0];
  if (gender === 'male') {
    seed = MALE_SEEDS[safeIndex] || MALE_SEEDS[0];
  } else if (gender === 'female') {
    seed = FEMALE_SEEDS[safeIndex] || FEMALE_SEEDS[0];
  } else if (gender === 'other') {
    seed = OTHER_SEEDS[safeIndex] || OTHER_SEEDS[0];
  } else {
    // Default fallback if no gender provided
    seed = OTHER_SEEDS[safeIndex] || OTHER_SEEDS[0];
  }

  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`;
}
