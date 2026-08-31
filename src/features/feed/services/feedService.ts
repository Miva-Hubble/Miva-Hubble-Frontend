/**
 * feedService.ts
 *
 * Transport only — calls GET /api/feed via the shared apiClient (cookie
 * auth + refresh handled there, same as every other service). Unlike
 * resourceService.getLibrary, this does NOT swallow errors into an empty
 * response: /api/feed doesn't exist on the backend yet, so a failed call
 * must surface as a real error state, not be confused with "loaded
 * successfully but nothing to show".
 */
import { apiClient } from "../../../lib/axios/apiClient";
import type { FeedResponse } from "../../../types/feed";

const FEED_ENDPOINT = "/api/feed";

export const feedService = {
  getFeed: async (): Promise<FeedResponse> => {
    const { data } = await apiClient.get<FeedResponse>(FEED_ENDPOINT);
    return data;
  },
};
