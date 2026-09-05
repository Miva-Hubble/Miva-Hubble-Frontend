/**
 * useSubmitStudentResource.ts
 *
 * Orchestrates the four-step submission flow from ResourceSubmissionDomainContract
 * §"student upload flow": request a signed URL, PUT the file straight to
 * Supabase (bypassing apiClient/this app's backend entirely for that one
 * call — see studentResourceService.ts), register the DRAFT, then submit
 * for review. Exposes granular stage state so the calling form can show
 * "Uploading..." vs "Registering..." vs "Submitting..." instead of one
 * opaque spinner.
 *
 * Does not touch React Query's cache directly — the caller decides what to
 * invalidate/refetch (e.g. useMyProgress) once `submit` resolves.
 */
import { useCallback, useState } from "react";
import { studentResourceService } from "../services/studentResourceService";
import type {
  StudentResourceDto,
  StudentResourceType,
} from "../../../types/studentResource";
import { getUserFriendlyError, logTechnicalError } from "../../../lib/errors/getUserFriendlyError";

export type SubmissionStage =
  | "idle"
  | "requesting-url"
  | "uploading"
  | "registering"
  | "submitting"
  | "done";

export interface SubmitStudentResourceInput {
  file: File;
  title: string;
  description?: string;
  level: string;
  department: string;
  courseCode?: string;
  courseTitle: string;
  resourceType: StudentResourceType;
}

export function useSubmitStudentResource() {
  const [stage, setStage] = useState<SubmissionStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<StudentResourceDto | null>(null);

  const reset = useCallback(() => {
    setStage("idle");
    setError(null);
    setResource(null);
  }, []);

  const submit = useCallback(async (input: SubmitStudentResourceInput) => {
    setError(null);
    setResource(null);

    try {
      // 1. Signed upload URL
      setStage("requesting-url");
      const upload = await studentResourceService.requestUploadUrl({
        filename: input.file.name,
        contentType: input.file.type,
        sizeBytes: input.file.size,
      });

      // 2. Direct-to-Supabase PUT. Deliberately a plain fetch, not apiClient —
      // this request must NOT carry this app's cookies/baseURL.
      setStage("uploading");
      const putResponse = await fetch(upload.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": input.file.type },
        body: input.file,
      });
      if (!putResponse.ok) {
        throw new Error(`File upload to storage failed (${putResponse.status})`);
      }

      // 3. Register as DRAFT
      setStage("registering");
      const draftResponse = await studentResourceService.createDraft({
        path: upload.path,
        title: input.title,
        description: input.description ?? null,
        level: input.level,
        department: input.department,
        courseCode: input.courseCode ?? "",
        courseTitle: input.courseTitle,
        resourceType: input.resourceType,
        contentType: input.file.type,
        sizeBytes: input.file.size,
      });

      // 4. Submit for review
      setStage("submitting");
      const submitResponse = await studentResourceService.submit(draftResponse.resource.id);

      setResource(submitResponse.resource);
      setStage("done");
      return submitResponse.resource;
    } catch (err) {
      logTechnicalError("[useSubmitStudentResource:submit]", err);
      setError(getUserFriendlyError(err));
      setStage("idle");
      throw err;
    }
  }, []);

  return { stage, error, resource, submit, reset };
}
