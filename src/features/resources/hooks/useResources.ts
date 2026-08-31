/**
 * useResources.ts
 *
 * React Query wrapper around `resourceService.getLibrary`. Owns caching,
 * loading/error state, and refetch — `Vault.tsx` should never call
 * `resourceService` directly.
 *
 * Error handling deliberately mirrors the rest of the app: the raw error
 * is exposed so the caller can run it through `getUserFriendlyError` at
 * the point of display (same pattern as `useAuth`'s `UnauthorizedError`
 * handling), rather than baking a message into the hook itself.
 *
 * Cache strategy:
 *   - staleTime: 0 (global default) — data is immediately stale after fetch.
 *   - refetchOnMount: "always" — every time the user navigates to /resources,
 *     a fresh fetch is fired regardless of cached state. This ensures that
 *     backend changes (including admin deletions of counts) are always
 *     reflected without requiring a hard browser refresh.
 *   - refetchOnWindowFocus: true (global default) — switching away and back
 *     to this tab also triggers a background refetch.
 */
import { useQuery } from "@tanstack/react-query";
import { resourceService } from "../services/resourceService";
import { resourceKeys } from "../constants/resourceKeys";

export function useResources() {
  const query = useQuery({
    queryKey: resourceKeys.library(),
    queryFn: resourceService.getLibrary,
    // Always fetch fresh data from the server when the component mounts —
    // this is the primary guard against stale counts after DB changes.
    refetchOnMount: "always",
  });

  const resources = query.data ?? [];

  return {
    resources,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: !query.isLoading && !query.isError && resources.length === 0,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
