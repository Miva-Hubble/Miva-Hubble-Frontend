/**
 * @deprecated Superseded by `getAvatarAsset` in `./avatar/getAvatarAsset.ts`
 * (business rule 7.1 — single source of truth for the gender/rank -> asset
 * mapping). This file only re-exports for backward compatibility; delete it
 * once you've confirmed nothing outside this repo imports from here.
 */
export {
  getAvatarAsset as getAvatarUrl,
  AVATAR_RANKS,
  type AvatarRank,
  type Gender,
} from "./avatar/getAvatarAsset";
