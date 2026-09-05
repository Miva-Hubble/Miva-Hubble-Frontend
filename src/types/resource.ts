/**
 * resource.ts
 *
 * Legacy Book-only types. Mostly superseded by `types/vaultResource.ts`
 * (the unified GET /api/vault feed — see `VaultResourceDto`), after the
 * Vault switched from GET /api/storage/library to the unified endpoint.
 *
 * What remains here are the pieces still genuinely shared:
 *  - `BookType` — used by `categoryLabels.ts`'s BOOK_TYPE_LABELS map.
 *  - `BookStatus` — kept alongside `BookType` for the same reason.
 *  - `FILE_FORMATS` / `FileFormat` — used by the Vault file-type filter
 *    dropdown (`Vault.tsx`), and matches `VaultResourceDto.fileFormat`.
 *
 * `BookDto`, `LibraryResponse`, `Resource`, and `ResourceStats` (the old
 * library-endpoint contract and its view model) were removed here —
 * see `_deprecated/` at the repo root for the retired originals.
 */

export type BookType =
  | "TEXTBOOK"
  | "PAST_QUESTION"
  | "STUDY_GUIDE"
  | "REFERENCE";

export type BookStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export const FILE_FORMATS = ["PDF", "EPUB", "DOC", "DOCX"] as const;
export type FileFormat = (typeof FILE_FORMATS)[number];
