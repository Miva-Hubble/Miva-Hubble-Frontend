/**
 * studentResourceService.ts
 *
 * Transport layer for the student resource submission flow
 * (POST /api/student-resources/*). Uses the shared `apiClient` — same
 * cookie-based auth, 401/refresh handling, and retry queue as every other
 * service in the app (see resourceService.ts, feedService.ts). No manual
 * token handling belongs here or anywhere else in this codebase; that is
 * apiClient's job alone.
 *
 * This file intentionally does NOT touch Supabase directly. Step 2 of the
 * upload flow (PUT to the signed URL) is a plain, unauthenticated browser
 * fetch straight to Supabase Storage — it must NOT go through `apiClient`,
 * since apiClient always sends this app's own cookies/baseURL, which would
 * be wrong (and rejected) against a Supabase host. That call belongs in the
 * orchestrating hook (useSubmitStudentResource), not here.
 */

import { apiClient } from "../../../lib/axios/apiClient";
import type {
  CreateStudentResourcePayload,
  RequestUploadUrlPayload,
  RequestUploadUrlResponse,
  StudentResourceResponse,
  MyStudentResourcesResponse,
  StudentProgressResponse,
} from "../../../types/studentResource";

const BASE = "/api/student-resources";

export const studentResourceService = {
  /** Step 1: signed Supabase upload URL, scoped server-side to this student. */
  requestUploadUrl: async (payload: RequestUploadUrlPayload): Promise<RequestUploadUrlResponse> => {
    const { data } = await apiClient.post<RequestUploadUrlResponse>(`${BASE}/upload-url`, payload);
    return data;
  },

  /** Step 3: registers the completed upload as a DRAFT after backend verifies physical storage metadata. */
  createDraft: async (payload: CreateStudentResourcePayload): Promise<StudentResourceResponse> => {
    const { data } = await apiClient.post<StudentResourceResponse>(BASE, payload);
    return data;
  },

  /** Step 4: DRAFT -> PENDING_REVIEW. Enforces the 6-per-Lagos-day cap server-side. */
  submit: async (resourceId: string): Promise<StudentResourceResponse> => {
    const { data } = await apiClient.post<StudentResourceResponse>(`${BASE}/${resourceId}/submit`);
    return data;
  },

  /** Authenticated student's submissions, including non-public workflow states. */
  getMine: async (): Promise<MyStudentResourcesResponse> => {
    const { data } = await apiClient.get<MyStudentResourcesResponse>(`${BASE}/mine`);
    return data;
  },

  /** Own daily goal / streak / consistency / rank snapshot. userId always comes from the token. */
  getMyProgress: async (): Promise<StudentProgressResponse> => {
    const { data } = await apiClient.get<StudentProgressResponse>(`${BASE}/progress`);
    return data;
  },
};
