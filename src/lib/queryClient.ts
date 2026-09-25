/**
 * queryClient.ts
 *
 * Single shared QueryClient instance for the app. `@tanstack/react-query`
 * was already a dependency but had no provider wired up anywhere — this
 * is that missing piece.
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0 — data is immediately considered stale after fetching.
      // React Query will always refetch in the background when the component
      // re-mounts or the window regains focus, so DB changes (including
      // deletions) are picked up without a manual page refresh.
      staleTime: 0,
      retry: 1,
      // Re-enabled: switching back to this tab triggers a background refetch
      // so counts deleted from the DB disappear from the UI automatically.
      refetchOnWindowFocus: true,
    },
  },
});
