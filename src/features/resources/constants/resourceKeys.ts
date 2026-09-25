/**
 * resourceKeys.ts
 *
 * Centralized React Query key factory for the resources feature. Keeping
 * these in one place (instead of inline arrays scattered across hooks)
 * means cache invalidation after a future upload/delete mutation can
 * target the right keys without guessing.
 */
export const resourceKeys = {
  all: ["resources"] as const,
  library: () => [...resourceKeys.all, "library"] as const,
};
