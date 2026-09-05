/**
 * useVaultResourceUrl.ts
 *
 * Fetches a short-lived signed preview URL for a Vault feed item, gated by
 * `enabled` (the modal passes its own `open` state). Replaces the old
 * pattern of fetching in the parent card and threading the URL down as a
 * prop + useEffect-driven loading/error state in the modal — React Query
 * owns the fetch, loading, error, and caching here, and the modal renders
 * declaratively off `data`/`isLoading`/`isError`.
 *
 * Deliberately overrides the app's global `staleTime: 0` (see
 * lib/queryClient.ts): that default is right for lists/dashboards where
 * every mount should reflect the latest DB state, but it's wrong here —
 * under it, reopening the SAME resource's preview even a few seconds after
 * closing it re-triggers a full loading spinner for no benefit, since the
 * previously-issued signed URL is still perfectly valid. Instead this
 * query stays fresh for most of the signed URL's own backend lifetime
 * (StudentResourceService's VAULT_PREVIEW_URL_TTL_SECONDS / 
 * VAULT_DOWNLOAD_URL_TTL_SECONDS), so reopening the same resource within
 * that window is instant — no fetch, no spinner — and a fetch only happens
 * again once the URL is actually close to expiring.
 */
import { useQuery } from "@tanstack/react-query";
import { vaultKeys } from "../constants/vaultKeys";
import { vaultService } from "../services/vaultService";
import { getUserFriendlyError } from "../../../lib/errors/getUserFriendlyError";

// Kept a comfortable margin under the backend's actual signed-URL TTL (300s
// preview / 120s download) so a cached URL is never served past the point
// it'd actually fail to load.
const STALE_TIME_MS: Record<"preview" | "download", number> = {
  preview: 4 * 60 * 1000, // 4 min (backend TTL: 5 min)
  download: 90 * 1000, // 90s (backend TTL: 2 min)
};

export function useVaultResourceUrl(resourceId: string, mode: "preview" | "download", enabled: boolean) {
  const query = useQuery({
    queryKey: vaultKeys.resourceUrl(resourceId, mode),
    queryFn: () => vaultService.getResourceUrl(resourceId, mode),
    enabled,
    staleTime: STALE_TIME_MS[mode],
    // Never worth persisting a cached URL past its own tab's focus cycle —
    // a background-focus refetch here just means an extra signed-URL
    // request when it's not needed; staleTime above already governs
    // freshness correctly without this.
    refetchOnWindowFocus: false,
  });

  return {
    url: query.data ?? null,
    // isPending (not isFetching): once a fresh-enough cached URL exists,
    // reopening the modal must NOT show a spinner just because React Query
    // is doing its (correct, cheap) background staleness check.
    isLoading: query.isPending && enabled,
    isError: query.isError,
    // Computed straight from query.error on every render — not logged here,
    // since logging is a side effect and belongs in the queryFn/mutationFn's
    // own catch (or a global QueryCache onError), not in a hook's render path.
    errorMessage: query.isError ? getUserFriendlyError(query.error) : null,
    refetch: query.refetch,
  };
}
