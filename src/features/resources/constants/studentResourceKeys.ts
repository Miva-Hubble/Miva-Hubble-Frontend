/**
 * studentResourceKeys.ts
 *
 * Separate React Query key namespace from resourceKeys.ts on purpose —
 * per docs/resource-submission-domain-contract.md §1, student submissions
 * and the published library are distinct domains and must not share a
 * cache key space (invalidating one must never accidentally invalidate
 * the other).
 */
export const studentResourceKeys = {
  all: ["student-resources"] as const,
  mine: () => [...studentResourceKeys.all, "mine"] as const,
  progress: () => [...studentResourceKeys.all, "progress"] as const,
};
