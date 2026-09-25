import { apiClient } from "../../../lib/axios/apiClient";
import type { FeedResponse } from "../../../types/feed";

const FEED_ENDPOINT = "/api/feed";

export const dashboardService = {
  getFeed: async (): Promise<FeedResponse> => {
    const { data } = await apiClient.get<FeedResponse>(FEED_ENDPOINT);
    return data;
  },
};
