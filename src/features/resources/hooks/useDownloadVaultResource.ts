/**
 * useDownloadVaultResource.ts
 *
 * Downloading is an imperative, one-shot action (fetch a signed URL, then
 * immediately trigger a browser download) — not something to render off of,
 * so it's a `useMutation`, not a `useQuery`. This also sidesteps a real v5
 * constraint: `onSuccess`/`onError` callbacks were removed from `useQuery`
 * entirely in React Query v5; `useMutation` still has them, which is
 * exactly what triggering the `<a download>` click needs.
 */
import { useMutation } from "@tanstack/react-query";
import { vaultService } from "../services/vaultService";
import { getUserFriendlyError } from "../../../lib/errors/getUserFriendlyError";

export function useDownloadVaultResource() {
  const mutation = useMutation({
    mutationFn: ({ resourceId }: { resourceId: string; filename: string }) =>
      vaultService.getResourceUrl(resourceId, "download"),
    onSuccess: (url, { filename }) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    },
  });

  return {
    download: (resourceId: string, filename: string) => mutation.mutate({ resourceId, filename }),
    isDownloading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.isError ? getUserFriendlyError(mutation.error) : null,
  };
}
