import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { dashboardKeys } from "../constants/dashboardKeys";

export function useDashboard() {
  const query = useQuery({
    queryKey: dashboardKeys.root(),
    queryFn: dashboardService.getFeed,
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

export const useFeed = useDashboard;
