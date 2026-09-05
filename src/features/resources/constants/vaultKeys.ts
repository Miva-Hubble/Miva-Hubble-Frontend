/** Cache namespace for approved, audience-matched student Vault resources. */
export const vaultKeys = {
  all: ["vault"] as const,
  list: (params: { search?: string; courseCode?: string; resourceType?: string } = {}) =>
    [...vaultKeys.all, "list", params] as const,
};
