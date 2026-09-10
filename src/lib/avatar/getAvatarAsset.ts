export const AVATAR_RANKS = ['Novice', 'Amateur', 'Pro', 'Master', 'Ultimate'] as const;
export type AvatarRank = typeof AVATAR_RANKS[number];
export type Gender = 'male' | 'female';

const MALE_SEEDS = ["Felix", "Jude", "Jack", "Aidan", "Oliver"];
const FEMALE_SEEDS = ["Aneka", "Jocelyn", "Avery", "Jessica", "Liliana"];
// Used only as the neutral fallback when no gender is set yet (e.g. a
// legacy account mid-way through /claim-identity) — not a selectable
// gender option. The "other" gender option was removed from the UI
// (Step3UsernameAndGender) because the backend `Gender` enum only ever
// supported MALE/FEMALE; this array is what those seeds used to serve
// double duty for, and still does for the no-gender-yet case.
const DEFAULT_SEEDS = ["Riley", "Taylor", "Jordan", "Casey", "Avery"];

/**
 * getAvatarAsset — single source of truth for resolving a (gender, rank)
 * pair to an avatar asset reference (a DiceBear URL today; the return type
 * is intentionally just `string` so this can move to bundled/local assets
 * later without changing the call sites below).
 *
 * Pure function: no I/O, no knowledge of `User`, storage, or uploads.
 * Every avatar-rendering component must import this — never re-implement
 * the gender/rank -> seed mapping locally.
 */
export function getAvatarAsset(gender?: Gender | string | null, rank: string = 'Novice'): string {
  const rankIndex = AVATAR_RANKS.indexOf(rank as AvatarRank);
  const safeIndex = rankIndex >= 0 ? rankIndex : 0;

  let seed = MALE_SEEDS[0];
  if (gender === 'male') {
    seed = MALE_SEEDS[safeIndex] || MALE_SEEDS[0];
  } else if (gender === 'female') {
    seed = FEMALE_SEEDS[safeIndex] || FEMALE_SEEDS[0];
  } else {
    // No gender set yet (null/undefined/legacy pre-claim state).
    seed = DEFAULT_SEEDS[safeIndex] || DEFAULT_SEEDS[0];
  }

  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`;
}
