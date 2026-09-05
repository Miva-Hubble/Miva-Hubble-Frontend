/**
 * The unified Vault feed DTO — admin-curated Books and student-approved
 * StudentResources merged server-side into one shape (see
 * StudentResourceService.listVaultResources / Gate 13). `source`
 * discriminates the two so the UI can branch on source-specific actions
 * (e.g. contributor attribution for STUDENT, cover art for BOOK) without
 * needing two separate fetches or two separate card components.
 */
export type FeedResourceSource = "BOOK" | "STUDENT";

export interface VaultResourceDto {
  id: string;
  source: FeedResourceSource;
  title: string;
  description: string | null;
  level: string;
  department: string;
  resourceType: string;
  fileFormat: "PDF" | "EPUB" | "DOC" | "DOCX";
  createdAt: string;

  // STUDENT-only (always null for a BOOK row)
  courseCode: string | null;
  courseTitle: string | null;

  // Populated for BOTH sources: the Book's author for a BOOK row, the
  // approving student's name for a STUDENT row. Never null in practice for
  // either source today, but kept nullable defensively (see
  // StudentResourceService.listVaultResources's `b.author AS uploader_name`).
  uploaderName: string | null;

  // BOOK-only (always null for a STUDENT row)
  coverImageUrl: string | null;
  downloadCount: number | null;
}

export interface VaultResourcesResponse {
  success: boolean;
  resources: VaultResourceDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
