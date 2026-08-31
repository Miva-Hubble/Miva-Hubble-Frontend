/**
 * resourceService.ts
 *
 * Responsible for resource/library read operations only:
 *   - Fetching the published book library for the Vault
 *
 * HTTP transport, cookie-based auth, and 401 refresh/retry are entirely
 * delegated to the shared `apiClient` (same instance `authService` and
 * `profileService` use) — this file has no knowledge of tokens or retry
 * logic, matching the rest of the codebase.
 *
 * DTO -> view-model mapping is delegated to `mapBooksToResources` so this
 * file stays focused on "what to call or send", not "how to reshape it".
 */

import { apiClient } from "../../../lib/axios/apiClient";
import type { LibraryResponse, Resource } from "../../../types/resource";
import { mapBooksToResources } from "../lib/mapBookToResource";

const LIBRARY_ENDPOINT = "/api/storage/library";

export const resourceService = {
  /**
   * Fetches the published book library and maps it to the `Resource`
   * shape the Vault UI renders. Returns an empty array (not an error)
   * when the admin hasn't uploaded anything yet — callers should treat
   * `[]` as a legitimate empty state, not a failure.
   */
  getLibrary: async (): Promise<Resource[]> => {
    const { data } = await apiClient.get<LibraryResponse>(LIBRARY_ENDPOINT);

    if (!data.success || !Array.isArray(data.books)) {
      return [];
    }

    return mapBooksToResources(data.books);
  },

  /**
   * Fetches a short-lived signed URL for downloading or previewing a
   * single library book. Backed by GET /api/storage/:id/url?isBook=true
   * (StorageService.generatePresignedUrl).
   *
   * `mode` controls the response's Content-Disposition on the backend:
   * "download" forces a save dialog (Content-Disposition: attachment),
   * "preview" leaves it off so the browser/viewer can render the file
   * inline. These are genuinely different URLs, not the same one reused.
   */
  getDownloadUrl: async (bookId: string, mode: "download" | "preview" = "download"): Promise<string> => {
    const { data } = await apiClient.get<{ success: boolean; signedUrl: string }>(
      `/api/storage/${bookId}/url`,
      { params: { isBook: true, mode } },
    );
    return data.signedUrl;
  },
};
