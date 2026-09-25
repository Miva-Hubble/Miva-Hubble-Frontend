/**
 * studentResource.ts
 *
 * DTOs for the student resource submission domain — distinct from
 * `resource.ts` (BookDto/Resource), which covers the admin-curated
 * library. See docs/resource-submission-domain-contract.md for the full
 * rules these types encode.
 *
 * `storagePath` is deliberately absent from `StudentResourceDto` — the
 * backend strips it before it ever reaches this client
 * (StudentResourceService.toPublicResource). Do not add it back here even
 * if a raw API response happens to include it; treat that as a backend
 * regression, not a type gap.
 */

export type StudentResourceStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export type StudentResourceType =
  | "NOTE"
  | "PAST_QUESTION"
  | "STUDY_GUIDE"
  | "REFERENCE";

export interface StudentResourceDto {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  level: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  resourceType: StudentResourceType;
  fileFormat: "PDF" | "EPUB" | "DOC" | "DOCX";
  mimeType: string;
  sizeBytes: number;
  status: StudentResourceStatus;
  rejectionReason: string | null;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestUploadUrlPayload {
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export interface RequestUploadUrlResponse {
  success: boolean;
  signedUrl: string;
  token: string;
  path: string;
  contentType: string;
  sizeBytes: number;
}

export interface CreateStudentResourcePayload {
  path: string;
  title: string;
  description?: string | null;
  level: string;
  department: string;
  courseCode?: string;
  courseTitle: string;
  resourceType: StudentResourceType;
  contentType: string;
  sizeBytes: number;
}

export interface StudentResourceResponse {
  success: boolean;
  resource: StudentResourceDto;
}

/** Authenticated student's own submissions; never use the public library DTO. */
export interface MyStudentResourcesResponse {
  success: boolean;
  resources: StudentResourceDto[];
}

// ---------------------------------------------------------------------------
// GET /api/student-resources/progress — matches ProgressionService.getStudentProgress
// ---------------------------------------------------------------------------

export interface NextRankProgress {
  name: string;
  minimumApprovedResources: number;
  resourcesRemaining: number;
}

export interface StudentProgress {
  dailyGoal: {
    activeCount: number;
    target: number;
    percentage: 0 | 33 | 66 | 100;
    completed: boolean;
  };
  streak: {
    current: number;
    longest: number;
  };
  consistency: {
    windowDays: number;
    eligibleDays: number;
    completedDays: number;
    percentage: number;
  };
  rank: {
    name: string;
    level: number;
    approvedResourceCount: number;
    nextRank: NextRankProgress | null;
  };
}

export interface StudentProgressResponse extends StudentProgress {
  success: boolean;
}
