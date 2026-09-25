import { apiClient } from "../../../lib/axios/apiClient";
import type { VaultResourcesResponse } from "../../../types/vaultResource";

const VAULT_ENDPOINT = "/api/vault";

/** Student-approved-resource discovery; deliberately separate from admin Books Library. */
export const vaultService = {
  getVault: async (params: { search?: string; courseCode?: string; resourceType?: string } = {}): Promise<VaultResourcesResponse> => {
    const { data } = await apiClient.get<VaultResourcesResponse>(VAULT_ENDPOINT, { params });
    return data;
  },
  getResourceUrl: async (id: string, mode: "preview" | "download"): Promise<string> => {
    const { data } = await apiClient.get<{ success: boolean; signedUrl: string }>(`${VAULT_ENDPOINT}/${id}/url`, { params: { mode } });
    return data.signedUrl;
  },
};
