/** Cache namespace for approved, audience-matched student Vault resources. */
export const vaultKeys = {
  all: ["vault"] as const,
  list: (params: { search?: string; courseCode?: string; resourceType?: string } = {}) =>
    [...vaultKeys.all, "list", params] as const,
  // Signed preview/download URLs are short-lived (backend TTL: 300s preview,
  // 120s download — see StudentResourceService), so this key exists purely
  // to scope caching/dedup per (resource, mode); it is never invalidated
  // manually, it just goes stale immediately under the app's global
  // `staleTime: 0` and gets refetched the next time it's needed.
  resourceUrl: (id: string, mode: "preview" | "download") => [...vaultKeys.all, "resource-url", id, mode] as const,
};
