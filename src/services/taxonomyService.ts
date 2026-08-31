import { apiClient } from "../lib/axios/apiClient";
import type { TaxonomyResponse } from "../types/taxonomy";

export const taxonomyService = {
  getTaxonomy: async (): Promise<TaxonomyResponse> => {
    const { data } = await apiClient.get<TaxonomyResponse>("/api/taxonomy");
    return data;
  },
};
