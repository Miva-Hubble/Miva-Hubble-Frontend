/**
 * useMyProgress.ts
 *
 * React Query wrapper around studentResourceService.getMyProgress. All
 * fields returned (dailyGoal.percentage, streak, consistency, rank) are
 * backend-calculated — per docs/resource-submission-domain-contract.md §7,
 * this hook (and any component consuming it) must never recompute or
 * derive any of these values itself, even ones that look like simple
 * arithmetic (e.g. dailyGoal.percentage is a fixed lookup table on the
 * backend, not activeCount/target*100 — rendering it as anything other
 * than the returned value would silently diverge from that table).
 *
 * refetchOnMount: "always" mirrors useResources.ts — an admin
 * approving/rejecting/archiving a submission elsewhere must be reflected
 * the next time this student's dashboard mounts, without a hard refresh.
 */
import { useQuery } from "@tanstack/react-query";
import { studentResourceService } from "../services/studentResourceService";
import { studentResourceKeys } from "../constants/studentResourceKeys";

export function useMyProgress() {
  const query = useQuery({
    queryKey: studentResourceKeys.progress(),
    queryFn: studentResourceService.getMyProgress,
    refetchOnMount: "always",
  });

  return {
    progress: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
