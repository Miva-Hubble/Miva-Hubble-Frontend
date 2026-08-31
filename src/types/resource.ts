/**
 * resource.ts
 *
 * Two distinct shapes live here, deliberately kept separate:
 *
 *  - `BookDto` / `LibraryResponse` — the RAW contract returned by
 *    `GET /api/storage/library` today. This must mirror the backend
 *    exactly. When the backend contract changes, this is the only
 *    type that should need editing.
 *
 *  - `Resource` — the VIEW MODEL that `Vault.tsx` and its children
 *    already render. Nothing outside `resourceService`'s mapper should
 *    ever construct a `Resource` by hand.
 *
 * Keeping these separate (instead of bolting extra optional fields onto
 * one type) is what lets the backend evolve without the UI layer caring.
 */

// ---------------------------------------------------------------------------
// Raw backend DTO — GET /api/storage/library
// ---------------------------------------------------------------------------

export type BookType =
  | "TEXTBOOK"
  | "PAST_QUESTION"
  | "STUDY_GUIDE"
  | "REFERENCE";

export type BookStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export const FILE_FORMATS = ["PDF", "EPUB", "DOC", "DOCX"] as const;
export type FileFormat = (typeof FILE_FORMATS)[number];

export interface BookDto {
  id: string;
  storageObjectId: string;
  title: string;
  author: string;
  description: string;
  level: string;
  department: string;
  bookType: BookType;
  fileFormat: FileFormat;
  // Optional cover image URL from the public book-covers bucket. Null when
  // the admin didn't supply one — the UI falls back to a file-type icon.
  coverImageUrl: string | null;
  status: BookStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // Engagement counters returned from PostgreSQL books table
  previewCount?: number;
  downloadCount?: number;
  views?: number;
  downloads?: number;
}

export interface LibraryResponse {
  success: boolean;
  books: BookDto[];
}

// ---------------------------------------------------------------------------
// Frontend view model — what Vault.tsx renders
// ---------------------------------------------------------------------------

export interface ResourceStats {
  likes: number;
  comments: number;
  downloads: number;
  views: number;
}

export interface Resource {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  level: string;
  department: string;
  fileType: string;
  uploadedBy: string;
  timestamp: string;
  stats: ResourceStats;
  category: string;
  // Real admin-supplied cover image, or null. No fake placeholder photo is
  // substituted here — the UI decides how to render the null case (icon).
  coverImageUrl: string | null;
}
