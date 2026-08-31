import type { BookType } from "../../../types/resource";

/**
 * categoryLabels.ts
 *
 * Maps the backend's `bookType` enum to the exact display strings used by
 * `POPULAR_CATEGORIES` (see `popular_categories.ts`) so category filtering
 * in the Vault UI actually matches what's rendered on each card.
 *
 * If the backend ever adds a new `bookType` value, TypeScript will NOT
 * catch a missing entry here (the fallback humanizer below covers it at
 * runtime) — but it's worth updating this map deliberately so the label
 * stays consistent with the filter dropdown instead of drifting.
 */

const BOOK_TYPE_LABELS: Record<BookType, string> = {
  TEXTBOOK: "Textbooks",
  PAST_QUESTION: "Past Questions",
  STUDY_GUIDE: "Study Guides",
  REFERENCE: "Reference",
};

export const CATEGORY_LABELS = Object.values(BOOK_TYPE_LABELS);

export function getCategoryLabel(bookType: string): string {
  if (bookType in BOOK_TYPE_LABELS) {
    return BOOK_TYPE_LABELS[bookType as BookType];
  }

  // Fallback for any future/unmapped enum value: "SOME_NEW_TYPE" -> "Some New Type"
  return bookType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
