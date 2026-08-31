/**
 * useFeed.ts
 *
 * React Query wrapper around feedService.getFeed — same pattern as
 * useResources. Feed.tsx should never call feedService directly.
 */
import { useQuery } from "@tanstack/react-query";
import { feedService } from "../services/feedService";
import { feedKeys } from "../constants/feedKeys";

export function useFeed() {
  const query = useQuery({
    queryKey: feedKeys.root(),
    queryFn: feedService.getFeed,
  });

  return {
    feed: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
