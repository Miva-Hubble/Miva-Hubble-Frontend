import type { StudentResourceType } from "./studentResource";

/** Public, audience-filtered approved student resource. Never use this for My Uploads. */
export interface VaultResourceDto {
  id: string;
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
  approvedAt: string | null;
  createdAt: string;
}

export interface VaultResourcesResponse {
  success: boolean;
  resources: VaultResourceDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
